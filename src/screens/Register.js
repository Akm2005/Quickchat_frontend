// screens/RegisterScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  PermissionsAndroid,
  StatusBar,
  Platform,
  useColorScheme,
  Alert,
} from 'react-native';
import { themeColors } from '../../theme';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemeLoader from '../components/Loader';
import { uploadFile } from '../utils/uploads';
import { getData, postData } from '../services/api';

const RegisterScreen = ({ navigation }) => {
  // Get device color scheme (light or dark)
  const deviceColorScheme = useColorScheme();
  const theme = themeColors[deviceColorScheme] || themeColors.light;

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profile_image: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Try the newer permission first, then fall back to the older one
        const permissionToRequest = 
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES || 
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
          
        const granted = await PermissionsAndroid.request(
          permissionToRequest,
          {
            title: 'Storage Permission',
            message: 'QuickChat needs access to your photos to set a profile picture',
            buttonPositive: 'Allow',
            buttonNegative: 'Cancel',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true; // iOS doesn't need this permission check
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    
    if (!hasPermission) {
      console.log('Permission not granted');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
      includeBase64: false,
    };

    try {
      const result = await launchImageLibrary(options);
      
      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
      } else if (result.assets && result.assets.length > 0) {
        setFormData({ ...formData, profile_image: result.assets[0].uri });
      }
    } catch (error) {
      console.log('Image picker error: ', error);
    }
  };
  const handleFileUpload = async (fileUri) => {
    try {
      const uploadedUrl = await uploadFile(fileUri);
      console.log('Uploaded file URL:', uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      console.log('Upload failed:', error.message);
    }
  };
  const handleRegister = async () => {
    console.log('Form submitted:', formData);
    // Check if any field is empty
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone ||
      !formData.profile_image ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      Alert.alert('Warning', 'Please fill in all fields');
      return;
    }
  
    // Validate full_name (e.g., no numbers, at least 2 characters)
    if (formData.full_name.length < 2 || /\d/.test(formData.full_name)) {
      Alert.alert('Warning', 'Full Name must be at least 2 characters and contain no numbers');
      return;
    }
  
    // Validate email (basic email format check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Warning', 'Please enter a valid email address');
      return;
    }
  
    // Validate phone (e.g., 10 digits only)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      Alert.alert('Warning', 'Phone number must be exactly 10 digits');
      return;
    }
  
    // Validate profile_image (assuming it's a string like a URL or file path)
    if (typeof formData.profile_image !== 'string' || formData.profile_image.length < 1) {
      Alert.alert('Warning', 'Profile image field is invalid');
      return;
    }
  
    // Validate password (e.g., minimum 6 characters)
    if (formData.password.length < 6) {
      Alert.alert('Warning', 'Password must be at least 6 characters long');
      return;
    }
  
    // Validate confirmPassword (must match password)
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Warning', 'Password and Confirm Password must match');
      return;
    }
    try{
        setIsLoading(true);
        const filename = await handleFileUpload(formData.profile_image);
        if(filename){
          console.log("FILE UPLOADED");
          // setFormData({...formData,profile_image:filename});
        }else{
          Alert.alert("Error","Failed to Upload Media");
          return
        }
        console.log("filename",filename);
        // const result = await getData('https://quickchat-backend-on0b.onrender.com/api/v1/users?page=1&limit=100');
        const result = await postData('https://quickchat-backend-on0b.onrender.com/api/v1/register',{...formData,profile_image:filename.fileUrl});
        console.log('result',result);
        if(result.success && result.message === "User registered successfully"){
          Alert.alert("Success","User registered successfully Now you Can Login");
          navigation.navigate("Login");
        }else if(result.success && result.message === "User with this email and phone already exists"){
          Alert.alert("Warning","User with this email and phone already exists");
        }else if(result.success && result.message === "User with this email already exists"){
          Alert.alert("Warning","User with this email already exists");
        }else if(result.success && result.message === "User with this phone number already exists"){
          Alert.alert("Warning","User with this phone number already exists");
        }
        else{
          Alert.alert("Error","Something Went Wrong Plz Try Again Later!!");
        }
    }catch(error){
        console.log(error);
        Alert.alert("Error","Something Went Wrong Plz Try Again Later!!");
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar
        backgroundColor={theme.background}
        barStyle={deviceColorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      
      <View style={styles.logoContainer}>
        <Text style={[styles.logo, { color: theme.primary }]}>QuickChat</Text>
        <Text style={[styles.subTitle, { color: theme.text }]}>Create your account</Text>
      </View>
      
      <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
        <TouchableOpacity 
          style={[styles.imagePicker, { backgroundColor: theme.inputBackground }]} 
          onPress={pickImage}
        >
          {formData.profile_image ? (
            <Image source={{ uri: formData.profile_image }} style={styles.profile_image} />
          ) : (
            <View style={styles.imageTextContainer}>
              <Icon name="camera" size={30} color={theme.primary} style={styles.cameraIcon} />
              <Text style={[styles.imageText, { color: theme.text }]}>
                Add Photo
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={[styles.inputContainer, { borderBottomColor: theme.border }]}>
          <Icon name="account" size={22} color={theme.primary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Full Name"
            placeholderTextColor={theme.text + '80'}
            value={formData.full_name}
            onChangeText={(text) => setFormData({ ...formData, full_name: text })}
          />
        </View>
        
        <View style={[styles.inputContainer, { borderBottomColor: theme.border }]}>
          <Icon name="email" size={22} color={theme.primary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Email"
            placeholderTextColor={theme.text + '80'}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={[styles.inputContainer, { borderBottomColor: theme.border }]}>
          <Icon name="phone" size={22} color={theme.primary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Phone"
            placeholderTextColor={theme.text + '80'}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />
        </View>
        
        <View style={[styles.inputContainer, { borderBottomColor: theme.border }]}>
          <Icon name="lock" size={22} color={theme.primary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Password"
            placeholderTextColor={theme.text + '80'}
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
          />
        </View>
        
        <View style={[styles.inputContainer, { borderBottomColor: theme.border }]}>
          <Icon name="lock-check" size={22} color={theme.primary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Confirm Password"
            placeholderTextColor={theme.text + '80'}
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        
        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: theme.text }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginLink, { color: theme.primary }]}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ThemeLoader size={60} thickness={6} isActive={isLoading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 30,
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
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
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
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    width: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 25,
    overflow: 'hidden',
  },
  profile_image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imageTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    marginBottom: 5,
  },
  imageText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;