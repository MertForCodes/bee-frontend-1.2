import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the navigation stack param list
type RootStackParamList = {
    index: { beeName: string };
    NewAccount1: undefined;
    // 'tabs' içinde olduğunu belirtiyoruz, o yüzden tabs/HomePage yerine sadece 'tabs'/'HomePage' kullanacağız.
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const NewAccount2: React.FC = () => {
    const [beeName, setBeeName] = useState('');
    const navigation = useNavigation<NavigationProp>();

    const handleStart = () => {
        if (beeName) {
            // "Haydi Başlayalım!" butonuna basıldığında tabs/HomePage ekranına yönlendiriyoruz
            navigation.navigate('(tabs)', { screen: 'index' });
        } else {
            alert('Lütfen arınızın adını girin.');
        }
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Geri</Text>
                </TouchableOpacity>
            ),
            headerBackTitleVisible: false, // Geri butonunun başlığını gizler
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/kovan1.png')} style={styles.kovanImage} />

            <Text style={styles.title}>Minik Arımızın İsmi Nedir ?</Text>
            <TextInput
                style={styles.input}
                placeholder="İsim"
                value={beeName}
                onChangeText={setBeeName}
            />

            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                <Text style={styles.startButtonText}>Haydi Başlayalım!</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92c7f0',
        paddingHorizontal: 20,
    },
    kovanImage: {
        width: 300,
        height: 300,
        marginBottom: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 30,
    },
    startButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#111189',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    backButton: {
        marginLeft: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    backButtonText: {
        fontSize: 16,
        color: 'black',
    },
});

export default NewAccount2;
