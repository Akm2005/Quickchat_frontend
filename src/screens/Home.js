// screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  useColorScheme,
  Image,
  SafeAreaView,
} from 'react-native';
import { themeColors } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  // Get device color scheme (light or dark)
  const deviceColorScheme = useColorScheme();
  console.log(deviceColorScheme);
  // Select the appropriate theme based on device color scheme
  const theme = themeColors[deviceColorScheme] || themeColors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={deviceColorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.logo, { color: theme.primary }]}>QuickChat</Text>
      </View>
      
      {/* Main Content */}
      <View style={styles.content}>
        <View style={[styles.illustrationContainer, { backgroundColor: theme.accent }]}>
          <Icon name="chat-processing-outline" size={120} color={theme.primary} />
        </View>
        
        <Text style={[styles.title, { color: theme.text }]}>
          Connect Instantly with Friends
        </Text>
        
        <Text style={[styles.subtitle, { color: theme.text + 'CC' }]}>
          Send messages, share moments, and stay connected with the people who matter most
        </Text>
        
        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Icon name="lightning-bolt" size={24} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.text }]}>Fast Messaging</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="shield-check" size={24} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.text }]}>Secure & Private</Text>
          </View>
          
          <View style={styles.featureItem}>
            <MaterialIcons name="wifi-calling" size={24} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.text }]}>Online Calls</Text>
          </View>
        </View>
      </View>
      
      {/* Bottom Section with Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.getStartedButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <Icon name="arrow-right" size={20} color="#FFFFFF" />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSection: {
    padding: 30,
  },
  getStartedButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
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

export default HomeScreen;