import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

export default function Teste() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("Exercícios");

  return (
    <ScrollView style={styles.container}>
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
              uri: "https://avatars.githubusercontent.com/u/55458349?v=4",
            }}
          />
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
                style={{ fontSize: 14, fontWeight: "600", color: "#50525A" }}
              >
                Ana Bolena de Almeida Gonçalves
              </Text>
              <Text style={{ fontSize: 16, color: "#50525A" }}>
                Terças | 14h
              </Text>
            </View>
            <Entypo name="dots-three-vertical" size={20} color="black" />
          </View>
        </View>
        <View style={styles.divider} />
      </View>
      <View style={styles.tabContainer}>
        {[
          { key: "Frequência", label: "Frequência" },
          { key: "Progresso", label: "Progresso" },
          { key: "Exercícios", label: "Exercícios" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.key && styles.selectedTabText,
              ]}
            >
              {tab.label}
            </Text>
            {selectedTab === tab.key && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo da aba Exercícios */}
      {selectedTab === "Exercícios" && (
        <View style={styles.exercisesContainer}>
          <Text style={styles.exercisesTitle}>Exercícios</Text>

          <TouchableOpacity
            style={styles.addExerciseButton}
            onPress={() => router.push('/exercisesFono/adicionarExercicio')}
          >
            <Text style={styles.addExerciseText}>Adicionar exercício</Text>
          </TouchableOpacity>

          <Text style={styles.categoryTitle}>Motricidade orofacial</Text>

          <TouchableOpacity
            style={styles.exerciseCard}
            onPress={() => router.push('/exercisesFono/lateralizarP')} // Rota para a nova tela
          >
            <Text style={styles.exerciseName}>Lateralizar</Text>
            <Text style={styles.exerciseReps}>1 x 10</Text>
          </TouchableOpacity>

        </View>
      )}
    </ScrollView>
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
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E7E7E7",
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 16,
    color: "#A0A0A0",
    fontWeight: "500",
  },
  selectedTabText: {
    color: "#006FFD",
    fontWeight: "bold",
  },
  tabIndicator: {
    height: 3,
    backgroundColor: "#006FFD",
    marginTop: 4,
    borderRadius: 20,
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
    alignItems: 'center',
    marginBottom: 24,
  },
  addExerciseText: {
    color: "white",
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#50525A",
  },
  exerciseCard: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseName: {
    fontSize: 16,
    color: "#50525A",
  },
  exerciseReps: {
    fontSize: 14,
    color: "white",
    backgroundColor: "#006FFD",
    padding: 8,
    borderRadius: 20
  },
});