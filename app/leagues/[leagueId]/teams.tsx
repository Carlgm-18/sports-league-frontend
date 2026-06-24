import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TeamCard } from '@/components/ui/TeamCard';
import { getTeamsByLeague } from '@/services/TeamService';
import { getUserLeagueStatus } from '@/services/LeagueService';
import { createRequest } from '@/services/RequestService';
import { TeamDetails, ParticipantDetails } from '@/types/api';

export default function TeamsTab() {
  const { leagueId } = useLocalSearchParams<{ leagueId: string }>();
  
  const [teams, setTeams] = useState<TeamDetails[]>([]);
  const [participant, setParticipant] = useState<ParticipantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    if (!leagueId) return;
    setLoading(true);
    
    // Cargar equipos de la liga
    const teamsResult = await getTeamsByLeague(parseInt(leagueId, 10));
    if (teamsResult.ok) {
      setTeams(teamsResult.data);
    }
    
    // Cargar estatus del usuario para saber si es participante y obtener su participantId
    const statusResult = await getUserLeagueStatus(parseInt(leagueId, 10));
    if (statusResult.ok) {
      setParticipant(statusResult.data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [leagueId]);

  const handleJoinTeam = async (teamId: number) => {
    if (!leagueId) return;
    if (!participant) {
      alert('Debes estar inscrito en la liga para poder unirte a un equipo. Ve a la pestaña "Mi Equipo" para inscribirte.');
      return;
    }
    
    setActionLoading(true);
    const result = await createRequest(parseInt(leagueId, 10), {
      teamId,
      participantId: participant.participantId,
      leagueId: parseInt(leagueId, 10),
      status: 'PENDING',
    } as any);
    setActionLoading(false);
    
    if (result.ok) {
      alert('Solicitud de ingreso enviada correctamente al capitán del equipo.');
    } else {
      alert('Error al enviar la solicitud: ' + (result.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <View className="max-w-xl w-full mx-auto space-y-6">
        
        {/* Banner para crear equipo */}
        <Link href={{ pathname: '/leagues/[leagueId]/new-team', params: { leagueId } }} asChild>
          <Pressable className="flex-row items-center bg-blue-50 p-4 rounded-xl border border-blue-200 active:bg-blue-100">
            <Ionicons name="add-circle" size={24} color="#2563EB" />
            <View className="flex-1 ml-3">
              <Text className="text-sm font-bold text-blue-900">¿Tienes tu propio grupo?</Text>
              <Text className="text-xs text-blue-600 mt-0.5">
                Crea un equipo nuevo y envía una solicitud para unirte a la liga.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>
        </Link>

        <Text className="text-lg font-bold text-gray-900">Equipos disponibles en la liga</Text>

        {teams.length === 0 ? (
          <Text className="text-sm text-gray-400 italic text-center py-6">
            Aún no se han inscrito equipos en esta liga.
          </Text>
        ) : (
          <View className="space-y-1">
            {teams.map((team) => (
              <TeamCard 
                key={team.teamId}
                name={team.name}
                playersCount={0} // Omitido ya que no se devuelve count en detalles por defecto
                maxPlayers={15}
                coachName={team.motto ? `"${team.motto}"` : undefined}
                iconImageUrl={team.iconImageUrl}
                onPressJoin={() => handleJoinTeam(team.teamId)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
