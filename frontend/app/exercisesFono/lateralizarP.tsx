import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from "react-native";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Lateralizar() {
    const router = useRouter();
    const videoRef = useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const [instructions, setInstructions] = useState(
        "1 ) Realizar 10x de cada lado  2 ) Tocar ponta da língua nas laterais dos lábios"
    );
    const [timesPerDay, setTimesPerDay] = useState("1");
    const [repetitions, setRepetitions] = useState("10");

    const pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setVideoUri(result.assets[0].uri);
        }
    };

    const validateForm = () => {
        setIsButtonDisabled(!(instructions && timesPerDay && repetitions));
    };

    const handleInputChange = (field: string, value: string) => {
        if (value === "") {
            switch (field) {
                case "instructions":
                    setInstructions("1 ) Realizar 10x de cada lado  2 ) Tocar ponta da língua nas laterais dos lábios");
                    break;
                case "timesPerDay":
                    setTimesPerDay("1");
                    break;
                case "repetitions":
                    setRepetitions("10");
                    break;
            }
        } else {
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
        }
        validateForm();
    };

    const handleConfirm = () => {
        if (!isButtonDisabled) {
            Alert.alert("Exercício adicionado", "O exercício Lateralizar foi configurado com sucesso!");
            router.back();
        }
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
                <Text style={styles.sectionTitle}>Vídeo demonstrativo:</Text>

                {videoUri ? (
                    <View style={styles.videoContainer}>
                        <Video
                            ref={videoRef}
                            style={styles.video}
                            source={{ uri: videoUri }}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            isLooping
                            onPlaybackStatusUpdate={setStatus}
                        />
                    </View>
                ) : (
                    <TouchableOpacity style={styles.videoButton} onPress={pickVideo}>
                        <Text style={styles.videoButtonText}>Selecionar vídeo</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Instruções</Text>
                <TextInput
                    style={styles.input}
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
        borderWidth: 1,
        borderColor: "#E7E7E7",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#F8F9FE",
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
    videoButton: {
        backgroundColor: "#EAF2FF",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    videoButtonText: {
        color: "#006FFD",
        fontWeight: "600",
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
