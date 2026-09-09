import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/authProvider';
import { getCurrentUser, updateCurrentUser, getUserInvitations, resolveUserInvitation } from '@/services/UserService';
import { getUserSignature, uploadUserSignature } from '@/services/SignService';
import { uploadFileToStorage } from '@/services/StorageService';
import { UserDetails, SignImageUrl } from '@/types/api';
import ImageSelectorModal from '@/components/ui/ImageSelectorModal';
import { IMAGE_SPECS } from '@/utils/ImageProcessor';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [signature, setSignature] = useState<SignImageUrl | null>(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [resolvingInvId, setResolvingInvId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    const userResult = await getCurrentUser();
    if (userResult.ok) {
      setUser(userResult.data);
    }
    const sigResult = await getUserSignature();
    if (sigResult.ok) {
      setSignature(sigResult.data);
    }
    const invResult = await getUserInvitations();
    if (invResult.ok) {
      setInvitations(invResult.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleResolveInvitation = async (requestId: number, accept: boolean) => {
    setResolvingInvId(requestId);
    const result = await resolveUserInvitation(requestId, accept);
    setResolvingInvId(null);
    if (result.ok) {
      alert(accept ? 'Invitación aceptada.' : 'Invitación rechazada.');
      const invResult = await getUserInvitations();
      if (invResult.ok) {
        setInvitations(invResult.data || []);
      }
    } else {
      alert('Error al procesar la invitación: ' + (result.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  const handleUpdateProfile = async () => {
    if (!editFullName.trim() || !editEmail.trim()) {
      alert('Por favor, rellena todos los campos.');
      return;
    }
    setUpdatingProfile(true);
    const result = await updateCurrentUser({
      fullName: editFullName,
      email: editEmail,
    });
    setUpdatingProfile(false);
    if (result.ok) {
      setUser(result.data);
      setShowEditModal(false);
      alert('Perfil actualizado correctamente.');
    } else {
      alert('Error al actualizar el perfil: ' + (result.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0060a8" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header card */}
      <View className="bg-white items-center py-8 border-b border-gray-200">
        <View className="relative mb-4">
          <Image
            source={{ uri: user?.profileImageUrl || 'https://i.pravatar.cc/300' }}
            className="w-24 h-24 rounded-full border-4 border-[#0060a8]"
          />
          <TouchableOpacity 
            className="absolute bottom-0 right-0 bg-[#0060a8] w-8 h-8 rounded-full justify-center items-center border-2 border-white"
            onPress={() => setShowAvatarSelector(!showAvatarSelector)}
          >
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-bold text-gray-900">{user?.fullName || 'Usuario'}</Text>
        <Text className="text-sm text-gray-500 mt-1">{user?.email || 'email@correo.com'}</Text>
        <View className="mt-3 bg-[#e6eff7] px-3 py-1 rounded-full">
          <Text className="text-[#0060a8] text-xs font-semibold">{user?.category || 'MALE'}</Text>
        </View>

        {/* Selector de Foto de Perfil (256x256, <200KB) */}
        {showAvatarSelector && (
          <View className="w-full max-w-sm px-4 mt-4">
            <ImageSelectorModal
              label="Foto de Perfil"
              specs={IMAGE_SPECS.SQUARE}
              currentValue={user?.profileImageUrl}
              aspectDesc="256x256 px · Máx 200KB (Cuadrada)"
              onChange={async ({ localUri, publicUrl, isLocal }) => {
                setUpdatingProfile(true);
                let finalUrl = isLocal ? localUri : publicUrl;
                if (isLocal && localUri) {
                  try {
                    finalUrl = await uploadFileToStorage('profiles', localUri, 'image/jpeg', 'jpg');
                  } catch (err: any) {
                    alert('Error al subir avatar a MinIO: ' + (err.message || 'Error desconocido'));
                    setUpdatingProfile(false);
                    return;
                  }
                }
                if (finalUrl) {
                  const res = await updateCurrentUser({ profileImageUrl: finalUrl });
                  if (res.ok) {
                    setUser(res.data);
                    alert('Foto de perfil actualizada correctamente.');
                    setShowAvatarSelector(false);
                  } else {
                    alert('Error al guardar foto: ' + (res.error?.errorMessage || 'Inténtalo de nuevo.'));
                  }
                }
                setUpdatingProfile(false);
              }}
            />
          </View>
        )}
      </View>

      {/* Invitaciones Pendientes */}
      <View className="bg-white mx-4 mt-6 p-4 rounded-xl shadow-sm border border-gray-100">
        <Text className="text-base font-bold text-gray-900 mb-3 flex-row items-center">
          <Ionicons name="mail-unread-outline" size={18} color="#0060a8" /> Mis Invitaciones
        </Text>
        {invitations && invitations.length > 0 ? (
          invitations.map((inv) => (
            <View key={inv.requestId || inv.id} className="bg-gray-50 p-3 rounded-lg mb-2 border border-gray-200 flex-row justify-between items-center">
              <View className="flex-1 mr-3">
                <Text className="text-sm font-bold text-gray-800">{inv.teamName || `Equipo #${inv.teamId || inv.team}` || 'Invitación de equipo'}</Text>
                <Text className="text-xs text-gray-500">Liga: {inv.leagueName || `Liga #${inv.leagueId}`}</Text>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="bg-red-50 p-2 rounded-lg border border-red-200"
                  onPress={() => handleResolveInvitation(inv.requestId || inv.id, false)}
                  disabled={resolvingInvId === (inv.requestId || inv.id)}
                >
                  <Ionicons name="close" size={18} color="#EF4444" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-green-50 p-2 rounded-lg border border-green-200"
                  onPress={() => handleResolveInvitation(inv.requestId || inv.id, true)}
                  disabled={resolvingInvId === (inv.requestId || inv.id)}
                >
                  <Ionicons name="checkmark" size={18} color="#10B981" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-sm text-gray-400 italic">No tienes invitaciones pendientes.</Text>
        )}
      </View>

      {/* Licencias */}
      <View className="bg-white mx-4 mt-6 p-4 rounded-xl shadow-sm border border-gray-100">
        <Text className="text-base font-bold text-gray-900 mb-3 flex-row items-center">
          <Ionicons name="card-outline" size={18} color="#0060a8" /> Mis Licencias
        </Text>
        {user?.licenses && user.licenses.length > 0 ? (
          user.licenses.map((lic, idx) => (
            <View key={idx} className="flex-row justify-between items-center py-2 border-b border-gray-50 last:border-b-0">
              <Text className="text-sm text-gray-700 font-medium">{lic.sport.sportName}</Text>
              <Text className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono">{lic.license}</Text>
            </View>
          ))
        ) : (
          <Text className="text-sm text-gray-400 italic">No tienes licencias registradas.</Text>
        )}
      </View>

      {/* Firma Digital con recorte y validación */}
      <View className="bg-white mx-4 mt-6 p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <Text className="text-base font-bold text-gray-900 mb-1">
          <Ionicons name="brush-outline" size={18} color="#0060a8" /> Firma Digital (MinIO Storage)
        </Text>

        <ImageSelectorModal
          label="Firma de Actas"
          specs={IMAGE_SPECS.SIGNATURE}
          currentValue={signature?.signImageUrl}
          aspectDesc="400x200 px · Máx 200KB"
          onChange={async ({ localUri, publicUrl, isLocal }) => {
            setUploading(true);
            let finalUrl = isLocal ? localUri : publicUrl;
            if (isLocal && localUri) {
              try {
                finalUrl = await uploadFileToStorage('signatures', localUri, 'image/jpeg', 'jpg');
              } catch (err: any) {
                alert('Error al subir firma a MinIO: ' + (err.message || 'Error desconocido'));
                setUploading(false);
                return;
              }
            }
            if (finalUrl) {
              const res = await uploadUserSignature({ signImageUrl: finalUrl });
              if (res.ok) {
                setSignature(res.data);
                alert('Firma guardada correctamente.');
              } else {
                setSignature({ signImageUrl: finalUrl, uploatAt: new Date().toISOString() });
                alert('Firma guardada localmente.');
              }
            }
            setUploading(false);
          }}
        />
        {uploading && (
          <View className="py-2 items-center">
            <ActivityIndicator size="small" color="#0060a8" />
            <Text className="text-xs text-[#0060a8] font-bold mt-1">Guardando firma en MinIO...</Text>
          </View>
        )}
      </View>

      {/* Menu Options & Logout */}
      <View className="bg-white mx-4 mt-6 rounded-xl shadow-sm border border-gray-100 p-2">
        <TouchableOpacity 
          className="flex-row items-center py-4 px-3 border-b border-gray-50"
          onPress={() => {
            setEditFullName(user?.fullName || '');
            setEditEmail(user?.email || '');
            setShowEditModal(true);
          }}
        >
          <Ionicons name="person-outline" size={20} color="#374151" />
          <Text className="flex-1 text-sm text-gray-700 ml-3">Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center py-4 px-3" onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="flex-1 text-sm text-red-600 font-semibold ml-3">Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Editar Perfil */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <View className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl space-y-4">
            <Text className="text-xl font-bold text-gray-900 mb-2">Editar Perfil</Text>
            
            <View className="space-y-1">
              <Text className="text-xs font-semibold text-gray-500">Nombre completo</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800"
                value={editFullName}
                onChangeText={setEditFullName}
                placeholder="Nombre completo"
              />
            </View>

            <View className="space-y-1">
              <Text className="text-xs font-semibold text-gray-500">Correo electrónico</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800"
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="email@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="flex-row gap-3 pt-4">
              <TouchableOpacity
                className="flex-1 bg-gray-100 border border-gray-200 py-3 rounded-xl items-center"
                onPress={() => setShowEditModal(false)}
                disabled={updatingProfile}
              >
                <Text className="text-gray-600 font-bold text-sm">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-[#0060a8] py-3 rounded-xl items-center"
                onPress={handleUpdateProfile}
                disabled={updatingProfile}
              >
                {updatingProfile ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-bold text-sm">Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}