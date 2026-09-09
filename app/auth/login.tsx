import { useAuth } from '@/hooks/authProvider';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Introduce tu correo electrónico y contraseña.');
      return;
    }
    const result = await login(email.trim(), password);

    if (!result.ok) {
        const errorMessage = result.error?.errorMessage || 'Credenciales incorrectas. Inténtalo de nuevo.';
        setError(errorMessage);
    }
  };

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>¡Hola de nuevo! 👋</Text>
          <Text style={styles.subtitle}>
            Inicia sesión para gestionar tus ligas
          </Text>
        </View>

        <View style={styles.formContainer}>
          {error && (
            <View className="bg-red-50 border border-red-200 p-3 rounded-xl mb-4">
              <Text className="text-red-700 text-xs font-semibold text-center">{error}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico *"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (error) setError(null);
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña *"
              secureTextEntry
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (error) setError(null);
              }}
            />
          </View>

          <Pressable
            style={[styles.loginButton, !isFormValid && { opacity: 0.5 }]}
            onPress={handleLogin}
            disabled={!isFormValid}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </Pressable>

          {/* Botón para entrar sin iniciar sesión y ver las ligas */}
          <Pressable
            style={styles.laterButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.laterButtonText}>Más tarde</Text>
          </Pressable>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
          <Link href="/auth/register" asChild>
            <Pressable>
              <Text style={styles.registerText}>Regístrate</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // NUEVO: El padre que ocupa todo y TIENE EL FONDO
  screenContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB', // El color que quieres que ocupe todo
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente (clave para web)
    paddingHorizontal: 24, // Pequeño margen para móvil
  },

  // NUEVO: El hijo que envuelve el contenido y SE LIMITA
  contentContainer: {
    width: '100%', // En móvil ocupa todo el ancho
    maxWidth: 400, // En web no pasa de 400px
    alignItems: 'center', // Centra los elementos internos (como el título)
  },

  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%', // El formulario ocupa el ancho que le de su padre (maxWidth: 400)
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 14,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  laterButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  laterButtonText: {
    color: '#4B5563',
    fontSize: 15,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 15,
  },
  registerText: {
    color: '#2196F3',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
