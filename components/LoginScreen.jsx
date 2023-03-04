import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Form,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

function hash(username, email) {
  function djb2(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash;
  }
  return djb2(username) + djb2(email);
}

async function saveLoginInfo(username, email) {
  const loginCountKey = `login_${hash(username, email)}`;
  console.log(username, email);
  const loginCount = JSON.parse(await AsyncStorage.getItem(loginCountKey));
  if (!loginCount) {
    await AsyncStorage.setItem(loginCountKey, JSON.stringify([Date.now()]));
    await AsyncStorage.multiSet([
      ["username", JSON.stringify(username)],
      ["email", JSON.stringify(email)],
    ]);
  } else {
    await AsyncStorage.setItem(
      loginCountKey,
      JSON.stringify(loginCount.concat(Date.now()))
    );
    await AsyncStorage.multiSet([
      ["username", JSON.stringify(username)],
      ["email", JSON.stringify(email)],
    ]);
  }
  await AsyncStorage.setItem("loggedIn", "true");
}

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Golos Text": require("../assets/fonts/Golos_Text/GOLOS.ttf"),
      });
      setLoaded(true);
    };
    loadFonts();
  }, []);
  useEffect(() => {
    const loggedIn = AsyncStorage.getItem("loggedIn").then((loggedIn) => {
      if (JSON.parse(loggedIn)) {
        navigation.navigate("Home");
      }
    });
  }, []);
  function handleLogin(event) {
    event.preventDefault();
    saveLoginInfo(username, email).then(() => {
      navigation.navigate("Home");
    });
  }
  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }
  function handleEmailChange(event) {
    setEmail(event.target.value);
  }
  return (
    <View style={styles.container}>
      {loaded ? (
        <>
          <Text style={styles.heading}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "10%",
  },
  heading: {
    fontSize: 40,
    fontWeight: "bold",
    display: "flex",
    width: "100%",
    marginTop: "50%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  input: {
    display: "flex",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 20,
    margin: 10,
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 100,
  },
  loginButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    padding: 20,
    backgroundColor: "#eee",
    border: "none",
    color: "#fff",
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 20,
  },
});
