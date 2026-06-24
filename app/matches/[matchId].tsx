import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getMatchDetails, createProposal, resolveProposal, forceAssignReferee, getRoundAvailability, autoAssignReferee } from '@/services/MatchService';
import { registerResult } from '@/services/ResultService';
import { getCurrentUser } from '@/services/UserService';
import { getUserLeagueStatus } from '@/services/LeagueService';
import { MatchDetails, UserDetails, ParticipantDetails, ResultDetails, ProposalState, MatchPeriod } from '@/types/api';

export default function MatchDetailScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [currentUser, setCurrentUser] = useState<UserDetails | null>(null);
  const [leagueStatus, setLeagueStatus] = useState<ParticipantDetails | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [showProposalPanel, setShowProposalPanel] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Estados para registro de resultados (Árbitro)
  const [showResultForm, setShowResultForm] = useState(false);
  const [localScore1, setLocalScore1] = useState('0');
  const [visitorScore1, setVisitorScore1] = useState('0');
  const [localScore2, setLocalScore2] = useState('0');
  const [visitorScore2, setVisitorScore2] = useState('0');
  const [observations, setObservations] = useState('');
  const [refereeSignature, setRefereeSignature] = useState('');
  const [localCapSignature, setLocalCapSignature] = useState('');
  const [visitorCapSignature, setVisitorCapSignature] = useState('');

  const fetchMatchInfo = async () => {
    if (!matchId) return;
    setLoading(true);
    const matchResult = await getMatchDetails(parseInt(matchId, 10));
    if (matchResult.ok) {
      const matchData = matchResult.data;
      setMatch(matchData);
      
      // Obtener el estado del usuario en la liga de este partido
      if (matchData.roundId) {
        // Obtenemos los slots del round
        const slotsResult = await getRoundAvailability(matchData.roundId);
        if (slotsResult.ok) {
          setAvailableSlots(slotsResult.data);
        }
      }
      
      // Obtener usuario actual
      const userResult = await getCurrentUser();
      if (userResult.ok) {
        setCurrentUser(userResult.data);
      }
      
      // Encontrar estatus en la liga si está disponible
      // (Buscamos la liga a partir del partido, pero como el backend no da directo el leagueId en MatchDetails,
      // asumimos leagueId = 1 para pruebas, o lo inferimos de roundId si es posible. Para mayor seguridad,
      // podemos consumir el estado de leagueId 1 o asociarlo al localTeam de la liga)
      const leagueId = matchData.localTeam?.teamId ? 1 : 1; // Ajuste por defecto o fallback
      const statusResult = await getUserLeagueStatus(leagueId);
      if (statusResult.ok) {
        setLeagueStatus(statusResult.data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMatchInfo();
  }, [matchId]);

  const handleProposeSlot = async (slotId: number) => {
    if (!matchId) return;
    setActionLoading(true);
    const result = await createProposal(parseInt(matchId, 10), { dateTimeSlotId: slotId });
    setActionLoading(false);
    if (result.ok) {
      alert('Propuesta de horario enviada con éxito.');
      setShowProposalPanel(false);
      fetchMatchInfo();
    } else {
      alert('Error al enviar la propuesta: ' + (result.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  const handleAcceptProposal = async (proposalId: number, approve: boolean) => {
    if (!matchId) return;
    setActionLoading(true);
    const result = await resolveProposal(
      parseInt(matchId, 10),
      proposalId,
      { status: (approve ? 'APPROVED' : 'DISMISSED') as any }
    );
    setActionLoading(false);
    if (result.ok) {
      alert(approve ? 'Fecha de partido confirmada de mutuo acuerdo.' : 'Propuesta de fecha rechazada.');
      fetchMatchInfo();
    } else {
      alert('Error al resolver la propuesta: ' + (result.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  const handleAutoAssign = async () => {
    if (!matchId) return;
    setActionLoading(true);
    const result = await autoAssignReferee(parseInt(matchId, 10));
    setActionLoading(false);
    if (result.ok) {
      alert('Árbitro asignado automáticamente.');
      fetchMatchInfo();
    } else {
      alert('Error al asignar árbitro.');
    }
  };

  const handleSaveResult = async () => {
    if (!matchId || !match) return;
    setActionLoading(true);

    const periods: MatchPeriod[] = [
      {
        periodNumber: 1,
        localScore: parseInt(localScore1, 10) || 0,
        visitorScore: parseInt(visitorScore1, 10) || 0,
        periodType: 'HALF',
        events: []
      },
      {
        periodNumber: 2,
        localScore: parseInt(localScore2, 10) || 0,
        visitorScore: parseInt(visitorScore2, 10) || 0,
        periodType: 'HALF',
        events: []
      }
    ];

    const resultPayload: ResultDetails = {
      localTotalScore: (periods[0].localScore + periods[1].localScore),
      visitorTotalScore: (periods[0].visitorScore + periods[1].visitorScore),
      recordUrl: 'https://i.pravatar.cc/300',
      observations: observations ? [observations] : [],
      periods: periods,
      signatures: {
        beforeMatchSignatures: {
          firstRefereeSignature: { signImageUrl: refereeSignature || 'https://i.pravatar.cc/100?img=1' },
          secondRefereeSignature: {},
          localCaptainSignature: { signImageUrl: localCapSignature || 'https://i.pravatar.cc/100?img=2' },
          visitorCaptainSignature: { signImageUrl: visitorCapSignature || 'https://i.pravatar.cc/100?img=3' }
        },
        afterMatchSignatures: {
          firstRefereeSignature: { signImageUrl: refereeSignature || 'https://i.pravatar.cc/100?img=1' },
          secondRefereeSignature: {},
          localCaptainSignature: { signImageUrl: localCapSignature || 'https://i.pravatar.cc/100?img=2' },
          visitorCaptainSignature: { signImageUrl: visitorCapSignature || 'https://i.pravatar.cc/100?img=3' }
        }
      }
    };

    const result = await registerResult(parseInt(matchId, 10), resultPayload);
    setActionLoading(false);

    if (result.ok) {
      alert('Marcador y acta del partido guardados correctamente.');
      setShowResultForm(false);
      fetchMatchInfo();
    } else {
      alert('Error al guardar el acta: ' + (result.error?.errorMessage || 'Verifica los campos.'));
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!match) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <Text className="text-gray-500 text-lg font-medium text-center">
          Partido no encontrado.
        </Text>
      </View>
    );
  }

  // Comprobaciones de roles
  const isLocalCaptain = leagueStatus?.team?.teamId === match.localTeam?.teamId && (leagueStatus?.roles as any)?.includes('CAPTAIN');
  const isVisitorCaptain = leagueStatus?.team?.teamId === match.visitorTeam?.teamId && (leagueStatus?.roles as any)?.includes('CAPTAIN');
  const isEitherCaptain = isLocalCaptain || isVisitorCaptain;
  
  // Es árbitro principal si su userId coincide
  const isFirstReferee = match.firstReferee?.userId === currentUser?.userId;

  const formattedDate = match.dateTime?.dateTime
    ? new Date(match.dateTime.dateTime).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Fecha y hora pendiente de acuerdo';

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <View className="max-w-2xl w-full mx-auto space-y-6">
        
        {/* Header de navegación rápida */}
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center space-x-1 py-2">
          <Ionicons name="arrow-back" size={20} color="#4B5563" />
          <Text className="text-sm text-gray-600 font-semibold ml-1">Volver a partidos</Text>
        </TouchableOpacity>

        {/* Marcador Principal */}
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 items-center">
          <Text className="text-xs text-gray-400 font-semibold mb-4 uppercase tracking-wider">
            Jornada #{match.roundId}
          </Text>

          <View className="flex-row justify-between items-center w-full px-4">
            {/* Local Team */}
            <View className="flex-1 items-center">
              <View className="w-14 h-14 rounded-full bg-blue-100 justify-center items-center mb-3">
                <Ionicons name="shield-outline" size={28} color="#2563EB" />
              </View>
              <Text className="text-base font-bold text-gray-900 text-center" numberOfLines={2}>
                {match.localTeam?.name || 'Por definir'}
              </Text>
            </View>

            {/* Score */}
            <View className="flex-row items-center justify-center space-x-4 mx-6">
              {match.status === 'ENDED' ? (
                <View className="flex-row items-center">
                  <Text className="text-3xl font-extrabold text-gray-900">{match.resultSummary?.localTotalScore}</Text>
                  <Text className="text-xl text-gray-400 mx-2">-</Text>
                  <Text className="text-3xl font-extrabold text-gray-900">{match.resultSummary?.visitorTotalScore}</Text>
                </View>
              ) : (
                <View className="bg-gray-100 px-3 py-1.5 rounded-full">
                  <Text className="text-xs text-gray-500 font-bold uppercase">{match.status}</Text>
                </View>
              )}
            </View>

            {/* Visitor Team */}
            <View className="flex-1 items-center">
              <View className="w-14 h-14 rounded-full bg-green-100 justify-center items-center mb-3">
                <Ionicons name="shield-outline" size={28} color="#10B981" />
              </View>
              <Text className="text-base font-bold text-gray-900 text-center" numberOfLines={2}>
                {match.visitorTeam?.name || 'Por decidir'}
              </Text>
            </View>
          </View>

          <View className="w-full border-t border-gray-100 mt-6 pt-4 items-center">
            <Text className="text-xs text-gray-500 text-center flex-row items-center">
              <Ionicons name="calendar-outline" size={14} color="#6B7280" /> {formattedDate}
            </Text>
          </View>
        </View>

        {/* Panel de Propuesta de Horario Activa */}
        {match.proposal && (
          <View className="bg-blue-50 p-5 rounded-2xl border border-blue-200">
            <Text className="text-sm font-bold text-blue-900 mb-2 flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#1E3A8A" /> Propuesta de fecha activa
            </Text>
            <Text className="text-xs text-blue-800">
              Se ha propuesto el slot para el día:{' '}
              <Text className="font-bold">
                {new Date(match.proposal.dateTimeSlot.dateTime).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>{' '}
              ({match.proposal.dateTimeSlot.duration} minutos de duración).
            </Text>
            <Text className="text-xs text-blue-600 mt-1">Estado de propuesta: {match.proposal.status}</Text>

            {/* Acciones de propuesta */}
            {match.proposal.status === 'PENDING' && (
              <View className="flex-row gap-3 mt-4">
                <TouchableOpacity
                  className="flex-1 bg-white border border-red-300 py-2.5 rounded-lg items-center"
                  onPress={() => handleAcceptProposal(match.proposal!.proposalId!, false)}
                  disabled={actionLoading}
                >
                  <Text className="text-red-600 font-semibold text-xs">Rechazar propuesta</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-blue-600 py-2.5 rounded-lg items-center"
                  onPress={() => handleAcceptProposal(match.proposal!.proposalId!, true)}
                  disabled={actionLoading}
                >
                  <Text className="text-white font-bold text-xs">Aceptar fecha</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Programar Fecha (Capitanes) */}
        {isEitherCaptain && !match.proposal && match.status !== 'ENDED' && (
          <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <Text className="text-base font-bold text-gray-900 mb-3">Programación de Fecha</Text>
            <Text className="text-xs text-gray-500 mb-4">
              Como capitán, puedes enviar una propuesta de fecha/hora de juego que el capitán rival deberá aceptar.
            </Text>

            {!showProposalPanel ? (
              <TouchableOpacity
                className="w-full bg-blue-600 py-3 rounded-lg items-center"
                onPress={() => setShowProposalPanel(true)}
              >
                <Text className="text-white font-bold text-sm">Proponer Fecha/Hora</Text>
              </TouchableOpacity>
            ) : (
              <View className="space-y-3">
                <Text className="text-xs font-semibold text-gray-700">Selecciona un slot disponible:</Text>
                {availableSlots.length === 0 ? (
                  <Text className="text-xs text-gray-400 italic">No hay slots registrados en este Round aún.</Text>
                ) : (
                  <View className="space-y-2">
                    {availableSlots.map((slot) => (
                      <TouchableOpacity
                        key={slot.dateTimeSlotId || slot.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex-row justify-between items-center"
                        onPress={() => handleProposeSlot(slot.dateTimeSlotId || slot.id)}
                      >
                        <Text className="text-xs text-gray-700">
                          {new Date(slot.dateTime).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                        <Text className="text-xs text-gray-400">{slot.duration}m</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                <TouchableOpacity
                  className="w-full bg-gray-100 py-3 rounded-lg items-center border border-gray-200"
                  onPress={() => setShowProposalPanel(false)}
                >
                  <Text className="text-gray-600 font-bold text-sm">Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Árbitros del Partido */}
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <Text className="text-base font-bold text-gray-900 mb-4">Mesa Arbitral</Text>

          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons name="shirt-outline" size={20} color="#2563EB" />
                <Text className="text-sm font-semibold text-gray-700 ml-2">Árbitro principal</Text>
              </View>
              <Text className="text-sm text-gray-900 font-medium">
                {match.firstReferee
                  ? (match.firstReferee as any).fullName || `Colegiado #${match.firstReferee.participantId}`
                  : 'Asignación pendiente'}
              </Text>
            </View>

            {/* Asignación de árbitro (Admin/Coordinador) */}
            {!match.firstReferee && (
              <TouchableOpacity
                className="bg-blue-50 py-2.5 rounded-lg items-center border border-blue-200"
                onPress={handleAutoAssign}
                disabled={actionLoading}
              >
                <Text className="text-blue-600 font-bold text-xs">Asignación Automática de Árbitro</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Panel del Árbitro (Registrar resultados y firmas) */}
        {isFirstReferee && match.status !== 'ENDED' && (
          <View className="bg-red-50 p-5 rounded-2xl border border-red-200">
            <Text className="text-base font-bold text-red-800 mb-2 flex-row items-center">
              <Ionicons name="shield-checkmark-outline" size={18} color="#991B1B" /> Zona del Árbitro
            </Text>
            <Text className="text-xs text-red-700 mb-4">
              Como árbitro principal, puedes rellenar el acta oficial e ingresar el marcador del partido por periodos y las firmas requeridas.
            </Text>

            {!showResultForm ? (
              <TouchableOpacity
                className="w-full bg-red-600 py-3 rounded-lg items-center"
                onPress={() => setShowResultForm(true)}
              >
                <Text className="text-white font-bold text-sm">Registrar Acta y Resultado</Text>
              </TouchableOpacity>
            ) : (
              <View className="space-y-4">
                {/* Periodo 1 */}
                <View className="bg-white p-4 rounded-xl border border-red-100">
                  <Text className="text-xs font-bold text-gray-700 mb-2">Periodo 1</Text>
                  <View className="flex-row items-center gap-4">
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500 mb-1">Local</Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-200 rounded p-2 text-sm text-center"
                        value={localScore1}
                        onChangeText={setLocalScore1}
                        keyboardType="numeric"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500 mb-1">Visitante</Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-200 rounded p-2 text-sm text-center"
                        value={visitorScore1}
                        onChangeText={setVisitorScore1}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>

                {/* Periodo 2 */}
                <View className="bg-white p-4 rounded-xl border border-red-100">
                  <Text className="text-xs font-bold text-gray-700 mb-2">Periodo 2</Text>
                  <View className="flex-row items-center gap-4">
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500 mb-1">Local</Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-200 rounded p-2 text-sm text-center"
                        value={localScore2}
                        onChangeText={setLocalScore2}
                        keyboardType="numeric"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500 mb-1">Visitante</Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-200 rounded p-2 text-sm text-center"
                        value={visitorScore2}
                        onChangeText={setVisitorScore2}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>

                {/* Observaciones */}
                <View className="bg-white p-4 rounded-xl border border-red-100">
                  <Text className="text-xs font-bold text-gray-700 mb-1">Observaciones</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-800"
                    placeholder="Ninguna incidencia..."
                    value={observations}
                    onChangeText={setObservations}
                    multiline
                  />
                </View>

                {/* Firmas */}
                <View className="bg-white p-4 rounded-xl border border-red-100 space-y-3">
                  <Text className="text-xs font-bold text-gray-700 mb-1">Registro de firmas (URL / Base64)</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded p-2.5 text-xs"
                    placeholder="Firma del Árbitro"
                    value={refereeSignature}
                    onChangeText={setRefereeSignature}
                  />
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded p-2.5 text-xs"
                    placeholder="Firma Capitán Local"
                    value={localCapSignature}
                    onChangeText={setLocalCapSignature}
                  />
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded p-2.5 text-xs"
                    placeholder="Firma Capitán Visitante"
                    value={visitorCapSignature}
                    onChangeText={setVisitorCapSignature}
                  />
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 bg-white border border-gray-300 py-3 rounded-lg items-center"
                    onPress={() => setShowResultForm(false)}
                    disabled={actionLoading}
                  >
                    <Text className="text-gray-600 font-bold text-sm">Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-red-600 py-3 rounded-lg items-center"
                    onPress={handleSaveResult}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text className="text-white font-bold text-sm">Guardar Acta</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
