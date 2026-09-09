import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getLeagueParticipants, getUserLeagueStatus, joinLeague } from '@/services/LeagueService';
import { getTeamDetails, updateParticipantDorsal, kickPlayerFromTeam, deleteTeam, invitePlayerToTeam } from '@/services/TeamService';
import { getJoinRequestsByTeamId, resolveRequest } from '@/services/RequestService';
import { BaseRequest, ParticipantDetails, ParticipantSummary, TeamDetails, LeagueRequestsRequestState } from '@/types/api';

export default function MyTeamScreen() {
  const { leagueId } = useLocalSearchParams<{ leagueId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [participant, setParticipant] = useState<ParticipantDetails | null>(null);
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [roster, setRoster] = useState<ParticipantSummary[]>([]);
  const [joinRequests, setJoinRequests] = useState<BaseRequest[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Modales
  const [showDorsalModal, setShowDorsalModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<ParticipantSummary | null>(null);
  const [newDorsal, setNewDorsal] = useState('');

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteUserInput, setInviteUserInput] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const statusRes = await getUserLeagueStatus(Number(leagueId));
    if (statusRes.ok && statusRes.data) {
      setParticipant(statusRes.data);

      if (statusRes.data.team) {
        const teamRes = await getTeamDetails(statusRes.data.team.teamId);
        if (teamRes.ok) {
          setTeam(teamRes.data);
        }

        const participantsRes = await getLeagueParticipants(Number(leagueId));
        if (participantsRes.ok) {
          const teamMembers = participantsRes.data.filter(
            (p) => (p as any).teamId === statusRes.data.team.teamId || p.participantId === statusRes.data.participantId
          );
          setRoster(teamMembers.length > 0 ? teamMembers : [statusRes.data as any]);
        }

        const isCap = (statusRes.data.roles as any)?.includes('CAPTAIN') || (statusRes.data.roles as any)?.includes('ADMIN');
        if (isCap) {
          const requestsRes = await getJoinRequestsByTeamId(statusRes.data.team.teamId);
          if (requestsRes.ok) {
            setJoinRequests(requestsRes.data);
          }
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [leagueId]);

  const handleJoinLeague = async () => {
    setActionLoading(true);
    const res = await joinLeague(Number(leagueId));
    setActionLoading(false);
    if (res.ok) {
      alert('Te has unido a la liga con éxito.');
      fetchData();
    } else {
      alert('Error al unirse a la liga: ' + (res.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  const handleResolveRequest = async (requestId: number, accept: boolean) => {
    setActionLoading(true);
    const res = await resolveRequest(requestId, {
      status: accept ? LeagueRequestsRequestState.ACCEPTED : LeagueRequestsRequestState.REJECTED,
    });
    setActionLoading(false);
    if (res.ok) {
      alert(accept ? 'Solicitud aceptada.' : 'Solicitud rechazada.');
      fetchData();
    } else {
      alert('Error al resolver la solicitud: ' + (res.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  const handleUpdateDorsal = async () => {
    if (!selectedPlayer || !newDorsal.trim()) return;
    setActionLoading(true);
    const res = await updateParticipantDorsal(selectedPlayer.participantId, parseInt(newDorsal, 10));
    setActionLoading(false);
    if (res.ok) {
      alert('Dorsal actualizado correctamente.');
      setShowDorsalModal(false);
      fetchData();
    } else {
      alert('Error al actualizar dorsal: ' + (res.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  const handleKickPlayer = async (playerId: number, playerName: string) => {
    if (!team) return;
    const confirmKick = confirm(`¿Estás seguro de que deseas expulsar a ${playerName} del equipo?`);
    if (!confirmKick) return;

    setActionLoading(true);
    const res = await kickPlayerFromTeam(team.teamId, playerId);
    setActionLoading(false);
    if (res.ok) {
      alert('Jugador expulsado del equipo.');
      fetchData();
    } else {
      alert('Error al expulsar al jugador: ' + (res.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  const handleSendInvite = async () => {
    if (!team || !inviteUserInput.trim()) return;
    setActionLoading(true);
    const res = await invitePlayerToTeam(team.teamId, inviteUserInput.trim());
    setActionLoading(false);
    if (res.ok) {
      alert('Invitación enviada con éxito al jugador.');
      setShowInviteModal(false);
      setInviteUserInput('');
    } else {
      alert('Error al enviar invitación: ' + (res.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  const handleDeleteTeam = async () => {
    if (!team) return;
    const confirmDelete = confirm('¿Deseas eliminar permanentemente tu equipo? Esta acción disolverá la plantilla.');
    if (!confirmDelete) return;

    setActionLoading(true);
    const res = await deleteTeam(team.teamId);
    setActionLoading(false);
    if (res.ok) {
      alert('Equipo eliminado correctamente.');
      router.push(`/leagues/${leagueId}`);
    } else {
      alert('Error al eliminar equipo: ' + (res.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0060a8" />
      </View>
    );
  }

  // CASO 1: No está registrado en la liga
  if (!participant) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <View className="max-w-md w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 items-center">
          <View className="w-16 h-16 bg-[#e6eff7] rounded-full justify-center items-center mb-4">
            <Ionicons name="trophy-outline" size={32} color="#0060a8" />
          </View>
          <Text className="text-xl font-bold text-gray-900 text-center mb-2">Inscripción requerida</Text>
          <Text className="text-sm text-gray-500 text-center mb-6">
            Aún no estás inscrito en esta liga. Para crear un equipo o unirte a uno, debes unirte primero a la competición.
          </Text>
          <TouchableOpacity
            className="w-full bg-[#0060a8] py-3.5 rounded-xl items-center active:bg-[#004375]"
            onPress={handleJoinLeague}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Unirme a la Liga</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // CASO 2: Registrado en la liga pero sin equipo
  if (!team) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <View className="max-w-md w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 items-center">
          <View className="w-16 h-16 bg-[#e6eff7] rounded-full justify-center items-center mb-4">
            <Ionicons name="shield-outline" size={32} color="#0060a8" />
          </View>
          <Text className="text-xl font-bold text-gray-900 text-center mb-2">Ya eres participante</Text>
          <Text className="text-sm text-gray-500 text-center mb-6">
            Estás inscrito en la liga, pero aún no formas parte de ningún equipo. Elige una de las siguientes opciones:
          </Text>

          <View className="w-full space-y-3">
            <TouchableOpacity
              className="w-full bg-[#0060a8] py-3.5 rounded-xl items-center active:bg-[#004375]"
              onPress={() => router.push(`/leagues/${leagueId}/new-team`)}
            >
              <Text className="text-white font-bold text-base">Crear un Nuevo Equipo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-white border border-gray-300 py-3.5 rounded-xl items-center active:bg-gray-100"
              onPress={() => router.push(`/leagues/${leagueId}/teams` as any)}
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
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16, paddingBottom: 50 }}>
      <View className="max-w-3xl w-full mx-auto space-y-6">
        
        {/* Team Card Detail */}
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-2">
              <View 
                className="w-16 h-16 rounded-2xl justify-center items-center mr-4 shadow-sm"
                style={{ backgroundColor: team.primaryColor?.slice(0, 7) || '#0060a8' }}
              >
                <Text className="text-white text-2xl font-extrabold">{team.initials || 'EQ'}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900">{team.name}</Text>
                <Text className="text-sm text-gray-500 italic mt-0.5">{"\"" + (team.motto || 'Unidos por la victoria') + "\""}</Text>
              </View>
            </View>

            {/* Acciones de Capitán en cabecera */}
            {isCaptain && (
              <TouchableOpacity
                className="bg-[#e6eff7] p-2.5 rounded-xl border border-[#0060a8]"
                onPress={() => setShowInviteModal(true)}
              >
                <Ionicons name="person-add-outline" size={20} color="#0060a8" />
              </TouchableOpacity>
            )}
          </View>
          <Text className="text-sm text-gray-700 mt-4 leading-relaxed">{team.description || 'Sin descripción disponible.'}</Text>
        </View>

        {/* Roster list */}
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-bold text-gray-900">Plantilla del Equipo ({roster.length})</Text>
            {isCaptain && (
              <TouchableOpacity onPress={() => setShowInviteModal(true)} className="flex-row items-center">
                <Ionicons name="add-circle" size={16} color="#0060a8" />
                <Text className="text-xs font-bold text-[#0060a8] ml-1">Invitar jugador</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="space-y-2">
            {roster.map((player) => (
              <View key={player.participantId} className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-full bg-white justify-center items-center border border-gray-200 mr-3">
                    <Ionicons name="shirt-outline" size={20} color="#0060a8" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-900">{player.fullName || `Jugador #${player.participantId}`}</Text>
                    <Text className="text-xs text-gray-400">Dorsal: <Text className="font-bold text-[#0060a8]">#{player.dorsal || 'S/D'}</Text></Text>
                  </View>
                </View>

                {/* Botones de gestión para el capitán */}
                {isCaptain && (
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="bg-white p-2 rounded-lg border border-gray-200"
                      onPress={() => {
                        setSelectedPlayer(player);
                        setNewDorsal(String(player.dorsal || ''));
                        setShowDorsalModal(true);
                      }}
                    >
                      <Ionicons name="pencil-outline" size={16} color="#4B5563" />
                    </TouchableOpacity>
                    {player.participantId !== participant.participantId && (
                      <TouchableOpacity
                        className="bg-red-50 p-2 rounded-lg border border-red-200"
                        onPress={() => handleKickPlayer(player.participantId, player.fullName || 'el jugador')}
                      >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Captain zone: Pending requests */}
        {isCaptain && (
          <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <Text className="text-base font-bold text-[#0060a8] mb-4 flex-row items-center">
              <Ionicons name="settings-outline" size={18} color="#0060a8" /> Solicitudes de Unión Pendientes
            </Text>

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

            {/* Zona de peligro: Eliminar equipo */}
            <View className="border-t border-red-100 pt-4 mt-6">
              <TouchableOpacity
                className="bg-red-50 border border-red-200 py-3 rounded-xl items-center"
                onPress={handleDeleteTeam}
                disabled={actionLoading}
              >
                <Text className="text-red-600 font-bold text-xs">Disolver y Eliminar Equipo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Modal Editar Dorsal */}
      <Modal visible={showDorsalModal} transparent animationType="fade" onRequestClose={() => setShowDorsalModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <View className="bg-white w-full max-w-sm p-6 rounded-2xl space-y-4">
            <Text className="text-lg font-bold text-gray-900">Modificar Dorsal</Text>
            <Text className="text-xs text-gray-500">Introduce el nuevo dorsal para {selectedPlayer?.fullName}:</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-base text-center font-bold"
              placeholder="Número de dorsal (ej. 10)"
              value={newDorsal}
              onChangeText={setNewDorsal}
              keyboardType="numeric"
            />
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-gray-100 py-2.5 rounded-xl items-center" onPress={() => setShowDorsalModal(false)}>
                <Text className="text-gray-600 font-bold text-xs">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-[#0060a8] py-2.5 rounded-xl items-center" onPress={handleUpdateDorsal} disabled={actionLoading}>
                <Text className="text-white font-bold text-xs">Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Invitar Jugador */}
      <Modal visible={showInviteModal} transparent animationType="fade" onRequestClose={() => setShowInviteModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <View className="bg-white w-full max-w-sm p-6 rounded-2xl space-y-4">
            <Text className="text-lg font-bold text-gray-900">Invitar Jugador al Equipo</Text>
            <Text className="text-xs text-gray-500">Introduce el correo electrónico o ID de usuario para enviarle una invitación directa:</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm"
              placeholder="email@usuario.com o ID"
              value={inviteUserInput}
              onChangeText={setInviteUserInput}
              autoCapitalize="none"
            />
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-gray-100 py-2.5 rounded-xl items-center" onPress={() => setShowInviteModal(false)}>
                <Text className="text-gray-600 font-bold text-xs">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-[#0060a8] py-2.5 rounded-xl items-center" onPress={handleSendInvite} disabled={actionLoading}>
                <Text className="text-white font-bold text-xs">Enviar Invitación</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
