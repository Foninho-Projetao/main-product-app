import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Lateralizar() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [exerciseId, setExerciseId] = useState(null);

    // Estados que serão preenchidos pela API
    const [videoUri, setVideoUri] = useState("");
    const [instructions, setInstructions] = useState("");
    const [timesPerDay, setTimesPerDay] = useState("1");
    const [repetitions, setRepetitions] = useState("");

    // Busca os dados do exercício ao carregar a tela
    useEffect(() => {
        const fetchExerciseData = async () => {
            try {
                const response = await fetch("http://localhost:3000/exercicios?nome_exercicio=Lateralizar");
                const data = await response.json();
                
                if (data.length > 0) {
                    const exercise = data[0];
                    setExerciseId(exercise.id);
                    setInstructions(exercise.texto_descritivo || "");
                    setRepetitions(exercise.repeticoes?.toString() || "10");
                    setVideoUri(exercise.video_exemplo || "");
                    setTimesPerDay(exercise.vezes_ao_dia?.toString() || "1");
                }
            } catch (error) {
                console.error("Erro ao buscar exercício:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados do exercício");
            } finally {
                setIsLoading(false);
            }
        };

        fetchExerciseData();
    }, []);

    const validateForm = () => {
        setIsButtonDisabled(!(instructions && timesPerDay && repetitions));
    };

    const handleInputChange = (field: string, value: string) => {
        switch (field) {
            case "instructions":
                setInstructions(value);
                break;
            case "timesPerDay":
                setTimesPerDay(value || "1");
                break;
            case "repetitions":
                setRepetitions(value || "10");
                break;
        }
        validateForm();
    };

    const handleConfirm = async () => {
        if (isButtonDisabled) return;

        setIsLoading(true);
        
        try {
            const response = await fetch(`http://localhost:3000/exercicios/${exerciseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    texto_descritivo: instructions,
                    repeticoes: parseInt(repetitions),
                    video_exemplo: videoUri,
                    vezes_ao_dia: parseInt(timesPerDay),
                    // Inclua outros campos que deseja atualizar
                }),
            });

            if (response.ok) {
                Alert.alert("Sucesso", "Exercício atualizado com sucesso!");
                
            } else {
                throw new Error("Falha ao atualizar");
            }

            
        } catch (error) {
            console.error("Erro ao atualizar exercício:", error);
            Alert.alert("Erro", "Não foi possível atualizar o exercício");
        } finally {
            setIsLoading(false);
            router.push("/patientProfile/patientProfile");
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#006FFD" />
                <Text>Carregando exercício...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header1}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="#006FFD" />
                </TouchableOpacity>
                <Text style={styles.title1}>Editar exercício</Text>
                <View style={{ width: 24 }} />
            </View>
            
            <View style={styles.header}>
                <Text style={styles.title}>Lateralizar</Text>
                <Text style={styles.subtitle}>Motricidade orofacial</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Link do vídeo demonstrativo:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Cole o link do vídeo (ex: https://...)"
                    value={videoUri}
                    onChangeText={(text) => setVideoUri(text)}
                    autoCapitalize="none"
                    keyboardType="url"
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Instruções</Text>
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    value={instructions}
                    onChangeText={(text) => handleInputChange("instructions", text)}
                    multiline
                />
            </View>

            <View style={styles.repdia}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vezes ao dia</Text>
                    <TextInput
                        style={styles.input}
                        value={timesPerDay}
                        onChangeText={(text) => handleInputChange("timesPerDay", text)}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Repetições</Text>
                    <TextInput
                        style={styles.input}
                        value={repetitions}
                        onChangeText={(text) => handleInputChange("repetitions", text)}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <TouchableOpacity
                style={[styles.confirmButton, isButtonDisabled && styles.disabledButton]}
                onPress={handleConfirm}
                disabled={isButtonDisabled || isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header1: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 47,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#E7E7E7",
    },
    title1: {
        fontSize: 18,
        fontWeight: "bold",
    },
    repdia: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    header: {
        marginTop: 19,
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 14,
        color: "#50525A",
        marginTop: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#000",
    },
    input: {
        borderWidth: 2,
        borderColor: "#AFBED1",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#F8F9FE",
    },
    confirmButton: {
        backgroundColor: "#006FFD",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
    },
    disabledButton: {
        backgroundColor: "#cccccc",
    },
    confirmButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});