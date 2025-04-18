import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import StatusFeito from "../../assets/images/statusFeito.svg";
import StatusMedia from "../../assets/images/statusMedia.svg";
import StatusNaoFeito from "../../assets/images/statusNaoFeito.svg";
import StatusReprovado from "../../assets/images/statusReprovado.svg";


// Interface para os exercícios
interface Exercise {
  nome_exercicio: string;
  data: string;
  nota_execucao: number;
}

export default function PatientProfile() {
  const { cpf } = useLocalSearchParams();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("Exercícios");
  const [selectedSubTab, setSelectedSubTab] = useState("7 dias");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [patientName, setPatientName] = useState("");
  const [hiddenExercises, setHiddenExercises] = useState<string[]>([]);
  const [today, setToday] = useState(new Date().getDay());

  const renderDaysOfWeek = (lastDayIndex: number) => {
    let daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

    daysOfWeek = [
      ...daysOfWeek.slice(lastDayIndex + 1),
      ...daysOfWeek.slice(0, lastDayIndex + 1),
    ];

    return daysOfWeek.map((day, index) => (
      <View
        key={index}
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "PlusJakartaSans_400Regular",
            color: index === today ? "#000" : "#50525A",
            fontWeight: index === today ? "bold" : "normal",
          }}
        >
          {day}
        </Text>
        {index == 0 || index == 3 || index == 4 || index == 5 ? (
          <StatusFeito width={24} height={24} />
        ) : index == 1 ? (
          <StatusReprovado width={24} height={24} />
        ) : index == 2 ? (
          <StatusMedia width={24} height={24} />
        ) : (
          <StatusNaoFeito width={24} height={24} />
        )}
      </View>
    ));
  };

  const fetchPatientName = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/progresso/pacientes/${cpf}`
      );
      const data = await response.json();
      setPatientName(data.nome);
    } catch (error) {
      console.log("Erro ao buscar o nome do paciente:", error);
    }
  };
  useEffect(() => {
    fetchPatientName();
  }, []);

  // Função para buscar os exercícios
  const fetchExercises = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/progresso/exercicios/${cpf}`
      );
      const data = await response.json();
  
      if (Array.isArray(data)) {
        setExercises(data);
      } else {
        console.error("Dados recebidos não são um array:", data);
        setExercises([]); // previne erro
      }
    } catch (error) {
      console.log("Erro ao buscar exercícios:", error);
      setExercises([]); // previne erro
    }
  };

  useEffect(() => {
    if (selectedTab === "Progresso" || selectedTab === "Exercícios") {
      fetchExercises();
    }
  }, [selectedTab]);

  const calculateAverage = (period: string): string => {
    const now = new Date();
    let filteredExercises: Exercise[] = [];

    if (period === "7 dias") {
      filteredExercises = exercises.filter((exercise) => {
        const exerciseDate = new Date(exercise.data);
        return (
          now.getTime() - exerciseDate.getTime() <= 7 * 24 * 60 * 60 * 1000
        );
      });
    } else if (period === "Mensal") {
      filteredExercises = exercises.filter((exercise) => {
        const exerciseDate = new Date(exercise.data);
        return (
          now.getFullYear() === exerciseDate.getFullYear() &&
          now.getMonth() === exerciseDate.getMonth()
        ); // Mesmo mês
      });
    } else if (period === "3 meses") {
      filteredExercises = exercises.filter((exercise) => {
        const exerciseDate = new Date(exercise.data);
        return (
          now.getTime() - exerciseDate.getTime() <= 3 * 30 * 24 * 60 * 60 * 1000
        );
      });
    }

    if (filteredExercises.length === 0) return "0.0"; // Sem exercícios no período

    const total = filteredExercises.reduce(
      (sum, exercise) => sum + exercise.nota_execucao,
      0
    );
    return (total / filteredExercises.length).toFixed(1); // Média com 1 casa decimal
  };

  // Função para ocultar/exibir exercício
  const toggleExerciseVisibility = (exerciseId: string) => {
    setHiddenExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={24} color="#006FFD" />
          </TouchableOpacity>
          <Text style={styles.title}>Paciente</Text>
          <Text></Text>
        </View>
        <View style={styles.body}>
          <View style={styles.profileBannerDiv}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: "#E7E7E7",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#000", fontSize: 18 }}>
              {patientName
                ? patientName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "?"}
            </Text>
          </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 8,
              }}
            >
              <View style={{ gap: 8 }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#50525A",
                  }}
                >
                  {patientName || "Carregando..."}
                </Text>
                <Text style={{ fontSize: 16, color: "#50525A" }}>
                  Terças | 14h
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Abas */}
          <View style={styles.tabs}>
            {["Frequência", "Desempenho", "Exercícios"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={styles.tab}
                onPress={() => setSelectedTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
                {selectedTab === tab && <View style={styles.activeTabLine} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Conteúdo das abas */}
          {selectedTab === "Desempenho" && (
            <View style={styles.tabContent}>
              {/* Aba de seleção */}
              <View style={styles.subTabs}>
                {["7 dias", "3 meses", "Tratamento Inteiro"].map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.subTab,
                      selectedSubTab === period && styles.activeSubTab,
                    ]}
                    onPress={() => setSelectedSubTab(period)}
                  >
                    <Text
                      style={[
                        styles.subTabText,
                        selectedSubTab === period && styles.activeSubTabText,
                      ]}
                    >
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Progresso */}
              <View style={{ marginBottom: 8 }}>
                <Text style={styles.progressTitle}>Exercicios</Text>
              </View>

              <View style={styles.progressContainer}>
                <Text style={styles.progressPeriod}>{selectedSubTab}</Text>
                <View
                  style={[
                    styles.progressCircle,
                    parseFloat(calculateAverage(selectedSubTab)) >= 4
                      ? styles.greenCircle
                      : parseFloat(calculateAverage(selectedSubTab)) >= 2
                        ? styles.yellowCircle
                        : styles.redCircle,
                  ]}
                >
                  <Entypo name="star" size={16} color="#fff" />
                  <Text style={styles.progressText}>
                    {calculateAverage(selectedSubTab)}
                  </Text>
                </View>
              </View>

              <View style={styles.dividerLarge} />
              
              {/* Exercícios realizados */}
              <Text style={styles.tabTitle}>Exercícios Realizados</Text>
              {exercises.length > 0 ? (
                <FlatList
                  data={exercises}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.exerciseItem}>
                      <Text style={styles.exerciseName}>
                        {item.nome_exercicio}
                      </Text>
                      <View
                        style={[
                          styles.noteCircle,
                          item.nota_execucao >= 4
                            ? styles.greenCircle
                            : item.nota_execucao >= 2
                              ? styles.yellowCircle
                              : styles.redCircle,
                        ]}
                      >
                        <Entypo name="star" size={16} color="#fff" />
                        <Text style={styles.noteText}>
                          {item.nota_execucao}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              ) : (
                <Text style={styles.noDataText}>
                  Nenhum exercício encontrado.
                </Text>
              )}
            </View>
          )}

          {/* Conteúdo da aba Exercícios */}
          {selectedTab === "Exercícios" && (
            <View style={styles.exercisesContainer}>
              <Text style={styles.exercisesTitle}>Exercícios</Text>

              <TouchableOpacity
                style={styles.addExerciseButton}
                onPress={() => router.push("/exercisesFono/adicionarExercicio")}
              >
                <Text style={styles.addExerciseText}>Adicionar exercício</Text>
              </TouchableOpacity>
              <Text style={styles.categoryTitle}>Motricidade orofacial</Text>
              <FlatList
                data={exercises.filter(
                  (e) => !hiddenExercises.includes(e.nome_exercicio)
                )}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.exerciseItemDiv}
                    onPress={() =>
                      router.push({
                        pathname: "/exercisesFono/editarExercicio",
                        params: { exercicio: JSON.stringify(item) },
                      })
                    }
                  >
                    <View style={styles.exerciseContent}>
                      <View style={styles.leftContent}>
                        <Image
                          source={require("@/assets/images/lips.png")}
                          style={styles.leftImage}
                        />
                        <Text style={styles.exerciseName}>
                          {item.nome_exercicio}
                        </Text>
                      </View>

                      {/* Botão da lixeira */}
                      <TouchableOpacity
                        onPress={() =>
                          toggleExerciseVisibility(item.nome_exercicio)
                        }
                      >
                        <Image
                          source={require("@/assets/images/Vector.png")} // coloque aqui a imagem da lixeira
                          style={{ width: 24, height: 24 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
          {selectedTab === "Frequência" && (
            <View>
              <Text style={styles.frequencyTitle}>Frequência</Text>
              <View style={styles.infoTextDivLine}>
                <Text style={{ fontSize: 12}}>Ultimos 7 dias</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 40,
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 12 }}>60%</Text>
                  <Text style={styles.regularLabel}>REGULAR</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View
                  style={{
                    flexDirection: "row",
                    margin: "1%",
                    marginTop: 16,
                    justifyContent: "space-between",
                  }}
                >
              {renderDaysOfWeek(today)}
            </View>
            <View style={styles.divider} />
            <View style={styles.infoTextDivLine}>
              <Text>Última semana</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 40,
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>85%</Text>
                <Text style={styles.bomLabel}>BOM</Text>
              </View>
            </View>
            <View style={styles.infoTextDivLine}>
              <Text>3 meses</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 40,
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>75%</Text>
                <Text style={styles.bomLabel}>BOM</Text>
              </View>
            </View>
            <View style={styles.infoTextDivLine}>
              <Text>Tratamento inteiro</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 40,
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>80%</Text>
                <Text style={styles.bomLabel}>BOM</Text>
              </View>
            </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  exercisesContainer: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  exercisesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  addExerciseButton: {
    backgroundColor: "#006FFD",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  addExerciseText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#50525A",
  },
  exerciseItemDiv: {
    padding: 16,
    backgroundColor: "#F8F9FE",
    borderRadius: 24,
    marginTop: 16,
    borderColor: "#FF9096",
    borderWidth: 4,
  },
  exerciseContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Isso empurra os itens para as extremidades
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Ocupa todo o espaço disponível (exceto o necessário para a imagem direita)
  },
  regularLabel: {
    backgroundColor: "#FF9096",
    color: "white",
    padding: 8,
    borderRadius: 50,
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 10,
  },
  leftImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 5,
  },
  rightImage: {
    width: 20,
    height: 20,
    marginLeft: 10, // Espaço entre o texto e a imagem direita
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flexShrink: 1, // Permite que o texto quebre se necessário
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 47,
    paddingBottom: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  divider: {
    marginTop: 16,
    height: 1,
    backgroundColor: "#E7E7E7",
  },
  body: {
    paddingHorizontal: 24,
  },
  profileBannerDiv: {
    height: 52,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 24,
    gap: 16,
  },
  infoTextDivLine: {
    alignItems: "center",
    marginTop: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  frequencyTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    marginTop: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    // backgroundColor: "#E7E7E7",
  },
  activeTab: {
    backgroundColor: "#006FFD",
  },
  tabText: {
    fontSize: 14,
    color: "#8CBEFF",
  },
  activeTabText: {
    fontSize: 14,
    color: "#006FFD", 
  },
  tabContent: {
    marginTop: 16,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  exerciseItem: {
    // marginBottom: 12,
    // padding: 12,
    // borderRadius: 25,
    // backgroundColor: "#F5F5F5"

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
  },
  exerciseDetails: {
    fontSize: 12,
    color: "#50525A",
  },
  noDataText: {
    fontSize: 14,
    color: "#50525A",
    textAlign: "center",
    marginTop: 16,
  },
  activeTabLine: {
    marginTop: 6,
    height: 6,
    width: "100%",
    backgroundColor: "#006FFD",
    borderRadius: 3,
  },

  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },

  noteCircle: {
    width: 75,
    height: 30,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
  },
  noteText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  greenCircle: {
    backgroundColor: "#4CAF50",
  },
  yellowCircle: {
    backgroundColor: "#FFC107",
  },
  redCircle: {
    backgroundColor: "#F44336",
  },

  subTabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: 16,
    gap: 20,
  },
  subTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: "#D6E9FF",
  },
  activeSubTab: {
    backgroundColor: "#006FFD",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    transform: [{ scale: 1.2 }],
  },
  subTabText: {
    fontSize: 14,
    color: "#006FFD",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  activeSubTabText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },

  dividerLarge: {
    height: 2,
    backgroundColor: "#E7E7E7",
    marginVertical: 16,
    width: "100%",
  },

  progressTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "left",
  },
  progressValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#006FFD",
  },

  progressCircle: {
    width: 65,
    height: 30,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 10,
    backgroundColor: "#F5F5F5",
    marginRight: 13,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 0,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  progressPeriod: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#50525A",
  },

  feedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E7E7E7",
    backgroundColor: "#fff",
  },
  feedbackInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  feedbackButton: {
    backgroundColor: "#006FFD",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  feedbackButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  scrollContent: {
    flexGrow: 1, // Permite que o conteúdo ocupe apenas o espaço necessário
    paddingBottom: 80, // Espaço para o feedback fixo
  },
  bomLabel: {
    backgroundColor: "#006FFD",
    color: "white",
    padding: 8,
    borderRadius: 50,
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 10,
  },
});