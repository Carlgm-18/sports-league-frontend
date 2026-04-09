import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import RgisterStep1 from '@/components/ui/register/RegisterStep1';
import RegisterStep2 from '@/components/ui/register/RegisterStep2';

export default function RegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
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
        <View style={styles.contentContainer}>
          {renderStep()}
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
});