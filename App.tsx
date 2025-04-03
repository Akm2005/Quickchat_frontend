import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './src/screens/Register';
import LoginScreen from './src/screens/Login';
import HomeScreen from './src/screens/Home';
import Main from './src/screens/Main';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App = () => {
  const [initialRouteName, setInitialRouteName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        console.log("token",token);
        setInitialRouteName(token ? "Main" : "HomeScreen");
      } catch (error) {
        console.error("Error fetching user token:", error);
        setInitialRouteName("HomeScreen"); // Default fallback
      }
    };

    fetchUserToken();
  }, []);

  // Jab tak initialRouteName set nahi hota, tab tak loading dikhaye
  if (!initialRouteName) {
    return null; // Ya ek ActivityIndicator yahan laga sakte hain
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
