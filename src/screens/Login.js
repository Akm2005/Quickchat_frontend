// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native';
import { themeColors } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemeLoader from '../components/Loader';
import { postData } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const deviceColorScheme = useColorScheme();
  const theme = themeColors[deviceColorScheme] || themeColors.light;
  const [loginData, setLoginData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async () => {
    console.log('Login data:', loginData);
    // Add your login logic here
    try{
      setIsLoading(true);
      if(!loginData.emailOrPhone && !loginData.password){
        Alert.alert("Warning","Plz Enter Both Fields!!!");
        return
      }
      const result = await postData("https://quickchat-backend-on0b.onrender.com/api/v1/login",{email:loginData.emailOrPhone,password:loginData.password});
      console.log('result',result);
      if(result.success && result.message === "Login successful"){
        console.log("login Success");
        Alert.alert("Success","Login Success");
        console.log("data",result.data);
        try {
          await AsyncStorage.setItem("userToken", result.data.token);
          console.log("Token saved successfully");
          navigation.navigate("Main");
        } catch (error) {
          console.error("Error saving token:", error);
          Alert.alert("Error", "Failed to save login token");
        }
      }else if(result.success && result.message === "Invalid credentials"){
        Alert.alert("Error","Invalid Credentials");
      }else{
        Alert.alert("Error","Something Went Wrong Plz Try Again Later");
      }
    }catch(error){
      console.log("error");
      Alert.alert("Error","Something Went Wrong Plz Try Again Later");
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar
        backgroundColor={theme.background}
        barStyle={deviceColorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      
      <View style={styles.logoContainer}>
        <Text style={[styles.logo, { color: theme.primary }]}>QuickChat</Text>
        <Text style={[styles.subTitle, { color: theme.text }]}>Welcome Back!</Text>
      </View>
      
      <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
        <View style={[styles.inputContainer, { borderBottomColor: theme.border }]}>
          <Icon name="account" size={22} color={theme.primary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Email or Phone"
            placeholderTextColor={theme.text + '80'}
            value={loginData.emailOrPhone}
            onChangeText={(text) => setLoginData({ ...loginData, emailOrPhone: text })}
            autoCapitalize="none"
          />
        </View>
        
        <View style={[styles.inputContainer, { borderBottomColor: theme.border }]}>
          <Icon name="lock" size={22} color={theme.primary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Password"
            placeholderTextColor={theme.text + '80'}
            value={loginData.password}
            onChangeText={(text) => setLoginData({ ...loginData, password: text })}
            secureTextEntry
          />
        </View> 
        
        {/* <TouchableOpacity style={styles.forgotPasswordContainer}> */}
          {/* <Text style={[styles.forgotPassword, { color: theme.primary }]}>Forgot Password?</Text> */}
        {/* </TouchableOpacity> */}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <View style={styles.registerContainer}>
          <Text style={[styles.registerText, { color: theme.text }]}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.registerLink, { color: theme.primary }]}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ThemeLoader size={60} thickness={6} isActive={isLoading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  subTitle: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.8,
  },
  formContainer: {
    borderRadius: 20,
    padding: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  socialLoginContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  socialLoginText: {
    marginBottom: 15,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default LoginScreen;