import { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
  Image,
  ImageBackground,
} from 'react-native';
import { View, Text } from 'react-native-ui-lib';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const animals = [
  { name: 'Tavşan', image: require('/assets/rabbit.png'), backgroundColor: '#FF6B6B' },
  { name: 'bee', image: require('/assets/bee.png'), backgroundColor: '#FFD93D' },
  { name: 'Kedi', image: require('/assets/laughing.png'), backgroundColor: '#4A90E2' },
  { name: 'Kurbağa', image: require('/assets/turtle.png'), backgroundColor: '#6BCB77' },
];

const petekImage = require('../../assets/images/petek1.png');
const anaImages = [
  require('../../assets/images/ana1.png'),
  require('../../assets/images/ana2.png'),
  require('../../assets/images/ana3.png'),
  require('../../assets/images/ana4.png'),
];

const activities = [
  {
    id: 'daily',
    title: 'Günün Görevleri',
    description: 'Bugünün özel aktiviteleri',
    color: '#FF9F43',
    icon: 'calendar',
    image: petekImage,
    contentImage: anaImages[0],
  },
  {
    id: 'cartoon',
    title: 'Masal',
    description: 'Kendi Masalını yarat',
    color: '#FF6B6B',
    icon: 'film',
    image: petekImage,
    contentImage: anaImages[1],
  },
  {
    id: 'discover',
    title: 'Çevremizi Keşfedelim',
    description: 'Yeni şeyler keşfet',
    color: '#4A90E2',
    icon: 'search',
    image: petekImage,
    contentImage: anaImages[2],
  },
  {
    id: 'learn',
    title: 'Birlikte Öğrenelim',
    description: 'Eğlenceli aktiviteler',
    color: '#98D8AA',
    icon: 'book',
    image: petekImage,
    contentImage: anaImages[3],
  },
];

export default function HomeScreen() {
  const [isParentMode, setIsParentMode] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);

  const loadAvatar = async () => {
    try {
      const uri = await AsyncStorage.getItem('avatarImage');
      if (uri) {
        const normalizedUri =
          Platform.OS === 'android' && !uri.startsWith('file://')
            ? `file://${uri}`
            : uri;
        setAvatarImage(normalizedUri);
      }
    } catch (err) {
      console.error('Home: Error loading avatar from AsyncStorage:', err);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  useFocusEffect(() => {
    loadAvatar();
  });

  const handleParentModeToggle = () => {
    if (!isParentMode) {
      router.push('/parent-auth');
    } else {
      setIsParentMode(false);
    }
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topButtonsContainer}>
        <Pressable
          style={[styles.modeSwitchButton, !isParentMode && styles.activeMode]}
          onPress={() => setIsParentMode(false)}>
          <Text style={[styles.modeSwitchText, !isParentMode && styles.activeModeText]}>Çocuk</Text>
        </Pressable>
        <Pressable
          style={[styles.modeSwitchButton, isParentMode && styles.activeMode]}
          onPress={handleParentModeToggle}>
          <Text style={[styles.modeSwitchText, isParentMode && styles.activeModeText]}>Ebeveyn</Text>
        </Pressable>
      </View>

      <View style={styles.headerTop}>
        <Pressable onPress={handleProfilePress} style={styles.profileButton}>
          {avatarImage ? (
            <Image source={{ uri: avatarImage }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle" size={40} color="#4A90E2" />
          )}
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.beeContainer}>
          <Pressable onPress={() => router.push('/characterselection')}>
            <Image
              source={animals.find((animal) => animal.name === 'bee').image}
              style={styles.beeImage}
            />
          </Pressable>
          <Text style={styles.welcomeText}>Bugün Ne Yapalım?</Text>
        </View>

        <View style={styles.activitiesContainer}>
          {activities.map((activity) => (
            <Pressable
              key={activity.id}
              style={styles.activityCard}
              onPress={() => router.push(`/${activity.id}`)}
            >
              <View style={styles.activityBackgroundWrapper}>
                <ImageBackground
                  source={activity.image}
                  style={styles.activityBackground}
                  imageStyle={{ borderRadius: 20 }}
                  resizeMode="cover"
                >
                  <View style={styles.activityContent}>
                    <View style={styles.iconContainer}>
                      <Image
                        source={activity.contentImage}
                        style={styles.activityImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                  </View>
                </ImageBackground>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 35,
    gap: 0,
  },
  modeSwitchButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  activeMode: {
    backgroundColor: '#4A90E2',
  },
  modeSwitchText: {
    color: '#444',
    fontWeight: 'bold',
  },
  activeModeText: {
    color: '#FFF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FFF',
    marginTop: -40,
    marginLeft: 22,
  },
  profileImage: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  beeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  beeImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: '#FFD700',
    backgroundColor: '#E0F7FA',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
    marginTop: 16,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  activityCard: {
    width: (width - 56) / 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  activityBackgroundWrapper: {
    backgroundColor: '#FFD700', // bal sarısı arka plan
    borderRadius: 20,
  },
  activityBackground: {
    height: 180,
    borderRadius: 20,
    justifyContent: 'center',
  },
  activityContent: {
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  activityImage: {
    width: 60,
    height: 60,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.9,
    textAlign: 'center',
  },
});
