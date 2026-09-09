import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';

interface Step1Props {
  formData: any;
  updateForm: (field: string, value: any) => void;
}

export default function Step1({ formData, updateForm }: Step1Props) {
  return (
    <View style={styles.formContainer}>
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
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => updateForm('email', text)}
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
          placeholderTextColor="#999"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => updateForm('password', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="shield-checkmark-outline"
          size={20}
          color="#666"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña *"
          placeholderTextColor="#999"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => updateForm('confirmPassword', text)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { width: '100%', marginVertical: 'auto' },
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
});
