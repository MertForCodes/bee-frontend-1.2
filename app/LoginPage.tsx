import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
    TouchableOpacity,
    Dimensions,
    Image
} from 'react-native';
import { Button, TextInput, Provider as PaperProvider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // ✅ Bunu ekle

const { width, height } = Dimensions.get('window');

const LoginPage: React.FC = () => {
    const router = useRouter(); // ✅ Router burada

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Hata', 'Lütfen ad ve şifrenizi girin.');
            return;
        }
        if (email === 'abc' && password === '1234') {
            router.replace('/');
        } else {
            Alert.alert('Hata', 'Geçersiz ad veya şifre.');
        }
    };

    const handleRegisterPress = () => {
        router.push('/SignUpPage'); // ✅ Burada istediğin sayfaya yönlendirme
    };

    const handleForgotPassword = () => {
        Alert.alert('Şifremi Unuttum', 'Şifre sıfırlama özelliği henüz uygulanmadı.');
    };

    return (
        <PaperProvider>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'android' ? 'padding' : 'height'}
                >
                    <View style={styles.header}>
                        <Text style={styles.welcomeText}>HOŞ GELDİN!</Text>
                        <Text style={styles.loginTitle}>Giriş Yap</Text>
                    </View>

                    <LinearGradient
                        colors={['#5f8aa3', '#2a5298']}
                        style={styles.background}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                    >
                        <View style={styles.imageWrapperTop}>
                            <Image
                                source={require('../assets/images/ari1.png')}
                                style={styles.imageTop}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                label="Telefon Numarası veya E-mail"
                                value={email}
                                onChangeText={setEmail}
                                mode="flat"
                                style={[styles.input, styles.whiteInput, { marginTop: 20 }]}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                textColor="#000"
                                placeholderTextColor="#eee"
                            />
                            <TextInput
                                label="Şifre"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!passwordVisible}
                                mode="flat"
                                style={[styles.input, styles.whiteInput, { marginTop: 10 }]}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                textColor="#000"
                                placeholderTextColor="#eee"
                                right={
                                    <TextInput.Icon
                                        icon={passwordVisible ? 'eye-off' : 'eye'}
                                        onPress={() => setPasswordVisible(!passwordVisible)}
                                        color="black"
                                    />
                                }
                            />

                            <Button
                                mode="contained"
                                onPress={handleLogin}
                                style={[styles.loginButton, styles.buttonPadding]}
                                theme={{ colors: { primary: '#1e90ff' } }}
                            >
                                Giriş Yap
                            </Button>

                            <TouchableOpacity onPress={handleForgotPassword}>
                                <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleRegisterPress} style={{ marginTop: 20 }}>
                                <Text style={styles.registerText}>
                                    Hesabın yok mu? <Text style={styles.registerLink}>Kaydol</Text>
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.imageWrapper}>
                                <Image
                                    source={require('../assets/images/ay1.png')}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                    </LinearGradient>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    header: {
        position: 'absolute',
        top: 62,
        left: 40,
        zIndex: 60,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: '400',
        color: '#fff',
        fontFamily: 'Poppins-Bold',
    },
    loginTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 4,
        fontFamily: 'Poppins-Bold',
    },
    inputWrapper: {
        width: '100%',
        justifyContent: 'center',
    },
    input: {
        marginBottom: 0,
        backgroundColor: 'transparent',
        borderRadius: 20,
        fontFamily: 'Poppins-Bold',
    },
    whiteInput: {
        backgroundColor: '#fff',
    },
    loginButton: {
        marginTop: 40,
        borderRadius: 25,
        paddingVertical: 12,
        height: 55,
    },
    buttonPadding: {
        paddingHorizontal: 40,
    },
    forgotPasswordText: {
        color: '#b0c4de',
        textAlign: 'center',
        marginTop: 15,
        textDecorationLine: 'underline',
    },
    registerText: {
        fontSize: 15,
        color: '#ccc',
        textAlign: 'center',
    },
    registerLink: {
        fontWeight: 'bold',
        color: '#1e90ff',
    },
    imageWrapperTop: {
        marginTop: 100,
        alignItems: 'center',
    },
    imageTop: {
        width: 160,
        height: 160,
        marginLeft: 170,
    },
    imageWrapper: {
        marginTop: 40,
        justifyContent: 'center',
        marginRight: 200,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
    },
});

export default LoginPage;
