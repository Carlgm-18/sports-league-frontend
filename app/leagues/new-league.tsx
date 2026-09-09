import ConfigurationStep from '@/components/ui/league/create/ConfigurationStep';
import GeneralInfoStep from '@/components/ui/league/create/GeneralInfoStep';
import PhasesStep from '@/components/ui/league/create/PhasesStep';
import PunctuationStep from '@/components/ui/league/create/PunctuationStep';
import React, { useState } from 'react';
import { createLeague } from '@/services/LeagueService';
import { uploadFileToStorage } from '@/services/StorageService';
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
  const [leagueData, setLeagueData] = useState<any>({
    name: '',
    description: '',
    iconImageUrl: '',
    iconImageIsLocal: false,
    bannerImageUrl: '',
    bannerImageIsLocal: false,
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
    setLeagueData((prev: any) => ({ ...prev, [key]: value }));
  };

  const isStep1Valid =
    leagueData.name.trim().length > 0 &&
    leagueData.startDate.trim().length > 0 &&
    leagueData.endDate.trim().length > 0 &&
    leagueData.locationUrl.trim().length > 0;

  const handleNext = () => {
    if (step === 1 && !isStep1Valid) {
      alert('Por favor, rellena los campos obligatorios del Paso 1 (Nombre, Fechas y Ubicación).');
      return;
    }
    setStep(step + 1);
  };

  const submitLeague = async () => {
    if (!isStep1Valid) {
      alert('Faltan campos obligatorios en la información general de la liga.');
      setStep(1);
      return;
    }

    setLoading(true);

    let finalIconUrl = leagueData.iconImageUrl;
    let finalBannerUrl = leagueData.bannerImageUrl;

    // Subir a MinIO solo en el momento de enviar el formulario si están en memoria local
    try {
      if (leagueData.iconImageIsLocal && finalIconUrl && finalIconUrl.startsWith('file://')) {
        finalIconUrl = await uploadFileToStorage('avatars', finalIconUrl, 'image/jpeg', 'jpg');
      }
      if (leagueData.bannerImageIsLocal && finalBannerUrl && finalBannerUrl.startsWith('file://')) {
        finalBannerUrl = await uploadFileToStorage('banners', finalBannerUrl, 'image/jpeg', 'jpg');
      }
    } catch (uploadErr: any) {
      alert('Error al subir imágenes a MinIO: ' + (uploadErr.message || 'Error desconocido'));
      setLoading(false);
      return;
    }

    const payload = {
      ...leagueData,
      iconImageUrl: finalIconUrl,
      bannerImageUrl: finalBannerUrl,
    };
    delete payload.iconImageIsLocal;
    delete payload.bannerImageIsLocal;

    const result = await createLeague(payload as any);
    setLoading(false);
    if (result.ok) {
      alert('¡Liga creada con éxito!');
      router.replace({
        pathname: '/leagues/[leagueId]',
        params: { leagueId: String(result.data.leagueId) },
      });
    } else {
      alert('Error al crear liga: ' + (result.error?.errorMessage || 'Revisa los datos'));
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
              updateData={(val: any) =>
                updateData('configuration', val)
              }
            />
          )}
          {step === 3 && (
            <PunctuationStep
              data={leagueData.punctuationSystem}
              updateData={(val: any) =>
                updateData('punctuationSystem', val)
              }
            />
          )}
          {step === 4 && (
            <PhasesStep
              data={leagueData.phases}
              updateData={(val: any) => updateData('phases', val)}
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
                className={`flex-1 rounded-xl h-14 justify-center items-center ${step === 1 && !isStep1Valid ? 'bg-[#0060a8]/50' : 'bg-[#0060a8] active:bg-[#004375]'}`}
                onPress={handleNext}
              >
                <Text className="text-white text-base font-bold">Siguiente</Text>
              </Pressable>
            ) : (
              <Pressable
                className="flex-1 bg-[#0060a8] rounded-xl h-14 justify-center items-center active:bg-[#004375]"
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

