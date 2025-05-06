import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const BackButton = () => {
  const handleBackPress = () => {
    router.back(); // Navigate back to the previous screen
  };

  return (
    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 0.5,
    left: 10, 
    padding: 10,
    backgroundColor: 'transparent',
    zIndex: 1,
    marginBottom: 20
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF', // Default blue color (iOS)
  },
});

export default BackButton;
