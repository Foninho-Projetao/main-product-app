import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";


export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { id: "1", text: "Boa tarde", sender: "other" },
    { id: "2", text: "Parabéns! Continue com o bom trabalho :)", sender: "other" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: input.trim(), sender: "me" },
    ]);
    setInput("");
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.name}>Feedback</Text>

       
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === "me" ? styles.myMessage : styles.otherMessage,
              ]}
            >
              <Text
                style={[
                  styles.senderName,
                  item.sender === "me" && { color: "#fff" },
                ]}
              >
                {item.sender === "me" ? "Você" : "Maiara Lourenço de Lima"}
              </Text>
              <Text
                style={[
                  styles.messageText,
                  item.sender === "me" && { color: "#fff" },
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
      />


      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
                <TextInput
                style={styles.input}
                placeholder="Digite uma mensagem..."
                value={input}
                onChangeText={setInput}
                />
                <TouchableOpacity onPress={handleSend} style={styles.inlineSendButton}>
                <Ionicons name="send" size={20} color="#006FFD" />
                </TouchableOpacity>
            </View>
            </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start", 
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      },
      name: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#006FFD",
        textAlign: "left", 
        paddingTop: 35,     
        fontFamily: "MontserratAlternates_800ExtraBold",
      },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginLeft: 12,
    },
    messagesContainer: {
      padding: 16,
      flexGrow: 1,
      borderRadius: 20,
        

    },
    messageBubble: {
      padding: 10,
      borderRadius: 12,
      maxWidth: "80%",
      marginBottom: 12,
      color: "#F8F9FE",  

      paddingTop: 12,
      paddingRight: 16,
      paddingBottom: 12,
      paddingLeft: 16,


    },
    otherMessage: {
      backgroundColor: "#EAF3FF",
      alignSelf: "flex-start",
    },
    myMessage: {
      backgroundColor: "#006FFD",
      alignSelf: "flex-end",
    },
    messageText: {
      fontSize: 14,
      color: "#1F2024",
        fontFamily: "PlusJakartaSans_400Regular",
    },


    sendButton: {
      backgroundColor: "#006FFD",
      padding: 10,
      borderRadius: 20,
    },


    inputContainer: {
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        backgroundColor: "#fafafa",
      },
      
      inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0F0F0",
        borderRadius: 24,
        paddingHorizontal: 16,
      },
      
      input: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 14,
        color: "#333",
      },
      
      inlineSendButton: {
        marginLeft: 8,
      },
      
      senderName: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#71727A",
        fontFamily: "PlusJakartaSans_400Regular",
      },
      

  });
  