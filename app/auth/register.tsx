import RgisterStep1 from '@/components/ui/register/RegisterStep1';
import RegisterStep2 from '@/components/ui/register/RegisterStep2';
import { userRegister } from '@/services/UserService';
import { UserCreateRequest, UserCreateResponse } from '@/types/api';
import { ApiResult } from '@/types/own';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    category: 'Masculino',
    licenses: [] as { sport: string, number: string }[]
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = () => {
    console.log('Enviando todo al backend:', formData);
    router.replace('/');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <RgisterStep1 
            formData={formData} 
            updateForm={updateForm} 
            onNext={() => setStep(2)} 
          />
        );
      case 2:
        return (
          <RegisterStep2 
            formData={formData} 
            updateForm={updateForm} 
            onBack={() => setStep(1)} 
            onSubmit={handleRegister} 
          />
        );
      default:
        return null;
    }
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
        <View style={styles.columnsContainer}>
          <View style={styles.column}>
            <RgisterStep1
              formData={formData}
              updateForm={updateForm}
              onNext={() => {}} // Sugerencia: Eliminar el botón "Siguiente" dentro del componente
            />
          </View>
          <View style={styles.column}>
            <RegisterStep2
              formData={formData}
              updateForm={updateForm}
              onBack={() => {}} // Sugerencia: Eliminar el botón "Atrás" dentro del componente
              onSubmit={handleRegister}
            />
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

  columnsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: 900,
    gap: 24,
    justifyContent: 'center',
  },
  column: {
    flex: 1,
    minWidth: 320, // Asegura que en móvil se coloquen uno debajo del otro
  },

  responseContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },

  responseSucces: {
    fontSize: 16,
    color: '#1faa07',
    textAlign: 'center',
  },

  responseError: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
});