import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NewAccount1 = () => {
    const navigation = useNavigation();
    const [ageRange, setAgeRange] = useState<string | null>(null);

    const handleNext = () => {
        if (ageRange) {
            navigation.navigate('NewAccount2', { ageRange });
        } else {
            Alert.alert('Uyarı', 'Lütfen bir yaş aralığı seçin.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.ariContainer}>
                <Image
                    source={require('../assets/images/ari3.png')}
                    style={styles.ariImage}
                />
                <View style={styles.speechBubble}>
                    <Text style={styles.speechText}>Yaşını Öğrenebilir Miyim?</Text>
                    <View style={styles.speechTriangle} />
                </View>
            </View>

            {['2-4', '4-6', '6-8', '8+'].map((range) => (
                <TouchableOpacity
                    key={range}
                    style={[styles.ageButton, ageRange === range && styles.selectedAge]}
                    onPress={() => setAgeRange(range)}
                >
                    <View style={styles.ageButtonContent}>
                        <View style={styles.circle}>
                            {ageRange === range && <View style={styles.innerCircle} />}
                        </View>
                        <Text style={[styles.ageButtonText, ageRange === range && { color: '#fff' }]}>
                            {range === '8+' ? '8+' : `${range} yaş arası`}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Devam</Text>
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
        paddingTop: 50,
    },
    ariContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    ariImage: {
        marginTop: -120,
        width: 140,
        height: 140,
        marginRight: 20,
    },
    speechBubble: {
        marginTop: -270,
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        maxWidth: '70%',
        position: 'relative',
    },
    speechText: {
        fontSize: 16,
    },
    speechTriangle: {
        position: 'absolute',
        bottom: -15,
        left: -15,
        width: 0,
        height: 0,
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderBottomWidth: 15,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FFF',
        transform: [{ rotate: '40deg' }],
    },
    ageButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    selectedAge: {
        backgroundColor: '#111189',
    },
    ageButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#111189',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    innerCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#111189',
    },
    ageButtonText: {
        fontSize: 16,
        color: '#000',
    },
    nextButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#111189',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
});

export default NewAccount1;
