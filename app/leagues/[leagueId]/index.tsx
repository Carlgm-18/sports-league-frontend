import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  getLeague,
  getUserLeagueStatus,
  joinLeague,
  getUserAvailability,
  updateUserAvailability,
  getLeagueMatches,
  updateLeague,
  updateLeagueConfiguration,
  deleteLeague,
  updatePunctuationSystem,
} from '@/services/LeagueService';
import { getRoundAvailability } from '@/services/MatchService';
import { LeagueDetails, ParticipantDetails } from '@/types/api';

export default function LeagueDetailsScreen() {
  const { leagueId } = useLocalSearchParams<{ leagueId: string }>();
  const router = useRouter();
  const parsedLeagueId = parseInt(leagueId || '0', 10);

  const [loading, setLoading] = useState(true);
  const [league, setLeague] = useState<LeagueDetails | null>(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [participant, setParticipant] = useState<ParticipantDetails | null>(null);
  
  // Disponibilidad de slots
  const [allSlots, setAllSlots] = useState<any[]>([]);
  const [selectedSlotIds, setSelectedSlotIds] = useState<Set<number>>(new Set());
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Admin Modals & State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminTab, setAdminTab] = useState<'info' | 'config' | 'punctuation'>('info');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editMaxTeams, setEditMaxTeams] = useState('16');
  const [winPoints, setWinPoints] = useState('3');
  const [drawPoints, setDrawPoints] = useState('1');
  const [lossPoints, setLossPoints] = useState('0');
  const [savingAdmin, setSavingAdmin] = useState(false);

  const fetchLeagueInfo = async () => {
    if (!parsedLeagueId) return;
    setLoading(true);

    // 1. Detalles de la liga
    const leagueRes = await getLeague(parsedLeagueId);
    if (leagueRes.ok) {
      setLeague(leagueRes.data);
      setEditName(leagueRes.data.name || '');
      setEditDescription(leagueRes.data.description || '');
    }

    // 2. Estado de participación del usuario en esta liga
    const statusRes = await getUserLeagueStatus(parsedLeagueId);
    if (statusRes.ok) {
      setIsParticipant(true);
      setParticipant(statusRes.data);

      // Cargar disponibilidad
      const userAvailabilityRes = await getUserAvailability(parsedLeagueId);
      const selectedIds = new Set<number>();
      if (userAvailabilityRes.ok) {
        userAvailabilityRes.data.forEach((slot: any) => {
          selectedIds.add(slot.dateTimeSlotId);
        });
      }
      setSelectedSlotIds(selectedIds);

      // Cargar todos los slots de los rounds de la liga recopilando de sus partidos
      const matchesRes = await getLeagueMatches(parsedLeagueId);
      if (matchesRes.ok) {
        const roundIds = Array.from(new Set(matchesRes.data.map(m => m.roundId).filter(Boolean)));
        let slotsAccumulator: any[] = [];
        for (const rId of roundIds) {
          const roundSlotsRes = await getRoundAvailability(rId as number);
          if (roundSlotsRes.ok) {
            slotsAccumulator.push(...roundSlotsRes.data);
          }
        }
        // Deduplicar slots por id
        const uniqueSlots = Array.from(
          new Map(slotsAccumulator.map(s => [s.dateTimeSlotId || s.id, s])).values()
        );
        setAllSlots(uniqueSlots);
      }
    } else {
      setIsParticipant(false);
      setParticipant(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLeagueInfo();
  }, [leagueId]);

  const handleJoinLeague = async () => {
    if (!parsedLeagueId) return;
    setActionLoading(true);
    const result = await joinLeague(parsedLeagueId);
    setActionLoading(false);
    if (result.ok) {
      alert('Te has inscrito correctamente en la liga.');
      fetchLeagueInfo();
    } else {
      alert('Error al inscribirse: ' + (result.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  const toggleSlot = (slotId: number) => {
    const nextIds = new Set(selectedSlotIds);
    if (nextIds.has(slotId)) {
      nextIds.delete(slotId);
    } else {
      nextIds.add(slotId);
    }
    setSelectedSlotIds(nextIds);
  };

  const handleSaveAvailability = async () => {
    if (!parsedLeagueId) return;
    setSavingAvailability(true);
    const result = await updateUserAvailability(parsedLeagueId, Array.from(selectedSlotIds));
    setSavingAvailability(false);
    if (result.ok) {
      alert('Tu disponibilidad horaria ha sido guardada correctamente.');
      fetchLeagueInfo();
    } else {
      alert('Error al guardar la disponibilidad: ' + (result.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  // Guardar Edición Básica de Liga
  const handleUpdateBasicInfo = async () => {
    if (!editName.trim()) return;
    setSavingAdmin(true);
    const result = await updateLeague(parsedLeagueId, {
      name: editName,
      description: editDescription,
    });
    setSavingAdmin(false);
    if (result.ok) {
      alert('Información de la liga actualizada.');
      setShowAdminModal(false);
      fetchLeagueInfo();
    } else {
      alert('Error al actualizar: ' + (result.error?.errorMessage || 'Revisa los datos.'));
    }
  };

  // Guardar Configuración de Liga
  const handleUpdateConfig = async () => {
    setSavingAdmin(true);
    const result = await updateLeagueConfiguration(parsedLeagueId, {
      maxTeams: parseInt(editMaxTeams, 10) || 16,
    });
    setSavingAdmin(false);
    if (result.ok) {
      alert('Configuración de la liga actualizada.');
      setShowAdminModal(false);
      fetchLeagueInfo();
    } else {
      alert('Error al actualizar configuración: ' + (result.error?.errorMessage || 'Revisa los datos.'));
    }
  };

  // Guardar Sistema de Puntuación
  const handleUpdatePunctuation = async () => {
    setSavingAdmin(true);
    const result = await updatePunctuationSystem(parsedLeagueId, {
      winPoints: parseInt(winPoints, 10) || 3,
      drawPoints: parseInt(drawPoints, 10) || 1,
      lossPoints: parseInt(lossPoints, 10) || 0,
    });
    setSavingAdmin(false);
    if (result.ok) {
      alert('Sistema de puntuación guardado.');
      setShowAdminModal(false);
    } else {
      alert('Error al actualizar puntuación: ' + (result.error?.errorMessage || 'Revisa los datos.'));
    }
  };

  // Borrar Liga
  const handleDeleteLeague = async () => {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar permanentemente esta liga? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;

    setSavingAdmin(true);
    const result = await deleteLeague(parsedLeagueId);
    setSavingAdmin(false);
    if (result.ok) {
      alert('Liga eliminada correctamente.');
      router.push('/');
    } else {
      alert('Error al eliminar la liga: ' + (result.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0060a8" />
      </View>
    );
  }

  if (!league) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <Text className="text-gray-500 text-lg font-medium text-center">Liga no encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header deportivo de la Liga */}
      <View className="bg-[#0060a8] p-6 pb-12 rounded-b-[32px] items-center shadow-md relative">
        <View className="w-20 h-20 bg-white rounded-full justify-center items-center mb-3 shadow-sm">
          <Ionicons name="trophy-outline" size={44} color="#0060a8" />
        </View>
        <Text className="text-white text-2xl font-black text-center px-4">{league.name}</Text>
        <View className="bg-[#e6eff7] px-3.5 py-1 rounded-full mt-3">
          <Text className="text-[#0060a8] text-xs font-extrabold uppercase tracking-wide">
            Estado: {league.status}
          </Text>
        </View>

        {/* Botón de Ajustes de Administrador */}
        <TouchableOpacity
          className="absolute top-6 right-6 bg-white/20 p-2.5 rounded-full"
          onPress={() => setShowAdminModal(true)}
        >
          <Ionicons name="settings-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View className="px-4 -mt-6 space-y-6">
        {/* Descripción e Info General */}
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <Text className="text-base font-bold text-gray-900 mb-2">Información del Campeonato</Text>
          <Text className="text-sm text-gray-600 leading-relaxed mb-4">{league.description}</Text>
          
          <View className="border-t border-gray-100 pt-3 space-y-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-2">Fecha Inicio:</Text>
              </View>
              <Text className="text-xs text-gray-800 font-bold">{new Date(league.startDate).toLocaleDateString()}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-2">Fecha Fin:</Text>
              </View>
              <Text className="text-xs text-gray-800 font-bold">{new Date(league.endDate).toLocaleDateString()}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-2">Ubicación:</Text>
              </View>
              <Text className="text-xs text-[#0060a8] font-bold" numberOfLines={1}>Web Oficial</Text>
            </View>
          </View>
        </View>

        {/* Inscripción / Estado del Usuario */}
        {!isParticipant ? (
          <View className="bg-orange-50 p-5 rounded-2xl border border-orange-200 items-center">
            <View className="w-12 h-12 bg-orange-100 rounded-full justify-center items-center mb-3">
              <Ionicons name="alert-circle-outline" size={24} color="#EA580C" />
            </View>
            <Text className="text-base font-bold text-orange-950 text-center mb-1">¡Inscríbete en esta Liga!</Text>
            <Text className="text-xs text-orange-800 text-center mb-4 px-2">
              Para unirte a un equipo, proponer partidos y fijar tu disponibilidad horaria, primero debes registrar tu participación en el campeonato.
            </Text>
            <TouchableOpacity
              className="w-full bg-[#0060a8] py-3 rounded-xl items-center active:bg-[#00487c]"
              onPress={handleJoinLeague}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-bold text-sm">Participar en la Liga</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-green-50 p-5 rounded-2xl border border-green-200">
            <View className="flex-row items-center space-x-3 mb-2">
              <View className="w-8 h-8 bg-green-100 rounded-full justify-center items-center">
                <Ionicons name="checkmark-circle-outline" size={20} color="#16A34A" />
              </View>
              <Text className="text-base font-bold text-green-950 ml-2">Inscripción confirmada</Text>
            </View>
            <Text className="text-xs text-green-800 leading-relaxed mb-1">
              Estás registrado como participante.
            </Text>
            <View className="flex-row flex-wrap gap-1.5 mt-2">
              {participant?.roles?.map((role, idx) => (
                <View key={idx} className="bg-green-100 px-2.5 py-0.5 rounded-full border border-green-300">
                  <Text className="text-green-800 text-[10px] font-black uppercase">{role}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Disponibilidad Horaria (solo participantes inscritos) */}
        {isParticipant && (
          <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <Text className="text-base font-bold text-gray-900 mb-1">Mi Disponibilidad Horaria</Text>
            <Text className="text-xs text-gray-500 mb-4">
              Selecciona los horarios en los que estás disponible para disputar partidos. Los capitanes y el sistema programador utilizarán estos datos.
            </Text>

            {allSlots.length === 0 ? (
              <View className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Text className="text-xs text-gray-400 italic text-center">
                  Aún no hay franjas horarias registradas en la liga para configurar disponibilidad.
                </Text>
              </View>
            ) : (
              <View className="space-y-2 mb-4">
                {allSlots.map((slot) => {
                  const id = slot.dateTimeSlotId || slot.id;
                  const isSelected = selectedSlotIds.has(id);
                  return (
                    <TouchableOpacity
                      key={id}
                      onPress={() => toggleSlot(id)}
                      className={`flex-row items-center justify-between p-3 rounded-xl border ${
                        isSelected
                          ? 'bg-[#e6eff7] border-[#0060a8]'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <View className="flex-row items-center">
                        <Ionicons
                          name={isSelected ? 'checkbox' : 'square-outline'}
                          size={20}
                          color={isSelected ? '#0060a8' : '#9CA3AF'}
                        />
                        <Text className="text-xs text-gray-800 ml-3 font-semibold">
                          {new Date(slot.dateTime).toLocaleString('es-ES', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                      <Text className="text-[10px] text-gray-400 font-bold uppercase">
                        {slot.duration} Horas
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {allSlots.length > 0 && (
              <TouchableOpacity
                className="w-full bg-[#0060a8] py-3 rounded-xl items-center active:bg-[#00487c]"
                onPress={handleSaveAvailability}
                disabled={savingAvailability}
              >
                {savingAvailability ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-bold text-sm">Guardar Disponibilidad</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Modal de Administración de Liga */}
      <Modal
        visible={showAdminModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAdminModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden max-h-[85vh]">
            <View className="bg-[#0060a8] p-4 flex-row justify-between items-center">
              <Text className="text-white font-bold text-base flex-row items-center">
                <Ionicons name="construct-outline" size={18} color="white" /> Panel de Administración
              </Text>
              <TouchableOpacity onPress={() => setShowAdminModal(false)}>
                <Ionicons name="close" size={22} color="white" />
              </TouchableOpacity>
            </View>

            {/* Tabs de Admin */}
            <View className="flex-row border-b border-gray-200 bg-gray-50">
              <TouchableOpacity
                className={`flex-1 py-3 items-center ${adminTab === 'info' ? 'border-b-2 border-[#0060a8] bg-white' : ''}`}
                onPress={() => setAdminTab('info')}
              >
                <Text className={`text-xs font-bold ${adminTab === 'info' ? 'text-[#0060a8]' : 'text-gray-500'}`}>Datos Liga</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 items-center ${adminTab === 'config' ? 'border-b-2 border-[#0060a8] bg-white' : ''}`}
                onPress={() => setAdminTab('config')}
              >
                <Text className={`text-xs font-bold ${adminTab === 'config' ? 'text-[#0060a8]' : 'text-gray-500'}`}>Configuración</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 items-center ${adminTab === 'punctuation' ? 'border-b-2 border-[#0060a8] bg-white' : ''}`}
                onPress={() => setAdminTab('punctuation')}
              >
                <Text className={`text-xs font-bold ${adminTab === 'punctuation' ? 'text-[#0060a8]' : 'text-gray-500'}`}>Puntuación</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="p-5 space-y-4">
              {/* Tab 1: Datos Básicos */}
              {adminTab === 'info' && (
                <View className="space-y-3">
                  <Text className="text-xs text-gray-500">Modifica la información general del campeonato:</Text>
                  <View>
                    <Text className="text-xs font-semibold text-gray-700 mb-1">Nombre de la liga</Text>
                    <TextInput
                      className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                      value={editName}
                      onChangeText={setEditName}
                    />
                  </View>
                  <View>
                    <Text className="text-xs font-semibold text-gray-700 mb-1">Descripción</Text>
                    <TextInput
                      className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                      value={editDescription}
                      onChangeText={setEditDescription}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                  <TouchableOpacity
                    className="bg-[#0060a8] py-2.5 rounded-xl items-center mt-2"
                    onPress={handleUpdateBasicInfo}
                    disabled={savingAdmin}
                  >
                    <Text className="text-white font-bold text-xs">Guardar Cambios Básicos</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Tab 2: Configuración */}
              {adminTab === 'config' && (
                <View className="space-y-3">
                  <Text className="text-xs text-gray-500">Ajustes de plazas y límites del torneo:</Text>
                  <View>
                    <Text className="text-xs font-semibold text-gray-700 mb-1">Máximo de equipos</Text>
                    <TextInput
                      className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                      value={editMaxTeams}
                      onChangeText={setEditMaxTeams}
                      keyboardType="numeric"
                    />
                  </View>
                  <TouchableOpacity
                    className="bg-[#0060a8] py-2.5 rounded-xl items-center mt-2"
                    onPress={handleUpdateConfig}
                    disabled={savingAdmin}
                  >
                    <Text className="text-white font-bold text-xs">Guardar Configuración</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Tab 3: Sistema de Puntuación */}
              {adminTab === 'punctuation' && (
                <View className="space-y-3">
                  <Text className="text-xs text-gray-500">Puntos otorgados en la tabla clasificatoria:</Text>
                  <View className="flex-row gap-2">
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-gray-700 mb-1">Victoria</Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                        value={winPoints}
                        onChangeText={setWinPoints}
                        keyboardType="numeric"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-gray-700 mb-1">Empate</Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                        value={drawPoints}
                        onChangeText={setDrawPoints}
                        keyboardType="numeric"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-gray-700 mb-1">Derrota</Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                        value={lossPoints}
                        onChangeText={setLossPoints}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    className="bg-[#0060a8] py-2.5 rounded-xl items-center mt-2"
                    onPress={handleUpdatePunctuation}
                    disabled={savingAdmin}
                  >
                    <Text className="text-white font-bold text-xs">Guardar Puntuación</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Zona de Peligro: Borrar Liga */}
              <View className="border-t border-red-100 pt-4 mt-4">
                <Text className="text-xs font-bold text-red-600 mb-2">Zona de Peligro</Text>
                <TouchableOpacity
                  className="bg-red-50 border border-red-300 py-2.5 rounded-xl items-center"
                  onPress={handleDeleteLeague}
                  disabled={savingAdmin}
                >
                  <Text className="text-red-700 font-bold text-xs">Eliminar Liga Permanentemente</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}