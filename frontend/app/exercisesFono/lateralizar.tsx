import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Lateralizar() {
    const router = useRouter();
    const videoRef = useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);
    const [instructions, setInstructions] = useState("");
    const [timesPerDay, setTimesPerDay] = useState("");
    const [repetitions, setRepetitions] = useState("");
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        validateForm();
    }, [instructions, timesPerDay, repetitions, videoUri]);

    const validateForm = () => {
        setIsButtonDisabled(!(instructions && timesPerDay && repetitions && videoUri));
    };

    const handleInputChange = (field: string, value: string) => {
        switch (field) {
            case "instructions":
                setInstructions(value);
                break;
            case "timesPerDay":
                setTimesPerDay(value);
                break;
            case "repetitions":
                setRepetitions(value);
                break;
        }
    };

    const handleConfirm = async () => {
        if (isButtonDisabled) return;

        try {
            const response = await fetch("http://localhost:3000/exercicios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome_exercicio: "Lateralizar",
                    repeticoes: repetitions,
                    texto_descritivo: instructions,
                    video_exemplo: videoUri,
                    cpf_fono: "98765432100",
                    cpf_paciente: "12345678900",
                    data_execucao: new Date().toISOString().split("T")[0],
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao salvar exercício");
            }

            Alert.alert("Sucesso", "O exercício foi salvo!");
            router.push("/patientProfile/patientProfile");

        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível salvar o exercício.");
        }
    };

    const handlePlayPause = () => {
        status.isLoaded && status.isPlaying
            ? videoRef.current?.pauseAsync()
            : videoRef.current?.playAsync();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header1}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="#006FFD" />
                </TouchableOpacity>
                <Text style={styles.title1}>Adicionar exercício</Text>
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
                    value={videoUri || ""}
                    onChangeText={(text) => setVideoUri(text)}
                    autoCapitalize="none"
                    keyboardType="url"
                />
            </View>

            {videoUri ? (
                <View style={styles.videoContainer}>
                    <Video
                        ref={videoRef}
                        style={styles.video}
                        source={{ uri: videoUri }}
                        useNativeControls={false}
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                        onPlaybackStatusUpdate={setStatus}
                    />
                    <TouchableOpacity
                        style={styles.playButton}
                        onPress={handlePlayPause}
                    >
                        <Ionicons
                            name={status.isLoaded && status.isPlaying ? "pause" : "play"}
                            size={32}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            ) : null}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Instruções</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Escreva as instruções"
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
                        placeholder="Vezes ao dia"
                        value={timesPerDay}
                        onChangeText={(text) => handleInputChange("timesPerDay", text)}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Repetições</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Por sessão"
                        value={repetitions}
                        onChangeText={(text) => handleInputChange("repetitions", text)}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <TouchableOpacity
                style={[styles.confirmButton, isButtonDisabled && styles.disabledButton]}
                onPress={handleConfirm}
                disabled={isButtonDisabled}
            >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
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
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    subtitle: {
        fontSize: 14,
        color: "#50525A",
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
        flex: 1,
        paddingRight: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#000",
    },
    videoContainer: {
        height: 200,
        backgroundColor: "#000",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
    },
    video: {
        width: "100%",
        height: "100%",
    },
    playButton: {
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 50,
        padding: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E7E7E7",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#F8F9FE",
        color: "#8F9098",
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
