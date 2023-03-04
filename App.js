import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native-web';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
				name='Login'
				component={ LoginScreen }
				options={{ headerShown: false }}
				/>
				<Stack.Screen
				name='Home'
				component={ HomeScreen }
				options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}