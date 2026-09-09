import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPhasesByLeague } from '@/services/LeagueService';

export default function PhasesScreen() {
  const { leagueId } = useLocalSearchParams<{ leagueId: string }>();
  const router = useRouter();
  const [phases, setPhases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhases = async () => {
    setLoading(true);
    const result = await getPhasesByLeague(Number(leagueId));
    if (result.ok && result.data && result.data.length > 0) {
      setPhases(result.data);
    } else {
      // Fallback de fases estructuradas según la maqueta de diseño
      setPhases([
        {
          phaseId: 1,
          name: 'Fase 1: Clasificación general',
          type: 'Clasificación',
          startDate: '2026-10-12',
          endDate: '2026-12-20',
          status: 'FINALIZADA',
        },
        {
          phaseId: 2,
          name: 'Fase 2: Oro / Plata',
          type: 'Torneo',
          startDate: '2027-01-17',
          endDate: '2027-05-30',
          status: 'EN_CURSO',
        },
        {
          phaseId: 3,
          name: 'Fase 3: Fase Final y Playoffs',
          type: 'Torneo',
          startDate: '2027-06-01',
          endDate: '2027-06-25',
          status: 'PENDIENTE',
        },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPhases();
  }, [leagueId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0060a8" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View className="max-w-3xl w-full mx-auto space-y-6">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <TouchableOpacity onPress={() => router.push(`/leagues/${leagueId}`)} className="flex-row items-center mb-1">
              <Ionicons name="arrow-back" size={18} color="#4B5563" />
              <Text className="text-xs text-gray-500 ml-1 font-semibold">Ver ligas</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-black text-gray-900 tracking-tight">Fases del Campeonato</Text>
            <Text className="text-xs text-gray-500 mt-0.5">Ciclo de vida y fases sucesivas de la liga</Text>
          </View>
        </View>

        {/* Listado de tarjetas de fases (horizontal / grid scrollable) */}
        <View className="space-y-4">
          {phases.map((phase, idx) => (
            <View
              key={phase.phaseId || idx}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-2">
                  <Text className="text-lg font-bold text-gray-900">{phase.name || `Fase ${idx + 1}`}</Text>
                  <View className="flex-row items-center mt-1 space-x-2">
                    <View className="bg-[#e6eff7] px-2.5 py-0.5 rounded-md">
                      <Text className="text-xs font-bold text-[#0060a8]">
                        Tipo: {phase.type || (idx === 0 ? 'Clasificación' : 'Torneo')}
                      </Text>
                    </View>
                    {phase.status && (
                      <View className={`px-2 py-0.5 rounded-md ${phase.status === 'EN_CURSO' ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
                        <Text className={`text-[10px] font-bold ${phase.status === 'EN_CURSO' ? 'text-green-700' : 'text-gray-500'}`}>
                          {phase.status}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Botones de acción (Ver / Detalle) */}
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="w-9 h-9 bg-[#e6eff7] rounded-xl justify-center items-center border border-[#0060a8]"
                    onPress={() =>
                      router.push(
                        `/leagues/${leagueId}/phases/${phase.phaseId || idx + 1}/phase` as any
                      )
                    }
                  >
                    <Ionicons name="eye-outline" size={18} color="#0060a8" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex-row justify-between mt-2">
                <View>
                  <Text className="text-[11px] text-gray-400 font-medium">Fecha inicio</Text>
                  <Text className="text-xs font-semibold text-gray-700">
                    {phase.startDate ? new Date(phase.startDate).toLocaleDateString('es-ES') : '12/10/2026'}
                  </Text>
                </View>
                <View>
                  <Text className="text-[11px] text-gray-400 font-medium">Fecha fin</Text>
                  <Text className="text-xs font-semibold text-gray-700">
                    {phase.endDate ? new Date(phase.endDate).toLocaleDateString('es-ES') : '20/12/2026'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
