import ConfigurationStep from '@/components/ui/league/create/ConfigurationStep';
import GeneralInfoStep from '@/components/ui/league/create/GeneralInfoStep';
import PhasesStep from '@/components/ui/league/create/PhasesStep';
import PunctuationStep from '@/components/ui/league/create/PunctuationStep';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function CreateLeagueScreen() {
  const [step, setStep] = useState(1);
  const [leagueData, setLeagueData] = useState({
    name: '',
    description: '',
    iconImageUrl: '',
    bannerImageUrl: '',
    locationUrl: '',
    startDate: '',
    endDate: '',
    maxInscriptionDate: '',
    configuration: {
      category: 'MALE', // MALE, FEMALE, MIXED
      minTeamFemaleIntegrants: 0,
      minTeamMembers: 2,
      maxTeamMembers: 20,
      roundDuration: 1,
      sportName: '',
    },
    punctuationSystem: [],
    phases: [],
  });

  const updateData = (key: string, value: any) => {
    setLeagueData((prev) => ({ ...prev, [key]: value }));
  };

  const submitLeague = async () => {
    // TODO: Implementar llamada a API para crear la liga
    console.log(JSON.stringify(leagueData, null, 2));
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
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Crear nueva liga</Text>
          <Text style={styles.subtitle}>Paso {step} de 4</Text>
        </View>

        <View style={styles.formContainer}>
          {step === 1 && (
            <GeneralInfoStep data={leagueData} updateData={updateData} />
          )}
          {step === 2 && (
            <ConfigurationStep
              data={leagueData.configuration}
              updateData={(val: string | number) =>
                updateData('configuration', val)
              }
            />
          )}
          {step === 3 && (
            <PunctuationStep
              data={leagueData.punctuationSystem}
              updateData={(val: string | number) =>
                updateData('punctuationSystem', val)
              }
            />
          )}
          {step === 4 && (
            <PhasesStep
              data={leagueData.phases}
              updateData={(val: string | number) => updateData('phases', val)}
            />
          )}
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.buttonsRow}>
            {step > 1 && (
              <Pressable
                style={({ pressed, hovered }: any) => [
                  styles.secondaryButton,
                  (hovered || pressed) && styles.secondaryButtonDarkened,
                ]}
                onPress={() => setStep(step - 1)}
              >
                <Text style={styles.secondaryButtonText}>Atrás</Text>
              </Pressable>
            )}

            {step < 4 ? (
              <Pressable
                style={({ pressed, hovered }: any) => [
                  styles.primaryButton,
                  (hovered || pressed) && styles.primaryButtonDarkened,
                ]}
                onPress={() => setStep(step + 1)}
              >
                <Text style={styles.primaryButtonText}>Siguiente</Text>
              </Pressable>
            ) : (
              <Pressable
                style={({ pressed, hovered }: any) => [
                  styles.primaryButton,
                  (hovered || pressed) && styles.primaryButtonDarkened,
                ]}
                onPress={submitLeague}
              >
                <Text style={styles.primaryButtonText}>Crear Liga</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Mismo fondo que el registro
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
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
    maxWidth: 600, // Limita el ancho en pantallas grandes (web)
    alignItems: 'center',
  },
  footerContainer: {
    width: '100%',
    maxWidth: 600,
    marginTop: 32,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonDarkened: {
    backgroundColor: '#1565C0',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonDarkened: {
    backgroundColor: '#F3F4F6',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
