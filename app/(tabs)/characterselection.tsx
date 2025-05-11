import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const animals = [
  { name: 'Tavşan', image: require('/assets/rabbit.png'), backgroundColor: '#FF6B6B' },
  { name: 'Arı', image: require('/assets/bee.png'), backgroundColor: '#FFD93D' },
  { name: 'Kedi', image: require('/assets/laughing.png'), backgroundColor: '#4A90E2' },
  { name: 'Kurbağa', image: require('/assets/turtle.png'), backgroundColor: '#6BCB77' },
];

export default function CharacterSelection() {
  const router = useRouter();

  const handleSelectAnimal = (animal: { name: string; image: any }) => {
    router.push({
      pathname: '/chat',
      params: { animalName: animal.name, animalImage: JSON.stringify(animal.image) },
    });
  };

  return (
    <LinearGradient
      colors={['#E0F7FA', '#F0F4F8']}
      style={styles.container}>
      {/* Yeni Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Haydi görüşmemize başlayalım!</Text>
      </View>
      <Text style={styles.title}>
        <Ionicons name="paw" size={28} color="#FF6B6B" /> Kankanı Seç!
      </Text>
      <View style={styles.animalContainer}>
        {animals.map((animal, index) => (
          <Pressable
            key={index}
            style={[styles.animalButton, { backgroundColor: animal.backgroundColor }]}
            onPress={() => handleSelectAnimal(animal)}
          >
            <Image source={animal.image} style={styles.animalImage} />
            <Text style={styles.animalName}>{animal.name}</Text>
          </Pressable>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#92c7f0', // Açık mavi header
    width: '100%',
    paddingTop: 30, // StatusBar yüksekliği + boşluk
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginHorizontal: 60,
    elevation: 5,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginTop: 20, // Üstten boşluk eklendi
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF', // Beyaz yazı
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 30,
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  animalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20, // Yatay padding ekledik
  },
  animalButton: {
    width: 140,
    height: 160,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  animalImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  animalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
});
