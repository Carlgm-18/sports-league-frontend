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
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Los deportes disponibles para el selector
const DEPORTES = ['Voley', 'Fútbol', 'Pádel'];

export default function RegisterScreen() {
  const router = useRouter();
  
  // Controla en qué paso del formulario estamos
  const [step, setStep] = useState(1);

  // El estado global de todo el formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    category: 'Masculino', // Valor por defecto
    licenses: [] as { sport: string, number: string }[]
  });

  // Estado temporal para la licencia que se está escribiendo antes de darle a "Añadir"
  const [tempLicense, setTempLicense] = useState({ sport: DEPORTES[0], number: '' });

  const handleAddLicense = () => {
    if (!tempLicense.number.trim()) return; // No añadir si está vacío
    
    setFormData(prev => ({
      ...prev,
      licenses: [...prev.licenses, tempLicense]
    }));
    // Limpiamos el input pero mantenemos el deporte seleccionado
    setTempLicense(prev => ({ ...prev, number: '' }));
  };

  const handleRemoveLicense = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      licenses: prev.licenses.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleRegister = () => {
    // Aquí meteríamos a Zod para validar y haríamos el POST a Spring Boot
    console.log('Registrando usuario con datos:', formData);
    router.replace('/'); 
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
          <Text style={styles.title}>Crear cuenta</Text>

          {/* ================= PASO 1 ================= */}
          {step === 1 && (
            <View style={styles.formSection}>
              <TextInput
                style={styles.pillInput}
                placeholder="Email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
              />
              <TextInput
                style={styles.pillInput}
                placeholder="Contraseña"
                placeholderTextColor="#666"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => setFormData({...formData, password: text})}
              />
              <TextInput
                style={styles.pillInput}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#666"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
              />

              <View style={styles.loginPrompt}>
                <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                <Link href="./auth/login" asChild>
                  <Pressable><Text style={styles.loginLink}>Iniciar sesión</Text></Pressable>
                </Link>
              </View>

              <Pressable style={styles.nextButton} onPress={() => setStep(2)}>
                <Text style={styles.nextButtonText}>Siguiente →</Text>
              </Pressable>
            </View>
          )}

          {/* ================= PASO 2 ================= */}
          {step === 2 && (
            <View style={styles.formSection}>
              <TextInput
                style={styles.pillInput}
                placeholder="Nombre"
                placeholderTextColor="#666"
                value={formData.firstName}
                onChangeText={(text) => setFormData({...formData, firstName: text})}
              />
              <TextInput
                style={styles.pillInput}
                placeholder="Apellidos"
                placeholderTextColor="#666"
                value={formData.lastName}
                onChangeText={(text) => setFormData({...formData, lastName: text})}
              />

              {/* Selector de Categoría */}
              <View style={styles.rowCenter}>
                <Text style={styles.label}>Categoría:</Text>
                <View style={styles.categoryToggle}>
                  <Pressable 
                    style={[styles.categoryBtn, formData.category === 'Masculino' && styles.categoryBtnActive]}
                    onPress={() => setFormData({...formData, category: 'Masculino'})}
                  >
                    <Text style={formData.category === 'Masculino' ? styles.categoryTextActive : styles.categoryText}>Masculino</Text>
                  </Pressable>
                  <Pressable 
                    style={[styles.categoryBtn, formData.category === 'Femenino' && styles.categoryBtnActive]}
                    onPress={() => setFormData({...formData, category: 'Femenino'})}
                  >
                    <Text style={formData.category === 'Femenino' ? styles.categoryTextActive : styles.categoryText}>Femenino</Text>
                  </Pressable>
                </View>
              </View>

              {/* Sección de Árbitro */}
              <View style={styles.refereeSection}>
                <Text style={styles.refereeTitle}>¿Eres árbitro?</Text>
                
                <TextInput
                  style={styles.pillInput}
                  placeholder="Número de licencia"
                  placeholderTextColor="#666"
                  value={tempLicense.number}
                  onChangeText={(text) => setTempLicense({...tempLicense, number: text})}
                />

                {/* Chips de Deportes */}
                <View style={styles.sportsContainer}>
                  {DEPORTES.map(deporte => (
                    <Pressable 
                      key={deporte}
                      style={[styles.sportChip, tempLicense.sport === deporte && styles.sportChipActive]}
                      onPress={() => setTempLicense({...tempLicense, sport: deporte})}
                    >
                      <Text style={tempLicense.sport === deporte ? styles.sportChipTextActive : styles.sportChipText}>
                        {deporte}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable style={styles.addLicenseButton} onPress={handleAddLicense}>
                  <Ionicons name="add" size={24} color="#000" />
                  <Text style={styles.addLicenseText}>Añadir licencia</Text>
                </Pressable>

                {/* Lista de licencias añadidas */}
                {formData.licenses.map((lic, index) => (
                  <View key={index} style={styles.licenseItem}>
                    <Text style={styles.licenseItemText}>{lic.sport} - #{lic.number}</Text>
                    <Pressable onPress={() => handleRemoveLicense(index)}>
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </Pressable>
                  </View>
                ))}
              </View>

              {/* Botonera inferior */}
              <View style={styles.bottomNav}>
                <Pressable style={styles.backButton} onPress={() => setStep(1)}>
                  <Text style={styles.backButtonText}>← Anterior</Text>
                </Pressable>
                <Pressable style={styles.submitButton} onPress={handleRegister}>
                  <Text style={styles.submitButtonText}>Crear cuenta</Text>
                </Pressable>
              </View>
            </View>
          )}

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Contenedores adaptativos (Móvil + Web)
  screenContainer: {
    flex: 1,
    backgroundColor: '#E5E7EB', // El gris de fondo de tu diseño
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 500, // Un poco más ancho para que quepa bien el paso 2 en web
  },
  
  title: {
    fontSize: 32,
    fontWeight: '400',
    color: '#000',
    marginBottom: 40,
    textAlign: 'left', // Basado en tu imagen
  },
  formSection: {
    width: '100%',
  },
  
  // Inputs estilo Píldora
  pillInput: {
    backgroundColor: '#9CA3AF', // Gris oscuro de los inputs
    borderRadius: 25, // Bordes totalmente redondeados
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },

  // Elementos Paso 1
  loginPrompt: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  loginText: {
    color: '#000',
    fontSize: 15,
  },
  loginLink: {
    color: '#0284C7', // Azul
    fontSize: 15,
    marginTop: 4,
  },
  nextButton: {
    backgroundColor: '#9CA3AF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-end',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
  },

  // Elementos Paso 2
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  categoryToggle: {
    flexDirection: 'row',
    backgroundColor: '#9CA3AF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  categoryBtnActive: {
    backgroundColor: '#6B7280', // Un gris más oscuro para el seleccionado
  },
  categoryText: {
    color: '#333',
  },
  categoryTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // Sección Árbitro
  refereeSection: {
    marginTop: 20,
  },
  refereeTitle: {
    fontSize: 22,
    marginBottom: 16,
    textAlign: 'center',
  },
  sportsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  sportChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#D1D5DB',
  },
  sportChipActive: {
    backgroundColor: '#6B7280',
  },
  sportChipText: {
    color: '#333',
  },
  sportChipTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  addLicenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D1D5DB', // Fondo claro
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
  },
  addLicenseText: {
    fontSize: 18,
    marginLeft: 8,
  },
  licenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  licenseItemText: {
    fontSize: 16,
  },

  // Navegación Inferior Paso 2
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  backButton: {
    backgroundColor: '#9CA3AF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#9CA3AF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});