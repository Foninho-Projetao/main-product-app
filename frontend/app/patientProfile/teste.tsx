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
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import { useState, useEffect } from 'react';

// Interface para os exercícios
interface Exercise {
  nome_exercicio: string;
  data: string;
  nota_execucao: number;
}

export default function Teste() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('Exercícios'); 
  const [selectedSubTab, setSelectedSubTab] = useState('7 dias'); 
  const [exercises, setExercises] = useState<Exercise[]>([]); 
  const [patientName, setPatientName] = useState(''); 
  const [feedback, setFeedback] = useState(""); // Estado para armazenar o feedback

  const cpf = '12345678900'; 

  const sendFeedback = async () => {
    if (!feedback.trim()) {
      alert("Por favor, digite um feedback antes de enviar.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/pacientes/${cpf}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback }),
      });
  
      if (response.ok) {
        alert("Feedback enviado com sucesso!");
        setFeedback(""); // Limpa o campo de texto após o envio
      } else {
        const errorData = await response.json();
        alert(`Erro ao enviar feedback: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      alert("Erro ao enviar feedback. Tente novamente mais tarde.");
    }
  };


  const fetchPatientName = async () => {
    try {
      const response = await fetch(`http://localhost:3000/pacientes/${cpf}`);
      const data = await response.json(); 
      setPatientName(data.nome); 
    } catch (error) {
      console.error('Erro ao buscar o nome do paciente:', error);
    }
  };
  useEffect(() => {
    fetchPatientName(); 
  }, []);


  // Função para buscar os exercícios
  const fetchExercises = async () => {
    try {
      const response = await fetch(`http://localhost:3000/exercicios/${cpf}`);
      const data: Exercise[] = await response.json(); 
      setExercises(data);
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error);
    }
  };

 
  useEffect(() => {
    if (selectedTab === 'Progresso') {
      fetchExercises();
    }
  }, [selectedTab]);


  const calculateAverage = (period: string): string => {
    const now = new Date();
    let filteredExercises: Exercise[] = [];
  
    if (period === '7 dias') {
      filteredExercises = exercises.filter((exercise) => {
        const exerciseDate = new Date(exercise.data);
        return now.getTime() - exerciseDate.getTime() <= 7 * 24 * 60 * 60 * 1000; 
      });
    } else if (period === 'Mensal') {
      filteredExercises = exercises.filter((exercise) => {
        const exerciseDate = new Date(exercise.data);
        return (
          now.getFullYear() === exerciseDate.getFullYear() &&
          now.getMonth() === exerciseDate.getMonth()
        ); // Mesmo mês
      });
    } else if (period === '3 meses') {
      filteredExercises = exercises.filter((exercise) => {
        const exerciseDate = new Date(exercise.data);
        return now.getTime() - exerciseDate.getTime() <= 3 * 30 * 24 * 60 * 60 * 1000; 
      });
    }
  
    if (filteredExercises.length === 0) return '0.0'; // Sem exercícios no período
  
    const total = filteredExercises.reduce(
      (sum, exercise) => sum + exercise.nota_execucao,
      0
    );
    return (total / filteredExercises.length).toFixed(1); // Média com 1 casa decimal
  };





   return (
    <View style={{ flex: 1, backgroundColor: '#fff'  }}>
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
            <Image
              style={{ width: 52, height: 52, borderRadius: 25 }}
              source={{
                uri: 'https://avatars.githubusercontent.com/u/55458349?v=4',
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <View style={{ gap: 8 }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#50525A',
                  }}
                >
                  {patientName || 'Carregando...'}
                </Text>
                <Text style={{ fontSize: 16, color: '#50525A' }}>
                  Terças | 14h
                </Text>
              </View>
              <Entypo name="dots-three-vertical" size={20} color="black" />
            </View>
          </View>
          <View style={styles.divider} />

          {/* Abas */}
          <View style={styles.tabs}>
            {['Exercícios', 'Frequência', 'Progresso'].map((tab) => (
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
          {selectedTab === 'Progresso' && (
            <View style={styles.tabContent}>
              {/* Aba de seleção */}
              <View style={styles.subTabs}>
                {['7 dias', 'Mensal', '3 meses'].map((period) => (
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
                <Text style={styles.progressTitle}>Progresso</Text>
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
        </View>
      </ScrollView>

      <View style={styles.feedbackContainer}>
        <TextInput
          style={styles.feedbackInput}
          placeholder="Digite seu feedback..."
          value={feedback}
          onChangeText={setFeedback}
        />
        <TouchableOpacity style={styles.feedbackButton} onPress={sendFeedback}>
          <Text style={styles.feedbackButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}






const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 47,
    paddingBottom: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    marginTop: 16,
    height: 1,
    backgroundColor: '#E7E7E7',
  },
  body: {
    paddingHorizontal: 24,
  },
  profileBannerDiv: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 24,
    gap: 16,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8
    // backgroundColor: "#E7E7E7",
  },
  activeTab: {
    backgroundColor: '#006FFD',
  },
  tabText: {
    fontSize: 14,
    color: '#50525A',
  },
  activeTabText: {
    fontSize: 16, 
    color: 'black',
    fontWeight: 'bold',
  },
  tabContent: {
    marginTop: 16,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseItem: {
    // marginBottom: 12,
    // padding: 12,
    // borderRadius: 25,
    // backgroundColor: "#F5F5F5"

    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12,
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#50525A',
  },
  noDataText: {
    fontSize: 14,
    color: '#50525A',
    textAlign: 'center',
    marginTop: 16,
  },
  activeTabLine: {
    marginTop: 6,
    height: 6,
    width: '100%',
    backgroundColor: '#006FFD', 
    borderRadius: 3, 
  },
  

  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },


  noteCircle: {
    width: 75, 
    height: 30, 
    borderRadius: 24, 
    alignItems: 'center',
    justifyContent: 'space-between', 
    flexDirection: 'row', 
    paddingHorizontal: 12, 
    backgroundColor: '#F5F5F5', 
  },
  noteText: {
    fontSize: 14, 
    fontWeight: 'bold',
    color: '#fff', 
  },
  greenCircle: {
    backgroundColor: '#4CAF50', 
  },
  yellowCircle: {
    backgroundColor: '#FFC107', 
  },
  redCircle: {
    backgroundColor: '#F44336', 
  },





  subTabs: {
    flexDirection: 'row',
    justifyContent: 'center', 
    marginTop: 5,
    marginBottom: 16,
    gap: 20, 

  },
  subTab: {
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 15,
    backgroundColor: '#D6E9FF', 
  },
  activeSubTab: {
    backgroundColor: '#006FFD',
    paddingVertical: 8,
    paddingHorizontal: 14, 
    borderRadius: 18, 
    transform: [{ scale: 1.2 }],
  },
  subTabText: {
    fontSize: 14,
    color: '#006FFD', 
  },
  activeSubTabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff', 
  },







  dividerLarge: {
    height: 2, 
    backgroundColor: '#E7E7E7', 
    marginVertical: 16, 
    width: '100%', 
  },





  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left', 
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006FFD', 
  },


  

  progressCircle: {
    width: 65, 
    height: 30, 
    borderRadius: 24, 
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row', 
    paddingHorizontal: 10, 
    backgroundColor: '#F5F5F5', 
    marginRight: 13, 

  },
  progressText: {
    fontSize: 14, 
    fontWeight: 'bold',
    color: '#fff', 
    marginTop: 0, 
  },
  progressContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 0, 
  },
  progressPeriod: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#50525A', 
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


});