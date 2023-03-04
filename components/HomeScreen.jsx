import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Form,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loginCount, setLoginCount] = useState(0);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function getLoginCount() {
      const username = JSON.parse(await AsyncStorage.getItem("username"));
      const email = JSON.parse(await AsyncStorage.getItem("email"));
      const loginCountKey = `login_${hash(username, email)}`;
      const loginCount = JSON.parse(await AsyncStorage.getItem(loginCountKey));
      return [username, email, loginCount];
    }
    getLoginCount().then((arrayofvals) => {
      const [username, email, loginCount] = arrayofvals;
      setUsername(username);
      setEmail(email);
      console.log(loginCount);
      setLoginCount(loginCount.length);
      setLoginHistory(loginCount);
    });
  }, []);

  function handleLogout(event) {
    event.preventDefault();
    AsyncStorage.setItem("loggedIn", "false").then(() => {
      navigation.navigate("Login");
    });
  }

  function handleClearHistory(event) {
    event.preventDefault();
    AsyncStorage.removeItem(`login_${hash(username, email)}`).then(() => {
      setLoginCount(0);
      setLoginHistory([]);
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.view}>
        <Text style={styles.heading}>Hello, {username}.</Text>
        <Text style={styles.text}>You have logged in {loginCount} times.</Text>
        <Text style={styles.text}>Here's your login history:</Text>
        <ScrollView style={styles.scrollView}>
          {loginCount > 0 ? (
            loginHistory.map((time, index) => {
              return (
                <Text numberOfLines={1} key={index} style={styles.timePoint}>
                  Login {index + 1}: {new Date(time).toLocaleString()}
                </Text>
              );
            })
          ) : (
            <Text style={styles.text}>You have not logged in yet.</Text>
          )}
        </ScrollView>
        <View style={styles.buttonHolder}>
          <TouchableOpacity
            style={styles.clearHistory}
            onPress={handleClearHistory}
          >
            <Text style={styles.clearHistoryText}>Clear History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    padding: 20,
  },
  heading: {
    fontSize: 30,
    marginBottom: 20,
    marginTop: 50,
    display: "flex",
    width: "100%",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    display: "flex",
    width: "100%",
  },
  scrollView: {
    width: "100%",
    height: "20%",
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  buttonHolder: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  logoutButton: {
    fontSize: 20,
    margin: 10,
    display: "flex",
    width: "40%",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 20,
  },
  clearHistory: {
    fontSize: 20,
    margin: 10,
    display: "flex",
    width: "40%",
    backgroundColor: "#f99",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  clearHistoryText: {
    fontSize: 20,
	color: "#fff"
  },
  timePoint: {
    display: "flex",
    fontSize: 15,
    marginBottom: 5,
  },
  timePointContainer: {
    display: "flex",
  },
});
