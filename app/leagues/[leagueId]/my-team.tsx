import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getUserLeagueStatus, joinLeague, getLeagueParticipants } from '@/services/LeagueService';
import { getTeamDetails } from '@/services/TeamService';
import { getJoinRequestsByTeamId, resolveRequest } from '@/services/RequestService';
import { ParticipantDetails, ParticipantSummary, TeamDetails, BaseRequest } from '@/types/api';

export default function MyTeamTab() {
  const { leagueId } = useLocalSearchParams<{ leagueId: string }>();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [isParticipant, setIsParticipant] = useState(false);
  const [participant, setParticipant] = useState<ParticipantDetails | null>(null);
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [roster, setRoster] = useState<ParticipantSummary[]>([]);
  const [joinRequests, setJoinRequests] = useState<BaseRequest[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStatus = async () => {
    if (!leagueId) return;
    setLoading(true);
    const statusResult = await getUserLeagueStatus(parseInt(leagueId, 10));
    
    if (statusResult.ok) {
      setIsParticipant(true);
      const partData = statusResult.data;
      setParticipant(partData);
      
      if (partData.team) {
        // Cargar detalles del equipo
        const teamResult = await getTeamDetails(partData.team.teamId);
        if (teamResult.ok) {
          setTeam(teamResult.data);
        }
        
        // Cargar plantilla completa desde los participantes de la liga
        const partsResult = await getLeagueParticipants(parseInt(leagueId, 10));
        if (partsResult.ok) {
          const teamRoster = partsResult.data.filter(p => p.team?.teamId === partData.team.teamId);
          setRoster(teamRoster);
        }

        // Si es Capitán, cargar solicitudes pendientes
        const isCaptain = partData.roles?.includes('CAPTAIN') || partData.roles?.includes('ADMIN');
        if (isCaptain) {
          const reqsResult = await getJoinRequestsByTeamId(partData.team.teamId);
          if (reqsResult.ok) {
            setJoinRequests(reqsResult.data.filter(r => r.status === 'PENDING'));
          }
        }
      }
    } else {
      setIsParticipant(false);
      setParticipant(null);
      setTeam(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
  }, [leagueId]);

  const handleJoinLeague = async () => {
    if (!leagueId) return;
    setActionLoading(true);
    const result = await joinLeague(parseInt(leagueId, 10));
    setActionLoading(false);
    if (result.ok) {
      alert('Te has inscrito correctamente en la liga.');
      fetchStatus();
    } else {
      alert('Error al inscribirse: ' + (result.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  const handleResolveRequest = async (requestId: number, accept: boolean) => {
    setActionLoading(true);
    const result = await resolveRequest(requestId, {
      status: (accept ? 'ACCEPTED' : 'REJECTED') as any
    });
    setActionLoading(false);
    if (result.ok) {
      alert(accept ? 'Jugador aceptado en el equipo.' : 'Solicitud rechazada.');
      fetchStatus();
    } else {
      alert('Error al procesar la solicitud.');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // CASO 1: No inscrito en la liga
  if (!isParticipant) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <View className="max-w-md w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 items-center">
          <View className="w-16 h-16 bg-blue-50 rounded-full justify-center items-center mb-4">
            <Ionicons name="trophy-outline" size={32} color="#2563EB" />
          </View>
          <Text className="text-xl font-bold text-gray-900 text-center mb-2">Únete a esta Liga</Text>
          <Text className="text-sm text-gray-500 text-center mb-6">
            Para poder crear un equipo o inscribirte en uno existente, primero debes registrarte como participante de la liga.
          </Text>
          <TouchableOpacity
            className="w-full bg-blue-600 py-3.5 rounded-xl items-center active:bg-blue-700"
            onPress={handleJoinLeague}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Inscribirse en la Liga</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // CASO 2: Inscrito pero sin equipo
  if (!team) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <View className="max-w-md w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 items-center">
          <View className="w-16 h-16 bg-blue-50 rounded-full justify-center items-center mb-4">
            <Ionicons name="shield-outline" size={32} color="#2563EB" />
          </View>
          <Text className="text-xl font-bold text-gray-900 text-center mb-2">Ya eres participante</Text>
          <Text className="text-sm text-gray-500 text-center mb-6">
            Estás inscrito en la liga, pero aún no formas parte de ningún equipo. Elige una de las siguientes opciones:
          </Text>

          <View className="w-full space-y-3">
            <TouchableOpacity
              className="w-full bg-blue-600 py-3.5 rounded-xl items-center active:bg-blue-700"
              onPress={() => router.push(`/leagues/${leagueId}/new-team`)}
            >
              <Text className="text-white font-bold text-base">Crear un Nuevo Equipo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-white border border-gray-300 py-3.5 rounded-xl items-center active:bg-gray-100"
              onPress={() => alert('Pestaña de equipos: solicita unirte a uno de los equipos listados.')}
            >
              <Text className="text-gray-700 font-bold text-base">Unirse a un Equipo Existente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const isCaptain = (participant?.roles as any)?.includes('CAPTAIN') || (participant?.roles as any)?.includes('ADMIN');

  // CASO 3: Tiene equipo
  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <View className="max-w-3xl w-full mx-auto space-y-6">
        
        {/* Team Card Detail */}
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <View className="flex-row items-center">
            <View 
              className="w-16 h-16 rounded-2xl justify-center items-center mr-4"
              style={{ backgroundColor: team.primaryColor.slice(0, 7) || '#007AFF' }}
            >
              <Text className="text-white text-2xl font-extrabold">{team.initials}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">{team.name}</Text>
              <Text className="text-sm text-gray-500 italic mt-0.5">{"\"" + team.motto + "\""}</Text>
            </View>
          </View>
          <Text className="text-sm text-gray-700 mt-4 leading-relaxed">{team.description}</Text>
        </View>

        {/* Roster list */}
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <Text className="text-base font-bold text-gray-900 mb-4">Plantilla del Equipo</Text>
          <View className="space-y-1">
            {roster.map((player) => (
              <View key={player.participantId} className="flex-row items-center py-3 border-b border-gray-50 last:border-b-0">
                <Ionicons name="person-circle-outline" size={32} color="#9CA3AF" />
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-semibold text-gray-900">{player.fullName || 'Jugador'}</Text>
                  <Text className="text-xs text-gray-400">Dorsal: #{player.dorsal}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Captain zone: Pending requests */}
        {isCaptain && (
          <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <Text className="text-base font-bold text-red-600 mb-4 flex-row items-center">
              <Ionicons name="settings-outline" size={18} color="#EF4444" /> Panel de Capitanía
            </Text>
            
            <Text className="text-sm font-semibold text-gray-800 mb-3">Solicitudes de Unión Pendientes</Text>

            {joinRequests.length === 0 ? (
              <Text className="text-sm text-gray-400 italic">No hay solicitudes pendientes en este momento.</Text>
            ) : (
              <View className="space-y-3">
                {joinRequests.map((req) => (
                  <View key={req.requestId} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex-row items-center justify-between">
                    <View className="flex-1 mr-3">
                      <Text className="text-sm font-bold text-gray-800">Participante #{req.participantId}</Text>
                      <Text className="text-xs text-gray-400 mt-1">
                        Solicitado el: {new Date(req.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        className="bg-red-50 p-2 rounded-lg border border-red-200"
                        onPress={() => handleResolveRequest(req.requestId, false)}
                        disabled={actionLoading}
                      >
                        <Ionicons name="close" size={20} color="#EF4444" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-green-50 p-2 rounded-lg border border-green-200"
                        onPress={() => handleResolveRequest(req.requestId, true)}
                        disabled={actionLoading}
                      >
                        <Ionicons name="checkmark" size={20} color="#10B981" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
