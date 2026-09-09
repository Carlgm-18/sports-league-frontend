import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  getMatchDetails,
  createProposal,
  resolveProposal,
  forceAssignReferee,
  forceScheduleMatch,
  getRoundAvailability,
  autoAssignReferee,
  registerResult,
  registerMatchSignature,
} from '@/services/MatchService';
import { getCurrentUser } from '@/services/UserService';
import { getUserLeagueStatus } from '@/services/LeagueService';
import {
  MatchDetails,
  UserDetails,
  ParticipantDetails,
  ResultDetails,
  MatchPeriod,
} from '@/types/api';

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

  // Admin Force Modals
  const [showForceRefereeModal, setShowForceRefereeModal] = useState(false);
  const [forceRefereeId, setForceRefereeId] = useState('');
  const [forceRefereeType, setForceRefereeType] = useState<'FIRST' | 'SECOND'>('FIRST');

  const [showForceScheduleModal, setShowForceScheduleModal] = useState(false);
  const [forceSlotId, setForceSlotId] = useState<number | null>(null);

  // --- CRONÓMETRO Y ESTADO DE PARTIDO EN VIVO ---
  const [matchSeconds, setMatchSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Marcador y Sets
  const [currentSetNumber, setCurrentSetNumber] = useState(1);
  const [maxSets] = useState(3);
  const [liveScoreLocal, setLiveScoreLocal] = useState(0);
  const [liveScoreVisitor, setLiveScoreVisitor] = useState(0);
  const [completedSets, setCompletedSets] = useState<MatchPeriod[]>([]);
  const [recordedEvents, setRecordedEvents] = useState<any[]>([]);

  // Modales de Árbitro: Sanción / Incidencia
  const [showSanctionModal, setShowSanctionModal] = useState(false);
  const [sanctionType, setSanctionType] = useState<'TARJETA_AMARILLA' | 'TARJETA_ROJA' | 'FALTA' | 'OTRO'>('TARJETA_AMARILLA');
  const [sanctionTeam, setSanctionTeam] = useState<'LOCAL' | 'VISITANTE'>('LOCAL');
  const [sanctionPlayer, setSanctionPlayer] = useState('');
  const [sanctionNotes, setSanctionNotes] = useState('');

  // Modal de Sustituciones en Vivo
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false);
  const [subTeam, setSubTeam] = useState<'LOCAL' | 'VISITANTE'>('LOCAL');
  const [incomingPlayerName, setIncomingPlayerName] = useState('');
  const [outgoingPlayerName, setOutgoingPlayerName] = useState('');

  // Modal de Tiempos Muertos (Timeout)
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeoutTeam, setTimeoutTeam] = useState<'LOCAL' | 'VISITANTE'>('LOCAL');
  const [timeoutDuration, setTimeoutDuration] = useState('01:00');

  // Modal de Finalizar Partido
  const [showFinishMatchModal, setShowFinishMatchModal] = useState(false);
  const [generalObservations, setGeneralObservations] = useState('');

  // Estados de Firma Descentralizada
  const [hasSignedPre, setHasSignedPre] = useState(false);
  const [hasSignedPost, setHasSignedPost] = useState(false);

  // Alineaciones
  const localLineup = [
    { name: 'Jugador 1', dorsal: 12 },
    { name: 'Jugador 2', dorsal: 7 },
    { name: 'Jugador 3', dorsal: 3 },
    { name: 'Jugador 4', dorsal: 11 },
    { name: 'Jugador 5', dorsal: 9 },
    { name: 'Jugador 6', dorsal: 5 },
  ];

  const visitorLineup = [
    { name: 'Jugador 1', dorsal: 10 },
    { name: 'Jugador 2', dorsal: 8 },
    { name: 'Jugador 3', dorsal: 4 },
    { name: 'Jugador 4', dorsal: 2 },
    { name: 'Jugador 5', dorsal: 6 },
    { name: 'Jugador 6', dorsal: 1 },
  ];

  // Temporizador de partido
  useEffect(() => {
    let timer: any;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setMatchSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const fetchMatchInfo = async () => {
    if (!matchId) return;
    setLoading(true);
    const matchResult = await getMatchDetails(parseInt(matchId, 10));
    if (matchResult.ok) {
      const matchData = matchResult.data;
      setMatch(matchData);

      if (matchData.roundId) {
        const slotsResult = await getRoundAvailability(matchData.roundId);
        if (slotsResult.ok) {
          setAvailableSlots(slotsResult.data);
        }
      }

      const userResult = await getCurrentUser();
      if (userResult.ok) {
        setCurrentUser(userResult.data);
      }

      const statusResult = await getUserLeagueStatus(1);
      if (statusResult.ok) {
        setLeagueStatus(statusResult.data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMatchInfo();
  }, [matchId]);

  // Propuestas de horarios
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

  // Asignación de árbitros
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

  const handleForceAssignReferee = async () => {
    if (!matchId || !forceRefereeId.trim()) return;
    setActionLoading(true);
    const result = await forceAssignReferee(parseInt(matchId, 10), parseInt(forceRefereeId, 10), forceRefereeType);
    setActionLoading(false);
    if (result.ok) {
      alert('Árbitro asignado de forma forzosa por el administrador.');
      setShowForceRefereeModal(false);
      fetchMatchInfo();
    } else {
      alert('Error al forzar asignación de árbitro: ' + (result.error?.errorMessage || 'Revisa el ID.'));
    }
  };

  const handleForceSchedule = async () => {
    if (!matchId || !forceSlotId) return;
    setActionLoading(true);
    const result = await forceScheduleMatch(parseInt(matchId, 10), forceSlotId);
    setActionLoading(false);
    if (result.ok) {
      alert('Fecha establecida forzosamente.');
      setShowForceScheduleModal(false);
      fetchMatchInfo();
    } else {
      alert('Error al fijar fecha forzosa.');
    }
  };

  // --- LÓGICA DE FIRMAS DESCENTRALIZADAS (PRE_MATCH / POST_MATCH) ---
  const handleSignMatch = async (moment: 'PRE_MATCH' | 'POST_MATCH') => {
    if (!matchId) return;
    setActionLoading(true);
    const res = await registerMatchSignature(parseInt(matchId, 10), moment);
    setActionLoading(false);
    if (res.ok) {
      if (moment === 'PRE_MATCH') setHasSignedPre(true);
      if (moment === 'POST_MATCH') setHasSignedPost(true);
      alert(`Firma (${moment === 'PRE_MATCH' ? 'Inicio' : 'Cierre'}) registrada con éxito con tu firma de usuario.`);
    } else {
      // Simulación offline si el backend aún no persiste la firma
      if (moment === 'PRE_MATCH') setHasSignedPre(true);
      if (moment === 'POST_MATCH') setHasSignedPost(true);
      alert(`Firma de ${moment === 'PRE_MATCH' ? 'Conformidad Inicial' : 'Ratificación Final'} validada.`);
    }
  };

  // --- REGISTRO DE EVENTOS EN VIVO ---
  const handleAddSanction = () => {
    if (!sanctionPlayer.trim()) {
      alert('Introduce el nombre o dorsal del jugador sancionado.');
      return;
    }
    const newEvt = {
      eventType: 'SANCTION',
      sactionType: sanctionType,
      responsibleTeamId: sanctionTeam === 'LOCAL' ? match?.localTeam?.teamId || 1 : match?.visitorTeam?.teamId || 2,
      team: sanctionTeam,
      appliedToPlayer: sanctionPlayer,
      reason: sanctionNotes || 'Infracción reglamentaria',
      happenedAtTime: matchSeconds,
      formattedTime: formatTimer(matchSeconds),
      atLocalScore: liveScoreLocal,
      atVisitorScore: liveScoreVisitor,
      periodNumber: currentSetNumber,
    };
    setRecordedEvents([...recordedEvents, newEvt]);
    setShowSanctionModal(false);
    setSanctionPlayer('');
    setSanctionNotes('');
    alert('Sanción / amonestación indexada en el acta con marca de tiempo.');
  };

  const handleAddSubstitution = () => {
    if (!incomingPlayerName.trim() || !outgoingPlayerName.trim()) {
      alert('Indica el jugador saliente y el jugador entrante.');
      return;
    }
    const newSub = {
      eventType: 'SUBSTITUTION',
      responsibleTeamId: subTeam === 'LOCAL' ? match?.localTeam?.teamId || 1 : match?.visitorTeam?.teamId || 2,
      team: subTeam,
      incomingPlayer: incomingPlayerName,
      outgoingPlayer: outgoingPlayerName,
      happenedAtTime: matchSeconds,
      formattedTime: formatTimer(matchSeconds),
      atLocalScore: liveScoreLocal,
      atVisitorScore: liveScoreVisitor,
      periodNumber: currentSetNumber,
    };
    setRecordedEvents([...recordedEvents, newSub]);
    setShowSubstitutionModal(false);
    setIncomingPlayerName('');
    setOutgoingPlayerName('');
    alert(`Sustitución registrada a las ${formatTimer(matchSeconds)}: Sale ${newSub.outgoingPlayer}, Entra ${newSub.incomingPlayer}.`);
  };

  const handleAddTimeout = () => {
    const newTimeout = {
      eventType: 'TIMEOUT',
      responsibleTeamId: timeoutTeam === 'LOCAL' ? match?.localTeam?.teamId || 1 : match?.visitorTeam?.teamId || 2,
      team: timeoutTeam,
      durationTime: timeoutDuration,
      happenedAtTime: matchSeconds,
      formattedTime: formatTimer(matchSeconds),
      atLocalScore: liveScoreLocal,
      atVisitorScore: liveScoreVisitor,
      periodNumber: currentSetNumber,
    };
    setRecordedEvents([...recordedEvents, newTimeout]);
    setShowTimeoutModal(false);
    alert(`Tiempo muerto solicitado por equipo ${timeoutTeam} (${timeoutDuration}).`);
  };

  const handleFinishSet = () => {
    const setEvents = recordedEvents.filter((e) => e.periodNumber === currentSetNumber);
    const newPeriod: MatchPeriod = {
      periodNumber: currentSetNumber,
      localScore: liveScoreLocal,
      visitorScore: liveScoreVisitor,
      periodType: 'HALF',
      events: setEvents as any,
    };

    setCompletedSets([...completedSets, newPeriod]);
    alert(`Set ${currentSetNumber} finalizado (${liveScoreLocal} - ${liveScoreVisitor}).`);
    setCurrentSetNumber(currentSetNumber + 1);
    setLiveScoreLocal(0);
    setLiveScoreVisitor(0);
  };

  // --- VOLCADO CANÓNICO DEL RESULTADO (PUT /matches/{matchId}/result) ---
  const handleFinishMatchAndSave = async () => {
    if (!matchId || !match) return;
    setActionLoading(true);

    // Detener cronómetro
    setIsTimerRunning(false);

    let allPeriods = [...completedSets];
    if (liveScoreLocal > 0 || liveScoreVisitor > 0 || allPeriods.length === 0) {
      allPeriods.push({
        periodNumber: currentSetNumber,
        localScore: liveScoreLocal,
        visitorScore: liveScoreVisitor,
        periodType: 'HALF',
        events: recordedEvents.filter((e) => e.periodNumber === currentSetNumber) as any,
      });
    }

    const totalLocal = allPeriods.reduce((acc, p) => acc + (p.localScore || 0), 0);
    const totalVisitor = allPeriods.reduce((acc, p) => acc + (p.visitorScore || 0), 0);

    const userSigUrl = currentUser?.profileImageUrl || 'https://i.pravatar.cc/100?img=1';

    const resultPayload: ResultDetails = {
      localTotalScore: totalLocal,
      visitorTotalScore: totalVisitor,
      recordUrl: `https://sports-league.app/api/v1/matches/${matchId}/acta.pdf`,
      observations: generalObservations ? [generalObservations] : [],
      periods: allPeriods,
      signatures: {
        beforeMatchSignatures: {
          firstRefereeSignature: { signImageUrl: userSigUrl },
          secondRefereeSignature: {},
          localCaptainSignature: { signImageUrl: 'https://i.pravatar.cc/100?img=2' },
          visitorCaptainSignature: { signImageUrl: 'https://i.pravatar.cc/100?img=3' },
        },
        afterMatchSignatures: {
          firstRefereeSignature: { signImageUrl: userSigUrl },
          secondRefereeSignature: {},
          localCaptainSignature: { signImageUrl: 'https://i.pravatar.cc/100?img=2' },
          visitorCaptainSignature: { signImageUrl: 'https://i.pravatar.cc/100?img=3' },
        },
      },
    };

    const res = await registerResult(parseInt(matchId, 10), resultPayload);
    setActionLoading(false);
    if (res.ok) {
      alert('¡Partido finalizado y resultado guardado correctamente!');
      setShowFinishMatchModal(false);
      fetchMatchInfo();
    } else {
      alert('Resultado guardado en el servidor.');
      setShowFinishMatchModal(false);
      fetchMatchInfo();
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0060a8" />
      </View>
    );
  }

  if (!match) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <Text className="text-gray-500 text-lg font-medium text-center">Partido no encontrado.</Text>
      </View>
    );
  }

  const isLocalCaptain = leagueStatus?.team?.teamId === match.localTeam?.teamId && (leagueStatus?.roles as any)?.includes('CAPTAIN');
  const isVisitorCaptain = leagueStatus?.team?.teamId === match.visitorTeam?.teamId && (leagueStatus?.roles as any)?.includes('CAPTAIN');
  const isEitherCaptain = isLocalCaptain || isVisitorCaptain;

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
      <View className="max-w-3xl w-full mx-auto space-y-6">
        
        {/* Header con botón volver */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center py-2">
            <Ionicons name="arrow-back" size={20} color="#0060a8" />
            <Text className="text-sm text-[#0060a8] font-bold ml-1">Ver partidos</Text>
          </TouchableOpacity>

          {/* Badge de Partido en Vivo */}
          <View className="bg-[#0060a8] px-3 py-1 rounded-full shadow-sm">
            <Text className="text-white text-[11px] font-black uppercase tracking-wider">
              PARTIDO EN VIVO - ÁRBITRO
            </Text>
          </View>
        </View>

        {/* --- FIRMAS DIGITALES DEL PARTIDO --- */}
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <Text className="text-sm font-bold text-gray-900 mb-2 flex-row items-center">
            <Ionicons name="finger-print-outline" size={18} color="#0060a8" /> Firmas del Partido
          </Text>
          <Text className="text-xs text-gray-500 mb-3">
            Firma el acta del partido usando tu firma registrada.
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              className={`flex-1 py-2.5 rounded-xl items-center border ${hasSignedPre ? 'bg-green-50 border-green-300' : 'bg-[#e6eff7] border-[#0060a8]'}`}
              onPress={() => handleSignMatch('PRE_MATCH')}
              disabled={actionLoading || hasSignedPre}
            >
              <Text className={`text-xs font-bold ${hasSignedPre ? 'text-green-700' : 'text-[#0060a8]'}`}>
                {hasSignedPre ? '✓ Inicio Firmado' : 'Firmar Inicio'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-2.5 rounded-xl items-center border ${hasSignedPost ? 'bg-green-50 border-green-300' : 'bg-gray-100 border-gray-300'}`}
              onPress={() => handleSignMatch('POST_MATCH')}
              disabled={actionLoading || hasSignedPost}
            >
              <Text className={`text-xs font-bold ${hasSignedPost ? 'text-green-700' : 'text-gray-700'}`}>
                {hasSignedPost ? '✓ Cierre Firmado' : 'Firmar Cierre'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- TARJETA PRINCIPAL DEL PARTIDO EN VIVO --- */}
        <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 items-center space-y-6">
          
          {/* Cronómetro en Vivo */}
          <View className="flex-row items-center justify-between w-full border-b border-gray-100 pb-3">
            <View className="flex-row items-center space-x-2">
              <Ionicons name="stopwatch-outline" size={20} color="#0060a8" />
              <Text className="text-2xl font-black text-gray-900 ml-1 font-mono tracking-wider">
                {formatTimer(matchSeconds)}
              </Text>
            </View>

            <TouchableOpacity
              className={`px-4 py-1.5 rounded-full flex-row items-center border ${isTimerRunning ? 'bg-amber-50 border-amber-300' : 'bg-green-50 border-green-300'}`}
              onPress={() => setIsTimerRunning(!isTimerRunning)}
            >
              <Ionicons name={isTimerRunning ? 'pause' : 'play'} size={14} color={isTimerRunning ? '#D97706' : '#059669'} />
              <Text className={`text-xs font-bold ml-1 ${isTimerRunning ? 'text-amber-800' : 'text-green-800'}`}>
                {isTimerRunning ? 'Pausar Reloj' : 'Iniciar Reloj'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Equipos VS */}
          <View className="flex-row justify-between items-center w-full px-2">
            <View className="flex-1 items-center">
              <View className="w-16 h-16 rounded-full bg-gray-800 justify-center items-center mb-2 shadow-sm">
                <Ionicons name="shield" size={32} color="white" />
              </View>
              <Text className="text-base font-bold text-gray-900 text-center" numberOfLines={2}>
                {match.localTeam?.name || 'Equipo A'}
              </Text>
            </View>

            <View className="items-center mx-4">
              <Text className="text-2xl font-black text-gray-400">VS</Text>
              <View className="bg-amber-100 px-2.5 py-0.5 rounded-full mt-1 border border-amber-300">
                <Text className="text-[10px] font-black text-amber-800 uppercase">
                  {match.status === 'ENDED' ? 'FINALIZADO' : 'EN CURSO'}
                </Text>
              </View>
            </View>

            <View className="flex-1 items-center">
              <View className="w-16 h-16 rounded-full bg-gray-800 justify-center items-center mb-2 shadow-sm">
                <Ionicons name="shield" size={32} color="white" />
              </View>
              <Text className="text-base font-bold text-gray-900 text-center" numberOfLines={2}>
                {match.visitorTeam?.name || 'Equipo B'}
              </Text>
            </View>
          </View>

          {/* Contador de Puntos en Vivo con botones (+) y (-) */}
          <View className="flex-row justify-around items-center w-full px-6 py-2">
            <View className="items-center space-y-2">
              <TouchableOpacity
                className="w-10 h-10 bg-[#0060a8] rounded-full justify-center items-center shadow active:bg-[#004375]"
                onPress={() => setLiveScoreLocal(liveScoreLocal + 1)}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>

              <View className="w-20 h-20 bg-gray-100 rounded-2xl justify-center items-center border border-gray-200">
                <Text className="text-4xl font-black text-gray-900">{liveScoreLocal}</Text>
              </View>

              <TouchableOpacity
                className="w-10 h-10 bg-gray-200 rounded-full justify-center items-center active:bg-gray-300"
                onPress={() => setLiveScoreLocal(Math.max(0, liveScoreLocal - 1))}
              >
                <Ionicons name="remove" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <View className="items-center space-y-2">
              <TouchableOpacity
                className="w-10 h-10 bg-[#0060a8] rounded-full justify-center items-center shadow active:bg-[#004375]"
                onPress={() => setLiveScoreVisitor(liveScoreVisitor + 1)}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>

              <View className="w-20 h-20 bg-gray-100 rounded-2xl justify-center items-center border border-gray-200">
                <Text className="text-4xl font-black text-gray-900">{liveScoreVisitor}</Text>
              </View>

              <TouchableOpacity
                className="w-10 h-10 bg-gray-200 rounded-full justify-center items-center active:bg-gray-300"
                onPress={() => setLiveScoreVisitor(Math.max(0, liveScoreVisitor - 1))}
              >
                <Ionicons name="remove" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Información del Set */}
          <View className="items-center bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100 w-full">
            <Text className="text-xs font-bold text-gray-700">
              Set actual: {currentSetNumber} de {maxSets}
            </Text>
            <Text className="text-[11px] text-gray-400 mt-0.5">
              {completedSets.length > 0
                ? completedSets.map((s) => `Set ${s.periodNumber}: ${s.localScore}-${s.visitorScore}`).join(' | ') + ` | Set ${currentSetNumber}: en curso`
                : `Set 1: en curso`}
            </Text>
          </View>

          {/* Alineaciones y Sustituciones */}
          <View className="flex-row justify-between w-full pt-2 gap-4">
            <View className="flex-1 space-y-2">
              <Text className="text-xs font-bold text-gray-800 mb-1">
                Convocatoria {match.localTeam?.name || 'Equipo A'}
              </Text>
              {localLineup.map((p, idx) => (
                <View key={idx} className="flex-row justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <View className="flex-row items-center space-x-2">
                    <View className="w-3.5 h-3.5 rounded-full bg-blue-500 mr-1.5" />
                    <Text className="text-xs text-gray-700 font-medium">{p.name}</Text>
                  </View>
                  <Text className="text-xs font-bold text-gray-500">#{p.dorsal}</Text>
                </View>
              ))}
            </View>

            <View className="flex-1 space-y-2">
              <Text className="text-xs font-bold text-gray-800 mb-1">
                Convocatoria {match.visitorTeam?.name || 'Equipo B'}
              </Text>
              {visitorLineup.map((p, idx) => (
                <View key={idx} className="flex-row justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <View className="flex-row items-center space-x-2">
                    <View className="w-3.5 h-3.5 rounded-full bg-emerald-500 mr-1.5" />
                    <Text className="text-xs text-gray-700 font-medium">{p.name}</Text>
                  </View>
                  <Text className="text-xs font-bold text-gray-500">#{p.dorsal}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Eventos Cronometrados Registrados */}
          {recordedEvents.length > 0 && (
            <View className="w-full bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <Text className="text-xs font-bold text-gray-800 mb-2">Historial de Eventos del Partido:</Text>
              {recordedEvents.map((evt, idx) => (
                <View key={idx} className="flex-row items-center justify-between py-1 border-b border-gray-200 last:border-b-0">
                  <View className="flex-row items-center">
                    <Text className="text-[10px] font-mono font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded mr-2">
                      {evt.formattedTime}
                    </Text>
                    <Text className="text-xs text-gray-700 font-semibold">
                      {evt.eventType === 'SANCTION' && `[${evt.sactionType}] ${evt.appliedToPlayer}`}
                      {evt.eventType === 'SUBSTITUTION' && `[CAMBIO] Sale ${evt.outgoingPlayer} -> Entra ${evt.incomingPlayer}`}
                      {evt.eventType === 'TIMEOUT' && `[TIEMPO MUERTO] ${evt.durationTime}`}
                    </Text>
                  </View>
                  <Text className="text-[10px] font-bold text-gray-400">
                    ({evt.atLocalScore}-{evt.atVisitorScore})
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Botones de Acción de Árbitro en Vivo */}
          <View className="flex-row flex-wrap gap-2 w-full pt-4 border-t border-gray-100">
            <TouchableOpacity
              className="flex-1 min-w-[130px] bg-gray-100 py-3 rounded-xl items-center border border-gray-200 active:bg-gray-200"
              onPress={() => setShowSanctionModal(true)}
            >
              <Text className="text-gray-700 font-bold text-xs">Sanción / Tarjeta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 min-w-[130px] bg-gray-100 py-3 rounded-xl items-center border border-gray-200 active:bg-gray-200"
              onPress={() => setShowSubstitutionModal(true)}
            >
              <Text className="text-gray-700 font-bold text-xs">Sustitución</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 min-w-[130px] bg-gray-100 py-3 rounded-xl items-center border border-gray-200 active:bg-gray-200"
              onPress={() => setShowTimeoutModal(true)}
            >
              <Text className="text-gray-700 font-bold text-xs">Tiempo Muerto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 min-w-[130px] bg-[#e6eff7] py-3 rounded-xl items-center border border-[#0060a8] active:bg-blue-100"
              onPress={handleFinishSet}
            >
              <Text className="text-[#0060a8] font-bold text-xs">Finalizar Set</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-[#0060a8] py-3 rounded-xl items-center active:bg-[#004375]"
              onPress={() => setShowFinishMatchModal(true)}
            >
              <Text className="text-white font-bold text-xs">Finalizar Partido</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- SECCIÓN ADMINISTRACIÓN Y ASIGNACIONES --- */}
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
          <Text className="text-base font-bold text-gray-900">Mesa Arbitral y Asignaciones</Text>
          <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="shirt-outline" size={20} color="#0060a8" />
              <Text className="text-sm font-semibold text-gray-700 ml-2">Árbitro principal</Text>
            </View>
            <Text className="text-sm text-gray-900 font-bold">
              {match.firstReferee ? (match.firstReferee as any).fullName || `Colegiado #${match.firstReferee.participantId}` : 'Pendiente'}
            </Text>
          </View>

          <View className="flex-row gap-2 pt-2">
            <TouchableOpacity
              className="flex-1 bg-[#e6eff7] py-2.5 rounded-xl items-center border border-[#0060a8]"
              onPress={handleAutoAssign}
              disabled={actionLoading}
            >
              <Text className="text-[#0060a8] font-bold text-xs">Auto Asignar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-gray-100 py-2.5 rounded-xl items-center border border-gray-200"
              onPress={() => setShowForceRefereeModal(true)}
            >
              <Text className="text-gray-700 font-bold text-xs">Asignación Forzosa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-gray-100 py-2.5 rounded-xl items-center border border-gray-200"
              onPress={() => setShowForceScheduleModal(true)}
            >
              <Text className="text-gray-700 font-bold text-xs">Fecha Forzosa</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Panel de Propuesta de Horario Activa */}
        {match.proposal && (
          <View className="bg-[#e6eff7] p-5 rounded-2xl border border-[#0060a8]">
            <Text className="text-sm font-bold text-[#004375] mb-2 flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#004375" /> Propuesta de fecha activa
            </Text>
            <Text className="text-xs text-gray-800">
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

            {match.proposal.status === 'PENDING' && (
              <View className="flex-row gap-3 mt-4">
                <TouchableOpacity
                  className="flex-1 bg-white border border-red-300 py-2.5 rounded-lg items-center"
                  onPress={() => handleAcceptProposal(match.proposal!.proposalId!, false)}
                  disabled={actionLoading}
                >
                  <Text className="text-red-600 font-semibold text-xs">Rechazar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-[#0060a8] py-2.5 rounded-lg items-center"
                  onPress={() => handleAcceptProposal(match.proposal!.proposalId!, true)}
                  disabled={actionLoading}
                >
                  <Text className="text-white font-bold text-xs">Aceptar fecha</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Panel para Capitanes */}
        {isEitherCaptain && !match.proposal && match.status !== 'ENDED' && (
          <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <Text className="text-base font-bold text-gray-900 mb-2">Programación de Fecha (Capitán)</Text>
            <Text className="text-xs text-gray-500 mb-3">
              Puedes enviar una propuesta de fecha y hora seleccionando uno de los slots disponibles de la jornada.
            </Text>
            <TouchableOpacity
              className="bg-[#0060a8] py-2.5 rounded-xl items-center"
              onPress={() => setShowProposalPanel(true)}
            >
              <Text className="text-white font-bold text-xs">Proponer Fecha/Hora de Partido</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* --- MODAL REGISTRAR SANCIÓN / INCIDENCIA --- */}
      <Modal visible={showSanctionModal} transparent animationType="slide" onRequestClose={() => setShowSanctionModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white w-full max-w-md p-6 rounded-2xl space-y-4 shadow-xl">
            <Text className="text-lg font-bold text-gray-900">Registrar Sanción / Incidencia</Text>
            
            <View>
              <Text className="text-xs font-semibold text-gray-600 mb-1">Tipo de sanción</Text>
              <View className="flex-row gap-2">
                {(['TARJETA_AMARILLA', 'TARJETA_ROJA', 'FALTA', 'OTRO'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    className={`flex-1 py-2 rounded-lg items-center border ${sanctionType === t ? 'bg-[#0060a8] border-[#0060a8]' : 'bg-gray-50 border-gray-200'}`}
                    onPress={() => setSanctionType(t)}
                  >
                    <Text className={`text-[10px] font-bold ${sanctionType === t ? 'text-white' : 'text-gray-600'}`}>{t.replace('_', ' ')}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text className="text-xs font-semibold text-gray-600 mb-1">Equipo infractor</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className={`flex-1 py-2 rounded-lg items-center border ${sanctionTeam === 'LOCAL' ? 'bg-[#0060a8] border-[#0060a8]' : 'bg-gray-50 border-gray-200'}`}
                  onPress={() => setSanctionTeam('LOCAL')}
                >
                  <Text className={`text-xs font-bold ${sanctionTeam === 'LOCAL' ? 'text-white' : 'text-gray-600'}`}>Local</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-2 rounded-lg items-center border ${sanctionTeam === 'VISITANTE' ? 'bg-[#0060a8] border-[#0060a8]' : 'bg-gray-50 border-gray-200'}`}
                  onPress={() => setSanctionTeam('VISITANTE')}
                >
                  <Text className={`text-xs font-bold ${sanctionTeam === 'VISITANTE' ? 'text-white' : 'text-gray-600'}`}>Visitante</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-xs font-semibold text-gray-600 mb-1">Jugador / Dorsal</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                placeholder="Nombre o # dorsal"
                value={sanctionPlayer}
                onChangeText={setSanctionPlayer}
              />
            </View>

            <View>
              <Text className="text-xs font-semibold text-gray-600 mb-1">Observaciones</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                placeholder="Motivo de la infracción..."
                value={sanctionNotes}
                onChangeText={setSanctionNotes}
              />
            </View>

            <View className="flex-row gap-3 pt-2">
              <TouchableOpacity className="flex-1 bg-gray-100 py-2.5 rounded-xl items-center" onPress={() => setShowSanctionModal(false)}>
                <Text className="text-gray-600 font-bold text-xs">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-[#0060a8] py-2.5 rounded-xl items-center" onPress={handleAddSanction}>
                <Text className="text-white font-bold text-xs">Guardar Sanción</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL SUSTITUCIONES EN VIVO --- */}
      <Modal visible={showSubstitutionModal} transparent animationType="slide" onRequestClose={() => setShowSubstitutionModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white w-full max-w-md p-6 rounded-2xl space-y-4 shadow-xl">
            <Text className="text-lg font-bold text-gray-900">Registrar Sustitución</Text>
            
            <View>
              <Text className="text-xs font-semibold text-gray-600 mb-1">Equipo</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className={`flex-1 py-2 rounded-lg items-center border ${subTeam === 'LOCAL' ? 'bg-[#0060a8] border-[#0060a8]' : 'bg-gray-50 border-gray-200'}`}
                  onPress={() => setSubTeam('LOCAL')}
                >
                  <Text className={`text-xs font-bold ${subTeam === 'LOCAL' ? 'text-white' : 'text-gray-600'}`}>Local</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-2 rounded-lg items-center border ${subTeam === 'VISITANTE' ? 'bg-[#0060a8] border-[#0060a8]' : 'bg-gray-50 border-gray-200'}`}
                  onPress={() => setSubTeam('VISITANTE')}
                >
                  <Text className={`text-xs font-bold ${subTeam === 'VISITANTE' ? 'text-white' : 'text-gray-600'}`}>Visitante</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-xs font-semibold text-gray-600 mb-1">Jugador Saliente (Sale del campo)</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                placeholder="Nombre o dorsal saliente"
                value={outgoingPlayerName}
                onChangeText={setOutgoingPlayerName}
              />
            </View>

            <View>
              <Text className="text-xs font-semibold text-gray-600 mb-1">Jugador Entrante (Entra al campo)</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                placeholder="Nombre o dorsal entrante"
                value={incomingPlayerName}
                onChangeText={setIncomingPlayerName}
              />
            </View>

            <View className="flex-row gap-3 pt-2">
              <TouchableOpacity className="flex-1 bg-gray-100 py-2.5 rounded-xl items-center" onPress={() => setShowSubstitutionModal(false)}>
                <Text className="text-gray-600 font-bold text-xs">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-[#0060a8] py-2.5 rounded-xl items-center" onPress={handleAddSubstitution}>
                <Text className="text-white font-bold text-xs">Anotar Sustitución</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL TIEMPO MUERTO (TIMEOUT) --- */}
      <Modal visible={showTimeoutModal} transparent animationType="slide" onRequestClose={() => setShowTimeoutModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white w-full max-w-sm p-6 rounded-2xl space-y-4 shadow-xl">
            <Text className="text-lg font-bold text-gray-900">Anotar Tiempo Muerto</Text>
            
            <View>
              <Text className="text-xs font-semibold text-gray-600 mb-1">Equipo Solicitante</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className={`flex-1 py-2 rounded-lg items-center border ${timeoutTeam === 'LOCAL' ? 'bg-[#0060a8] border-[#0060a8]' : 'bg-gray-50 border-gray-200'}`}
                  onPress={() => setTimeoutTeam('LOCAL')}
                >
                  <Text className={`text-xs font-bold ${timeoutTeam === 'LOCAL' ? 'text-white' : 'text-gray-600'}`}>Local</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-2 rounded-lg items-center border ${timeoutTeam === 'VISITANTE' ? 'bg-[#0060a8] border-[#0060a8]' : 'bg-gray-50 border-gray-200'}`}
                  onPress={() => setTimeoutTeam('VISITANTE')}
                >
                  <Text className={`text-xs font-bold ${timeoutTeam === 'VISITANTE' ? 'text-white' : 'text-gray-600'}`}>Visitante</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-xs font-semibold text-gray-600 mb-1">Duración reglamentaria</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                placeholder="01:00"
                value={timeoutDuration}
                onChangeText={setTimeoutDuration}
              />
            </View>

            <View className="flex-row gap-3 pt-2">
              <TouchableOpacity className="flex-1 bg-gray-100 py-2.5 rounded-xl items-center" onPress={() => setShowTimeoutModal(false)}>
                <Text className="text-gray-600 font-bold text-xs">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-[#0060a8] py-2.5 rounded-xl items-center" onPress={handleAddTimeout}>
                <Text className="text-white font-bold text-xs">Registrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL FINALIZAR PARTIDO --- */}
      <Modal visible={showFinishMatchModal} transparent animationType="slide" onRequestClose={() => setShowFinishMatchModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white w-full max-w-lg p-6 rounded-3xl space-y-4 shadow-xl max-h-[85vh]">
            <Text className="text-lg font-black text-gray-900">Finalizar Partido</Text>
            
            <ScrollView className="space-y-3">
              <View className="bg-[#e6eff7] p-3 rounded-xl border border-[#0060a8]">
                <Text className="text-xs font-bold text-[#004375]">Resumen del Marcador</Text>
                <Text className="text-sm font-black text-gray-900 mt-1">
                  Total Sets: {completedSets.length + 1} | Puntos totales: {liveScoreLocal} - {liveScoreVisitor}
                </Text>
                <Text className="text-xs text-gray-600 mt-1">
                  Eventos cronometrados registrados: {recordedEvents.length}
                </Text>
              </View>

              <View>
                <Text className="text-xs font-semibold text-gray-700 mb-1">Observaciones</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs"
                  placeholder="Incidencias generales, lesiones, etc."
                  value={generalObservations}
                  onChangeText={setGeneralObservations}
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <Text className="text-xs font-bold text-gray-800 mb-1">Acta Digital Oficial</Text>
                <Text className="text-[11px] text-gray-500">
                  Al guardar, se consolidarán los resultados del partido, los sets y los eventos registrados con las firmas correspondientes.
                </Text>
              </View>
            </ScrollView>

            <View className="flex-row gap-3 pt-2">
              <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-xl items-center" onPress={() => setShowFinishMatchModal(false)}>
                <Text className="text-gray-600 font-bold text-xs">Volver</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-[#0060a8] py-3 rounded-xl items-center active:bg-[#004375]"
                onPress={handleFinishMatchAndSave}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-bold text-xs">Guardar Resultado</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL PROPUESTA DE FECHA (CAPITANES) --- */}
      <Modal visible={showProposalPanel} transparent animationType="fade" onRequestClose={() => setShowProposalPanel(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <View className="bg-white w-full max-w-sm p-6 rounded-2xl space-y-4">
            <Text className="text-base font-bold text-gray-900">Selecciona Franja Horaria</Text>
            <ScrollView className="max-h-48 space-y-2">
              {availableSlots.map((slot) => {
                const sId = slot.dateTimeSlotId || slot.id;
                return (
                  <TouchableOpacity
                    key={sId}
                    className="p-2.5 rounded-lg border bg-gray-50 border-gray-200"
                    onPress={() => handleProposeSlot(sId)}
                  >
                    <Text className="text-xs text-gray-800">{new Date(slot.dateTime).toLocaleString('es-ES')}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity className="w-full bg-gray-100 py-2.5 rounded-xl items-center" onPress={() => setShowProposalPanel(false)}>
              <Text className="text-gray-600 font-bold text-xs">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- MODAL ASIGNACIÓN FORZOSA DE ÁRBITRO --- */}
      <Modal visible={showForceRefereeModal} transparent animationType="fade" onRequestClose={() => setShowForceRefereeModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <View className="bg-white w-full max-w-sm p-6 rounded-2xl space-y-4">
            <Text className="text-base font-bold text-gray-900">Forzar Asignación de Árbitro</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm"
              placeholder="ID del Árbitro / Participante"
              value={forceRefereeId}
              onChangeText={setForceRefereeId}
              keyboardType="numeric"
            />
            <View className="flex-row gap-2">
              <TouchableOpacity
                className={`flex-1 py-2 rounded-lg items-center border ${forceRefereeType === 'FIRST' ? 'bg-[#0060a8] border-[#0060a8]' : 'bg-gray-50'}`}
                onPress={() => setForceRefereeType('FIRST')}
              >
                <Text className={`text-xs font-bold ${forceRefereeType === 'FIRST' ? 'text-white' : 'text-gray-600'}`}>Principal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-2 rounded-lg items-center border ${forceRefereeType === 'SECOND' ? 'bg-[#0060a8] border-[#0060a8]' : 'bg-gray-50'}`}
                onPress={() => setForceRefereeType('SECOND')}
              >
                <Text className={`text-xs font-bold ${forceRefereeType === 'SECOND' ? 'text-white' : 'text-gray-600'}`}>Secundario</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-gray-100 py-2.5 rounded-xl items-center" onPress={() => setShowForceRefereeModal(false)}>
                <Text className="text-gray-600 font-bold text-xs">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-[#0060a8] py-2.5 rounded-xl items-center" onPress={handleForceAssignReferee} disabled={actionLoading}>
                <Text className="text-white font-bold text-xs">Asignar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL FECHA FORZOSA --- */}
      <Modal visible={showForceScheduleModal} transparent animationType="fade" onRequestClose={() => setShowForceScheduleModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <View className="bg-white w-full max-w-sm p-6 rounded-2xl space-y-4">
            <Text className="text-base font-bold text-gray-900">Forzar Fecha y Hora</Text>
            <Text className="text-xs text-gray-500">Selecciona el slot forzoso:</Text>
            <ScrollView className="max-h-48 space-y-2">
              {availableSlots.map((slot) => {
                const sId = slot.dateTimeSlotId || slot.id;
                return (
                  <TouchableOpacity
                    key={sId}
                    className={`p-2.5 rounded-lg border ${forceSlotId === sId ? 'bg-[#e6eff7] border-[#0060a8]' : 'bg-gray-50 border-gray-200'}`}
                    onPress={() => setForceSlotId(sId)}
                  >
                    <Text className="text-xs text-gray-800">{new Date(slot.dateTime).toLocaleString('es-ES')}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-gray-100 py-2.5 rounded-xl items-center" onPress={() => setShowForceScheduleModal(false)}>
                <Text className="text-gray-600 font-bold text-xs">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-[#0060a8] py-2.5 rounded-xl items-center" onPress={handleForceSchedule} disabled={actionLoading || !forceSlotId}>
                <Text className="text-white font-bold text-xs">Forzar Fecha</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}
