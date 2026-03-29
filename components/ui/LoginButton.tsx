import { useAuth } from '@/hooks/authProvider';
import { router } from 'expo-router';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { Pressable, Text, StyleSheet } from 'react-native';

export const LoginButton = () => {
  const { isAuthenticated } = useAuth();
  const handleProfilePress = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };
  return (
    <Pressable onPress={handleProfilePress} style={styles.headerButton}>
    { isAuthenticated
        ? <FontAwesome name="user" size={24} color="white" />
        : <FontAwesome5 name="user-alt-slash" size={24} color="white" />
    }
      <Text style={styles.buttonText}>
        {isAuthenticated ? 'Ir a mi Perfil' : 'Iniciar Sesión'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    alignSelf: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    marginTop: 24,
    marginRight: 48,
    borderRadius: 48,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
});
