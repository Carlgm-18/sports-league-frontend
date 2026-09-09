import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPhaseDetails, getLeaderboard } from '@/services/LeagueService';
import { LeaderboardResponse } from '@/types/api';

export default function PhaseDetailScreen() {
  const { leagueId, phaseId } = useLocalSearchParams<{ leagueId: string; phaseId: string }>();
  const router = useRouter();
  const [phase, setPhase] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const isTournament = phase?.type === 'Torneo' || Number(phaseId) > 1;

  const fetchDetails = async () => {
    setLoading(true);
    const pResult = await getPhaseDetails(Number(leagueId), phaseId);
    if (pResult.ok && pResult.data) {
      setPhase(pResult.data);
    } else {
      // Fallback si no está implementado en backend
      const isTourn = Number(phaseId) > 1;
      setPhase({
        phaseId: Number(phaseId),
        name: isTourn ? `Fase ${phaseId}: Torneo y Playoffs` : `Fase ${phaseId}: Clasificación General`,
        type: isTourn ? 'Torneo' : 'Clasificación',
        startDate: isTourn ? '2027-01-17' : '2026-10-12',
        endDate: isTourn ? '2027-05-30' : '2026-12-20',
        groups: [
          { name: 'Grupo A', teams: ['Club Atlético', 'Deportivo Palma', 'RCD Campus', 'Fútbol Sala Ciutat'] },
          { name: 'Grupo B', teams: ['Sporting Balear', 'Inter Mallorca', 'Voley Palma', 'Titanes FC'] },
          { name: 'Grupo C', teams: ['CD Politécnica', 'Huracán FC', 'Universitarios', 'Real Ciencias'] },
        ],
      });
    }

    // Leaderboard para fase de clasificación
    const leadResult = await getLeaderboard(Number(leagueId), Number(phaseId));
    if (leadResult.ok && leadResult.data) {
      setLeaderboard(leadResult.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDetails();
  }, [leagueId, phaseId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0060a8" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16, paddingBottom: 50 }}>
      <View className="max-w-3xl w-full mx-auto space-y-6">
        
        {/* Header con botón atrás */}
        <View>
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-2">
            <Ionicons name="arrow-back" size={18} color="#0060a8" />
            <Text className="text-sm text-[#0060a8] font-bold ml-1">Ver fases</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-black text-gray-900 tracking-tight">{phase?.name || `Fase #${phaseId}`}</Text>
        </View>

        {/* Info Card de la Fase */}
        <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-sm font-bold text-gray-700">Tipo de fase:</Text>
            <View className="bg-[#e6eff7] px-2.5 py-0.5 rounded-full">
              <Text className="text-xs font-bold text-[#0060a8]">{phase?.type || (isTournament ? 'Torneo' : 'Clasificación')}</Text>
            </View>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500">Fecha de inicio:</Text>
            <Text className="text-sm font-semibold text-gray-800">
              {phase?.startDate ? new Date(phase.startDate).toLocaleDateString('es-ES') : '12/10/2026'}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500">Fecha de finalización:</Text>
            <Text className="text-sm font-semibold text-gray-800">
              {phase?.endDate ? new Date(phase.endDate).toLocaleDateString('es-ES') : '20/12/2026'}
            </Text>
          </View>
        </View>

        {/* Sección de Grupos (Maqueta 1 derecha) */}
        {!isTournament && (
          <View className="space-y-3">
            <Text className="text-xl font-bold text-gray-900">Grupos de la Fase</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3 py-1">
              {(phase?.groups || [
                { name: 'Grupo A', teams: ['Equipo 1', 'Equipo 2', 'Equipo 3', 'Equipo 4'] },
                { name: 'Grupo B', teams: ['Equipo 5', 'Equipo 6', 'Equipo 7', 'Equipo 8'] },
                { name: 'Grupo C', teams: ['Equipo 9', 'Equipo 10', 'Equipo 11', 'Equipo 12'] },
              ]).map((group: any, idx: number) => (
                <View key={idx} className="w-56 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mr-3">
                  <View className="bg-[#0060a8] p-3 items-center">
                    <Text className="text-white font-bold text-sm tracking-wide">{group.name}</Text>
                  </View>
                  <View className="p-4 space-y-2">
                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Equipos</Text>
                    {group.teams.map((t: string, tIdx: number) => (
                      <View key={tIdx} className="flex-row items-center space-x-2">
                        <View className="w-4 h-4 rounded-full bg-gray-300 mr-2 items-center justify-center">
                          <Text className="text-[9px] font-bold text-white">{tIdx + 1}</Text>
                        </View>
                        <Text className="text-xs text-gray-700 font-medium" numberOfLines={1}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Si es tipo Clasificación: Mostrar Tabla de Clasificación */}
        {!isTournament && (
          <View className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-4">
            <Text className="text-lg font-bold text-gray-900 flex-row items-center">
              <Ionicons name="trophy-outline" size={20} color="#0060a8" /> Tabla Clasificatoria de la Fase
            </Text>

            <View className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <View className="flex-row items-center pb-2 border-b border-gray-200">
                <Text className="w-8 text-[11px] font-bold text-gray-400 text-center">POS</Text>
                <Text className="flex-1 text-[11px] font-bold text-gray-400">EQUIPO</Text>
                <Text className="w-8 text-[11px] font-bold text-gray-400 text-center">PJ</Text>
                <Text className="w-8 text-[11px] font-bold text-gray-400 text-center">G</Text>
                <Text className="w-8 text-[11px] font-bold text-gray-400 text-center">E</Text>
                <Text className="w-8 text-[11px] font-bold text-gray-400 text-center">P</Text>
                <Text className="w-10 text-[11px] font-bold text-[#0060a8] text-center">PTS</Text>
              </View>

              {/* Filas de la clasificación */}
              {(leaderboard && leaderboard.length > 0 && (leaderboard[0] as any).leaderboard
                ? (leaderboard[0] as any).leaderboard
                : [
                    { team: { name: 'Club Atlético' }, playedMatches: 6, wonMatches: 5, drawnMatches: 1, lostMatches: 0, points: 16 },
                    { team: { name: 'Deportivo Palma' }, playedMatches: 6, wonMatches: 4, drawnMatches: 1, lostMatches: 1, points: 13 },
                    { team: { name: 'RCD Campus' }, playedMatches: 6, wonMatches: 3, drawnMatches: 0, lostMatches: 3, points: 9 },
                    { team: { name: 'Fútbol Sala Ciutat' }, playedMatches: 6, wonMatches: 1, drawnMatches: 0, lostMatches: 5, points: 3 },
                  ]
              ).map((row: any, rIdx: number) => (
                <View key={rIdx} className="flex-row items-center py-2.5 border-b border-gray-100 last:border-b-0">
                  <Text className={`w-8 text-xs font-bold text-center ${rIdx === 0 ? 'text-amber-500' : 'text-gray-700'}`}>
                    {rIdx + 1}
                  </Text>
                  <Text className="flex-1 text-xs font-bold text-gray-800" numberOfLines={1}>
                    {row.team?.name || 'Equipo'}
                  </Text>
                  <Text className="w-8 text-xs text-gray-600 text-center">{row.playedMatches || 0}</Text>
                  <Text className="w-8 text-xs text-gray-600 text-center">{row.wonMatches || 0}</Text>
                  <Text className="w-8 text-xs text-gray-600 text-center">{row.drawnMatches || 0}</Text>
                  <Text className="w-8 text-xs text-gray-600 text-center">{row.lostMatches || 0}</Text>
                  <Text className="w-10 text-xs font-black text-[#0060a8] text-center">{row.points || 0}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Si es tipo Torneo: Mostrar Árbol de Eliminatorias (Tournament Bracket Tree) */}
        {isTournament && (
          <View className="space-y-4">
            <Text className="text-xl font-bold text-gray-900 flex-row items-center">
              <Ionicons name="git-branch-outline" size={20} color="#0060a8" /> Árbol de Eliminatorias (Playoffs)
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
              <View className="flex-row space-x-6">
                
                {/* Cuartos de Final */}
                <View className="w-64 space-y-4">
                  <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Cuartos de Final</Text>
                  
                  {/* Cuartos 1 */}
                  <View className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs font-bold text-gray-800">Club Atlético</Text>
                      <Text className="text-xs font-black text-[#0060a8]">3</Text>
                    </View>
                    <View className="h-px bg-gray-100" />
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-gray-500">Real Ciencias</Text>
                      <Text className="text-xs font-bold text-gray-400">1</Text>
                    </View>
                  </View>

                  {/* Cuartos 2 */}
                  <View className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs font-bold text-gray-800">Sporting Balear</Text>
                      <Text className="text-xs font-black text-[#0060a8]">2</Text>
                    </View>
                    <View className="h-px bg-gray-100" />
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-gray-500">RCD Campus</Text>
                      <Text className="text-xs font-bold text-gray-400">0</Text>
                    </View>
                  </View>

                  {/* Cuartos 3 */}
                  <View className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs font-bold text-gray-800">Deportivo Palma</Text>
                      <Text className="text-xs font-black text-[#0060a8]">4</Text>
                    </View>
                    <View className="h-px bg-gray-100" />
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-gray-500">Voley Palma</Text>
                      <Text className="text-xs font-bold text-gray-400">2</Text>
                    </View>
                  </View>
                </View>

                {/* Semifinales */}
                <View className="w-64 space-y-8 justify-center">
                  <Text className="text-xs font-bold text-[#0060a8] uppercase tracking-wider text-center">Semifinales</Text>
                  
                  {/* Semifinal 1 */}
                  <View className="bg-white p-3 rounded-xl border-2 border-[#0060a8] shadow-sm space-y-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs font-bold text-gray-800">Club Atlético</Text>
                      <Text className="text-xs font-black text-[#0060a8]">2</Text>
                    </View>
                    <View className="h-px bg-gray-100" />
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-gray-500">Sporting Balear</Text>
                      <Text className="text-xs font-bold text-gray-400">1</Text>
                    </View>
                  </View>

                  {/* Semifinal 2 */}
                  <View className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs font-bold text-gray-800">Deportivo Palma</Text>
                      <Text className="text-xs font-black text-[#0060a8]">-</Text>
                    </View>
                    <View className="h-px bg-gray-100" />
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-gray-700">Por definir</Text>
                      <Text className="text-xs font-bold text-gray-400">-</Text>
                    </View>
                  </View>
                </View>

                {/* Gran Final */}
                <View className="w-64 space-y-4 justify-center">
                  <Text className="text-xs font-bold text-amber-600 uppercase tracking-wider text-center">🏆 Gran Final</Text>
                  
                  <View className="bg-gradient-to-r from-amber-50 to-white p-4 rounded-2xl border-2 border-amber-400 shadow-md space-y-3">
                    <View className="bg-amber-100 self-center px-3 py-0.5 rounded-full">
                      <Text className="text-[10px] font-black text-amber-800">POR EL TÍTULO</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs font-black text-gray-900">Club Atlético</Text>
                      <Text className="text-xs font-black text-amber-600">VS</Text>
                    </View>
                    <View className="h-px bg-amber-200" />
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs font-bold text-gray-500">Finalista 2 (Pendiente)</Text>
                      <Text className="text-xs text-gray-400">-</Text>
                    </View>
                  </View>
                </View>

              </View>
            </ScrollView>
          </View>
        )}

      </View>
    </ScrollView>
  );
}