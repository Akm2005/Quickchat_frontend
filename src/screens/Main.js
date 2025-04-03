import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar, ScrollView } from 'react-native'
import  {React , useState,useEffect} from 'react'
import { themeColors } from '../../theme'
import Icon from 'react-native-vector-icons/Feather'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Main = () => {
    const navigation = useNavigation()
    const colorScheme = 'light'
    const colors = themeColors[colorScheme]
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        const fetchUserToken = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");
                console.log("maintoken",token);
                if (token) {
                    setUserToken(token);
                }
            } catch (error) {
                console.error("Error fetching user token:", error);
            }
        };

        fetchUserToken();
    }, []);
    const handlelogout = async () => {
        await AsyncStorage.clear();
        navigation.navigate("HomeScreen");
    }
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Top Header Bar */}
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <Text style={styles.headerTitle}>QuickChat</Text>
                <TouchableOpacity style={styles.headerIcon} onPress={handlelogout}>
                    <SimpleLineIcons name="logout" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.welcomeContainer, { backgroundColor: colors.card }]}>
                    <View style={[styles.welcomeIconContainer, { backgroundColor: colors.accent }]}>
                        <Icon name="message-circle" size={36} color={colors.primary} />
                    </View>
                    <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome to QuickChat</Text>
                    <Text style={[styles.welcomeSubtext, { color: colors.text }]}>Start chatting with friends and family</Text>
                </View>

                {/* Quick Actions */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
                        <Icon name="message-square" size={24} color="white" />
                        <Text style={styles.actionText}>New Chat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.secondary }]}>
                        <Icon name="users" size={24} color="white" />
                        <Text style={styles.actionText}>Contacts</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Chats Preview */}
                <View style={styles.recentContainer}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Chats</Text>

                    <View style={[styles.emptyStateContainer, { backgroundColor: colors.card }]}>
                        <Text style={[styles.emptyStateText, { color: colors.text }]}>
                            {userToken ? `User Token: ${userToken}` : "No recent chats"}
                        </Text>
                        <TouchableOpacity style={[styles.getStartedButton, { backgroundColor: colors.primary }]}>
                            <Text style={styles.getStartedText}>Get Started</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Main

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    headerIcon: {
        padding: 4,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    welcomeContainer: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
        marginBottom: 24,
    },
    welcomeIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    welcomeSubtext: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.8,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flex: 0.48,
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 16,
    },
    recentContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    emptyStateContainer: {
        flex: 1,
        minHeight: 200,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyStateText: {
        fontSize: 16,
        marginBottom: 20,
        opacity: 0.8,
    },
    getStartedButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    getStartedText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
})