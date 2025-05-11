import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput, Image, Modal, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { router } from 'expo-router';
import { Routes, Route } from 'react-router-dom';
import * as Audio from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from '../LoginPage';


const animals = [
  {
    id: 'rabbit',
    name: 'Tavşan',
    image: 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg',
    defaultSound: 'https://example.com/rabbit.mp3',
  },
  {
    id: 'bee',
    name: 'Arı',
    image: 'https://images.pexels.com/photos/2263936/pexels-photo-2263936.jpeg',
    defaultSound: 'https://example.com/bee.mp3',
  },
  {
    id: 'cat',
    name: 'Kedi',
    image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
    defaultSound: 'https://example.com/cat.mp3',
  },
  {
    id: 'frog',
    name: 'Kurbağa',
    image: 'https://images.pexels.com/photos/70083/frog-macro-amphibian-green-70083.jpeg',
    defaultSound: 'https://example.com/frog.mp3',
  },
];

export default function ProfileScreen() {
  const [userName, setUserName] = useState('Çocuk');
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState({});
  const [selectedSound, setSelectedSound] = useState({});
  const [avatarImage, setAvatarImage] = useState(null);

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const uri = await AsyncStorage.getItem('avatarImage');
        if (uri) {
          setAvatarImage(uri);
        }
      } catch (err) {
        console.error('Profile: Error loading avatar from AsyncStorage:', err);
      }
    };
    loadAvatar();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.push('/LoginPage');
      console.log('Çıkış yapılıyor...');
    } catch (error) {
      console.error('Çıkış yaparken hata:', error);
    }
  };

  const pickAvatarImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Galeri erişimi için izin gerekli!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        let uri = result.assets[0].uri;
        if (Platform.OS === 'android' && !uri.startsWith('file://')) {
          uri = `file://${uri}`;
        }
        setAvatarImage(uri);
        try {
          await AsyncStorage.setItem('avatarImage', uri);
        } catch (err) {
          console.error('Profile: Error saving avatar to AsyncStorage:', err);
        }
      }
    } catch (err) {
      console.error('Profile: Error picking avatar image:', err);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording || !selectedAnimal) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);

      if (uri) {
        setSelectedSound({
          ...selectedSound,
          [selectedAnimal.id]: { type: 'recorded', uri }
        });
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const pickSound = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      });

      if (!result.canceled && selectedAnimal) {
        setSelectedSound({
          ...selectedSound,
          [selectedAnimal.id]: { type: 'picked', uri: result.assets[0].uri }
        });
      }
    } catch (err) {
      console.error('Error picking sound:', err);
    }
  };

  const useDefaultSound = () => {
    if (selectedAnimal) {
      setSelectedSound({
        ...selectedSound,
        [selectedAnimal.id]: { type: 'default', uri: selectedAnimal.defaultSound }
      });
    }
  };

  const playSound = async (uri) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
    } catch (err) {
      console.error('Failed to play sound:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backHeader}>
        <Pressable onPress={() => router.push('/')}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </Pressable>
      </View>


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Pressable onPress={pickAvatarImage} style={styles.avatarContainer}>
            {avatarImage ? (
              <Image
                source={{ uri: avatarImage }}
                style={styles.avatarImage}
              />
            ) : (
              <Ionicons name="person-circle" size={80} color="#4A90E2" />
            )}
            <View style={styles.editIcon}>
              <Ionicons name="camera" size={20} color="#FFF" />
            </View>
          </Pressable>

          {isEditing ? (
            <View style={styles.editNameContainer}>
              <TextInput
                style={styles.nameInput}
                value={newName}
                onChangeText={setNewName}
                placeholder="İsmini gir"
                placeholderTextColor="#999"
              />
              <Pressable style={styles.saveButton} onPress={() => {
                setUserName(newName);
                setIsEditing(false);
              }}>
                <Ionicons name="checkmark" size={20} color="#FFF" />
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={() => setIsEditing(true)} style={styles.nameContainer}>
              <Text style={styles.profileName}>{userName}</Text>
              <Ionicons name="pencil" size={20} color="#4A90E2" />
            </Pressable>
          )}

          <Text style={styles.levelText}>Seviye 1 <Ionicons name="star" size={18} color="#FFD700" /></Text>

          <Pressable
            style={styles.characterButton}
            onPress={() => setShowCharacterModal(true)}>
            <Ionicons name="paw" size={20} color="#FFF" />
            <Text style={styles.characterButtonText}>Karakterini Seç</Text>
          </Pressable>

          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Bugünkü Maceraların</Text>
            <View style={styles.statItem}>
              <Ionicons name="book" size={20} color="#4A90E2" />
              <Text style={styles.statLabel}>Öğrenme:</Text>
              <Text style={styles.statValue}>0 dakika</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble" size={20} color="#4A90E2" />
              <Text style={styles.statLabel}>Sohbet:</Text>
              <Text style={styles.statValue}>0 dakika</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="compass" size={20} color="#4A90E2" />
              <Text style={styles.statLabel}>Keşif:</Text>
              <Text style={styles.statValue}>0 dakika</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
      </Pressable>

      <Modal
        visible={showCharacterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCharacterModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kankanı Seç!</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowCharacterModal(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </Pressable>
            </View>

            <View style={styles.animalsGrid}>
              {animals.map((animal) => (
                <Pressable
                  key={animal.id}
                  style={styles.animalCard}
                  onPress={() => {
                    setSelectedAnimal(animal);
                    setShowCharacterModal(false);
                    setShowSoundModal(true);
                  }}>
                  <Image source={{ uri: animal.image }} style={styles.animalImage} />
                  <Text style={styles.animalName}>{animal.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSoundModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSoundModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedAnimal?.name} için Ses</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowSoundModal(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </Pressable>
            </View>

            <View style={styles.soundOptions}>
              <Pressable
                style={styles.soundOption}
                onPress={useDefaultSound}>
                <Ionicons name="musical-note" size={24} color="#4A90E2" />
                <Text style={styles.soundOptionText}>Varsayılan Ses</Text>
              </Pressable>

              <Pressable
                style={styles.soundOption}
                onPress={pickSound}>
                <Ionicons name="folder-open" size={24} color="#4A90E2" />
                <Text style={styles.soundOptionText}>Telefondan Ses Seç</Text>
              </Pressable>

              <Pressable
                style={[styles.soundOption, isRecording && styles.recordingOption]}
                onPress={isRecording ? stopRecording : startRecording}>
                <Ionicons
                  name={isRecording ? "stop-circle" : "mic"}
                  size={24}
                  color={isRecording ? "#FF6B6B" : "#4A90E2"}
                />
                <Text style={styles.soundOptionText}>
                  {isRecording ? 'Kaydı Bitir' : 'Ses Kaydet'}
                </Text>
              </Pressable>

              {selectedSound[selectedAnimal?.id] && (
                <Pressable
                  style={styles.playButton}
                  onPress={() => playSound(selectedSound[selectedAnimal.id].uri)}>
                  <Ionicons name="play" size={24} color="#FFF" />
                  <Text style={styles.playButtonText}>Sesi Çal</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 50,
    backgroundColor: '#4A90E2',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    marginBottom: 70,
  },
  // profileCard: {
  //   backgroundColor: '#FFF',
  //   borderRadius: 20,
  //   padding: 24,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.15,
  //   shadowRadius: 8,
  //   elevation: 4,
  // },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    position: 'relative',
    borderWidth: 3,
    borderColor: '#4A90E2',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    borderRadius: 15,
    padding: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginRight: 8,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    padding: 10,
    fontSize: 18,
    color: '#2D3436',
    flex: 1,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388E3C',
    textAlign: 'center',
    marginBottom: 20,
  },
  characterButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  statsContainer: {
    backgroundColor: '#F0F4F8',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
    textAlign: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    color: '#636E72',
    flex: 1,
    marginLeft: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  animalCard: {
    width: '48%',
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  animalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  animalName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  soundOptions: {
    gap: 12,
  },
  soundOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  recordingOption: {
    backgroundColor: '#FFE5E5',
  },
  soundOptionText: {
    fontSize: 16,
    color: '#2D3436',
    flex: 1,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  backHeader: {
    position: 'absolute',
    top: 60,
    left: 35,
    zIndex: 10,
    backgroundColor: '#4A90E2',
    padding: 8,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 120,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: 'absolute',
    bottom: 10,

    left: 0,
    right: 0,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});