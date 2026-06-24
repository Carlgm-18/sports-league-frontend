import ConfigurationStep from '@/components/ui/league/create/ConfigurationStep';
import GeneralInfoStep from '@/components/ui/league/create/GeneralInfoStep';
import PhasesStep from '@/components/ui/league/create/PhasesStep';
import PunctuationStep from '@/components/ui/league/create/PunctuationStep';
import React, { useState } from 'react';
import { createLeague } from '@/services/LeagueService';
import { useRouter } from 'expo-router';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
    ActivityIndicator,
} from 'react-native';

export default function CreateLeagueScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const result = await createLeague(leagueData as any);
    setLoading(false);
    if (result.ok) {
      alert('Liga creada con éxito');
      router.replace({
        pathname: '/leagues/[leagueId]',
        params: { leagueId: result.data.leagueId },
      });
    } else {
      alert('Error al crear la liga: ' + (result.error?.errorMessage || 'Inténtalo de nuevo'));
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 items-center">
          <Text className="text-2xl font-bold text-gray-900">Crear nueva liga</Text>
          <Text className="text-sm text-gray-500 mt-1">Paso {step} de 4</Text>
        </View>

        <View className="w-full max-w-xl items-center">
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

        <View className="w-full max-w-xl mt-8">
          <View className="flex-row justify-center gap-4">
            {step > 1 && (
              <Pressable
                className="flex-1 bg-white border border-gray-300 rounded-xl h-14 justify-center items-center active:bg-gray-100"
                onPress={() => setStep(step - 1)}
                disabled={loading}
              >
                <Text className="text-gray-700 text-base font-bold">Atrás</Text>
              </Pressable>
            )}

            {step < 4 ? (
              <Pressable
                className="flex-1 bg-blue-600 rounded-xl h-14 justify-center items-center active:bg-blue-700"
                onPress={() => setStep(step + 1)}
              >
                <Text className="text-white text-base font-bold">Siguiente</Text>
              </Pressable>
            ) : (
              <Pressable
                className="flex-1 bg-blue-600 rounded-xl h-14 justify-center items-center active:bg-blue-700"
                onPress={submitLeague}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-base font-bold">Crear Liga</Text>
                )}
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

