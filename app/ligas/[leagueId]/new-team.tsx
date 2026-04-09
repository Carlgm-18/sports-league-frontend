import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { primaryBlue } from '@/constants/theme';

export default function CrearEquipoScreen() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nombre: '',
    lema: '',
    descripcion: '',
    escudo: null 
  });

  const handleEnviar = () => {
    console.log('Solicitud de equipo enviada:', formData);
    router.back();
  };

  const handleCancelar = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.screenContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Crear equipo</Text>
            <Text style={styles.subtitle}>Introduce los datos básicos de tu club</Text>
          </View>

          <View style={styles.formContainer}>
            
            <View style={styles.shieldPickerContainer}>
              <Pressable style={styles.shieldCircle}>
                <Ionicons name="image-outline" size={32} color="#9CA3AF" />
                <View style={styles.addIconBadge}>
                  <Ionicons name="add" size={16} color="#FFF" />
                </View>
              </Pressable>
              <Text style={styles.shieldLabel}>Añadir escudo del equipo</Text>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="shield-half-outline" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre del equipo"
                placeholderTextColor="#999"
                value={formData.nombre}
                onChangeText={(text) => setFormData({...formData, nombre: text})}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="chatbubble-outline" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Lema o Epitafio (corto)"
                placeholderTextColor="#999"
                value={formData.lema}
                onChangeText={(text) => setFormData({...formData, lema: text})}
              />
            </View>

            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Ionicons name="document-text-outline" size={20} color="#666" style={[styles.icon, { marginTop: 12 }]} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descripción completa del equipo..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={formData.descripcion}
                onChangeText={(text) => setFormData({...formData, descripcion: text})}
              />
            </View>

            {/* NUEVO: Botonera doble */}
            <View style={styles.buttonsContainer}>
              <Pressable style={styles.cancelButton} onPress={handleCancelar}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              
              <Pressable style={styles.submitButton} onPress={handleEnviar}>
                <Text style={styles.submitButtonText}>Enviar solicitud</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: 32,
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
    width: '100%',
  },
  
  shieldPickerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  shieldCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  addIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: primaryBlue,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F9FAFB',
  },
  shieldLabel: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
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
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 16,
    height: '100%',
  },

  // Estilos de la botonera
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    backgroundColor: primaryBlue,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});