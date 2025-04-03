import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import FloatingAction from "@/components/FloatingActionButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Exercise {
  id: string;
  nome: string;
  categoria: "motricidadeOrofacial" | "outros";
}

export default function Exercicios() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: "1", nome: "Lateralizar", categoria: "motricidadeOrofacial" },
    { id: "2", nome: "Treino de respiração", categoria: "outros" },
    { id: "3", nome: "Protuir e retrair", categoria: "motricidadeOrofacial" },
    { id: "4", nome: "Relaxamento da musculatura", categoria: "outros" },
  ]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(exercises);

  const filterExercises = (filter: string) => {
    setSelectedFilter(filter);
    setFilteredExercises(
      filter === "todos"
        ? exercises
        : exercises.filter((ex) => ex.categoria === "motricidadeOrofacial")
    );
  };

  const searchExercises = (query: string) => {
    setSearchQuery(query);
    setFilteredExercises(
      exercises.filter(
        (ex) =>
          ex.nome.toLowerCase().includes(query.toLowerCase()) &&
          (selectedFilter === "todos" || ex.categoria === selectedFilter)
      )
    );
  };

  const handleExercisePress = (exerciseName: string) => {
    if (exerciseName === "Lateralizar") {
      router.navigate("/exercisesFono/lateralizar"); // Redireciona para a página lateralizar
    } else {
      alert(`Selecionado: ${exerciseName}`); // Mostra alerta para os outros exercícios: frontend/app/exercisesFono
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
        <Text style={styles.title}>Adicionar exercício</Text>
        <View style={{ width: 24 }} /> {/* Espaçamento para alinhamento */}
      </View>
      <ScrollView style={styles.container}>
        
        <View style={styles.body}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar exercícios..."
            value={searchQuery}
            onChangeText={searchExercises}
          />
          <View style={styles.divider} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["todos", "motricidadeOrofacial"].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={{ marginRight: 8 }}
                onPress={() => filterExercises(filter)}
              >
                <Text
                  style={{
                    padding: 8,
                    borderRadius: 16,
                    backgroundColor:
                      selectedFilter === filter ? "#006FFD" : "#EAF2FF",
                    color: selectedFilter === filter ? "#fff" : "#006FFD",
                    fontWeight: "bold",
                    marginTop: 16,
                  }}
                >
                  {filter === "todos" ? "Todos" : "Motricidade Orofacial"}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.divider} />
          <View style={styles.exercisesDiv}>
            {filteredExercises.map((item) => (
              <TouchableOpacity
                style={styles.exerciseItemDiv}
                key={item.id}
                onPress={() => handleExercisePress(item.nome)}
              >
                <Text style={{ color: "#50525A", fontWeight: "600" }}>
                  {item.nome}
                </Text>
              </TouchableOpacity>
            ))}
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
    color: "#8F9098"
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
  },
  floatingActionButton: {
    position: "absolute",
    right: 56,
    bottom: 56,
    zIndex: 1,
  },
});