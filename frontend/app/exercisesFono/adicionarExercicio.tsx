import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import FloatingAction from "@/components/FloatingActionButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Exercise {
  id: string | null;
  nome_exercicio: string;
}

export default function Exercicios() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch("http://localhost:3000/exercicios"); // Alterar para o endpoint correto
        const data = await response.json();

        // Se o ID for nulo, geramos um temporário
        const formattedData = data.map((ex: any) => ({
          id: ex.id ?? Math.random().toString(), // Se id for null, cria um temporário
          nome_exercicio: ex.nome_exercicio,
        }));

        setExercises(formattedData);
        setFilteredExercises(formattedData); // Inicializa os exercícios filtrados
      } catch (error) {
        console.error("Erro ao buscar exercícios:", error);
      }
    };

    fetchExercises();
  }, []);

  // Função para filtrar exercícios com base na pesquisa
  const searchExercises = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(
        exercises.filter((ex) =>
          ex.nome_exercicio.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  return (
    <>
      <View style={styles.floatingActionButton}>
        <FloatingAction />
      </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#006FFD" />
        </TouchableOpacity>
        <Text style={styles.title}>Exercícios</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.body}>
          {/* Campo de pesquisa */}
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar exercícios..."
            value={searchQuery}
            onChangeText={searchExercises}
          />
          <View style={styles.divider} />
          <View style={styles.exercisesDiv}>
            {filteredExercises.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum exercício encontrado</Text>
            ) : (
              filteredExercises.map((item) => (
                <TouchableOpacity
                  style={styles.exerciseItemDiv}
                  key={item.id}
                  onPress={() => router.push('/exercisesFono/lateralizar')}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={require('@/assets/images/lips.png')} // ou require('../assets/exemplo.png') se for local
                      style={{ width: 40, height: 40, marginRight: 10, borderRadius: 5 }}
                    />
                    <Text style={{ color: "#50525A", fontWeight: "600" }}>
                      {item.nome_exercicio}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 47,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E7E7E7",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  body: {
    paddingHorizontal: 24,
  },
  searchInput: {
    marginTop: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: 16,
    backgroundColor: "#EAF3FF",
    color: "#8F9098",
  },
  divider: {
    marginTop: 16,
    height: 1,
    backgroundColor: "#E7E7E7",
  },
  exercisesDiv: {
    marginTop: 16,
  },
  exerciseItemDiv: {
    padding: 16,
    backgroundColor: "#F8F9FE",
    borderRadius: 24,
    marginTop: 16,
    borderColor: "#FF9096",
    borderWidth: 4
  },
  emptyText: {
    textAlign: "center",
    color: "#8F9098",
    marginTop: 20,
  },
  floatingActionButton: {
    position: "absolute",
    right: 56,
    bottom: 56,
    zIndex: 1,
  },
});
