import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Step1Props {
  formData: any;
  updateForm: (field: string, value: any) => void;
  onNext: () => void;
}

export default function Step1({ formData, updateForm, onNext }: Step1Props) {
  return (
    <View style={styles.formContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Paso 1 de 2: Datos de acceso</Text>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => updateForm('email', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => updateForm('password', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => updateForm('confirmPassword', text)}
        />
      </View>

      <Pressable style={styles.primaryButton} onPress={onNext}>
        <Text style={styles.primaryButtonText}>Siguiente</Text>
      </Pressable>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
        <Link href="/auth/login" asChild>
          <Pressable>
            <Text style={styles.loginText}>Iniciar sesión</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { width: '100%' },
  headerContainer: { marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
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
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#111827' },
  primaryButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { color: '#6B7280', fontSize: 15 },
  loginText: { color: '#2196F3', fontSize: 15, fontWeight: 'bold' },
});