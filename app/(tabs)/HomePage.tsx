import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable, Dimensions, Platform, Image } from 'react-native';
import { View, Text } from 'react-native-ui-lib';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const animals = [
  { name: 'Tavşan', image: require('/assets/rabbit.png'), backgroundColor: '#FF6B6B' },
  { name: 'bee', image: require('/assets/bee.png'), backgroundColor: '#FFD93D' },
  { name: 'Kedi', image: require('/assets/laughing.png'), backgroundColor: '#4A90E2' },
  { name: 'Kurbağa', image: require('/assets/turtle.png'), backgroundColor: '#6BCB77' },
];
const activities = [
  {
    id: 'daily',
    title: 'Günün Görevleri',
    description: 'Bugünün özel aktiviteleri',
    color: '#FF9F43',
    gradient: ['#FFD180', '#FF9F43'],
    icon: 'calendar',
    image: 'https://images.unsplash.com/photo-1435527173128-983b87201f4d?w=400&q=80',
  },
  {
    id: 'cartoon',
    title: 'Masal',
    description: 'Kendi Masalını yarat',
    color: '#FF6B6B',
    gradient: ['#FF8A80', '#FF6B6B'],
    icon: 'film',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80',
  },
  {
    id: 'discover',
    title: 'Çevremizi Keşfedelim',
    description: 'Yeni şeyler keşfet',
    color: '#4A90E2',
    gradient: ['#80D8FF', '#4A90E2'],
    icon: 'search',
    image: 'https://images.unsplash.com/photo-1459478309853-2c33a60058e7?w=400&q=80',
  },
  {
    id: 'learn',
    title: 'Birlikte Öğrenelim',
    description: 'Eğlenceli aktiviteler',
    color: '#98D8AA',
    gradient: ['#B9FBC0', '#98D8AA'],
    icon: 'book',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
  },
];

export default function HomePage() {
  const [avatarImage, setAvatarImage] = useState(null);

  const loadAvatar = async () => {
    try {
      const uri = await AsyncStorage.getItem('avatarImage');
      if (uri) {
        const normalizedUri = Platform.OS === 'android' && !uri.startsWith('file://') ? `file://${uri}` : uri;
        setAvatarImage(normalizedUri);
      }
    } catch (err) {
      console.error('Error loading avatar from AsyncStorage:', err);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  useFocusEffect(() => {
    loadAvatar();
  });

  const handleProfilePress = () => {
    router.push('/profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={handleProfilePress} style={styles.profileButton}>
            {avatarImage ? (
              <Image
                source={{ uri: avatarImage, cache: 'reload' }}
                style={styles.profileImage}
              />
            ) : (
              <Ionicons name="person-circle" size={40} color="#FFF" />
            )}
          </Pressable>
          <Text style={styles.headerTitle}>Ebeveyn</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.beeContainer}>
          <Pressable onPress={() => router.push('/characterselection')}>
            <Image
              source={animals.find(animal => animal.name === 'bee').image}
              style={styles.beeImage}
            />
          </Pressable>
          <Text style={styles.welcomeText}>Bugüün Neeee Yapalım?</Text>
        </View>

        <View style={styles.activitiesContainer}>
          {activities.map((activity) => (
            <Pressable
              key={activity.id}
              style={styles.activityCard}
              onPress={() => router.push(`/${activity.id}`)}>
              <LinearGradient
                colors={activity.gradient}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <View style={styles.activityContent}>
                  <View style={styles.iconContainer}>
                    <Image
                      source={{ uri: activity.image }}
                      style={styles.activityImage}
                    />
                    <View style={styles.iconOverlay}>
                      <Ionicons name={activity.icon} size={28} color="#FFF" />
                    </View>
                  </View>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </View>
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#4A90E2',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#5C9CE6',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    borderRadius: 20,
  },
  activityContent: {
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    marginBottom: 12,
    borderRadius: 40,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  activityImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
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