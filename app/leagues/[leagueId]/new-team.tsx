import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUserLeagueStatus } from '@/services/LeagueService';
import { createRequest } from '@/services/RequestService';
import { ParticipantDetails } from '@/types/api';

export default function CrearEquipoScreen() {
  const router = useRouter();
  const { leagueId } = useLocalSearchParams<{ leagueId: string }>();

  const [participant, setParticipant] = useState<ParticipantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    lema: '',
    descripcion: '',
  });

  useEffect(() => {
    const fetchParticipantStatus = async () => {
      if (!leagueId) return;
      setLoading(true);
      const statusResult = await getUserLeagueStatus(parseInt(leagueId, 10));
      if (statusResult.ok) {
        setParticipant(statusResult.data);
      } else {
        alert('Debes estar inscrito en la liga para poder proponer un equipo. Ve a la pestaña "Mi Equipo" primero.');
        router.back();
      }
      setLoading(false);
    };
    fetchParticipantStatus();
  }, [leagueId]);

  const handleEnviar = async () => {
    if (!leagueId || !participant) return;
    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      alert('Por favor, rellena el nombre y la descripción.');
      return;
    }

    setSubmitting(true);

    // Generar iniciales de exactamente 2 caracteres que coincidan con la regex [A-Z][0-9A-Z]
    let initials = formData.nombre
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 2);
    if (initials.length < 2) {
      initials = (initials + 'X').slice(0, 2);
    }

    const result = await createRequest(parseInt(leagueId, 10), {
      name: formData.nombre,
      initials: initials,
      description: formData.descripcion,
      motto: formData.lema || 'Sin lema',
      primaryColor: '#2563EFFF', // Formato RGBA hexadecimal #[0-9A-F]{8}
      secondaryColor: '#10B981FF',
      iconImageUrl: 'https://i.pravatar.cc/150?img=3',
      participantId: participant.participantId,
      leagueId: parseInt(leagueId, 10),
      status: 'PENDING',
    } as any);

    setSubmitting(false);

    if (result.ok) {
      alert('Solicitud para crear el equipo enviada correctamente al administrador de la liga.');
      router.back();
    } else {
      alert('Error al enviar la solicitud: ' + (result.error?.errorMessage || 'Inténtalo de nuevo.'));
    }
  };

  const handleCancelar = () => {
    router.back();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-md items-center">
          
          <View className="mb-8 items-center">
            <Text className="text-2xl font-bold text-gray-900">Crear equipo</Text>
            <Text className="text-sm text-gray-500 text-center mt-1">Introduce los datos básicos de tu club</Text>
          </View>

          <View className="w-full space-y-4">
            
            <View className="items-center mb-6">
              <Pressable className="w-24 h-24 rounded-full bg-white border border-gray-200 border-dashed justify-center items-center relative">
                <Ionicons name="image-outline" size={32} color="#9CA3AF" />
                <View className="absolute bottom-0 right-0 bg-blue-600 w-7 h-7 rounded-full justify-center items-center border border-white">
                  <Ionicons name="add" size={16} color="#FFF" />
                </View>
              </Pressable>
              <Text className="text-xs text-gray-400 mt-2 font-medium">Escudo por defecto asignado</Text>
            </View>

            <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-14">
              <Ionicons name="shield-half-outline" size={20} color="#9CA3AF" className="mr-3" />
              <TextInput
                className="flex-1 text-gray-900 text-sm"
                placeholder="Nombre del equipo"
                placeholderTextColor="#9CA3AF"
                value={formData.nombre}
                onChangeText={(text) => setFormData({...formData, nombre: text})}
              />
            </View>

            <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-14">
              <Ionicons name="chatbubble-outline" size={20} color="#9CA3AF" className="mr-3" />
              <TextInput
                className="flex-1 text-gray-900 text-sm"
                placeholder="Lema o Epitafio (corto)"
                placeholderTextColor="#9CA3AF"
                value={formData.lema}
                onChangeText={(text) => setFormData({...formData, lema: text})}
              />
            </View>

            <View className="flex-row items-start bg-white border border-gray-200 rounded-xl px-4 py-3 h-32">
              <Ionicons name="document-text-outline" size={20} color="#9CA3AF" className="mr-3 mt-1" />
              <TextInput
                className="flex-1 text-gray-900 text-sm h-full"
                placeholder="Descripción completa del equipo..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                value={formData.descripcion}
                onChangeText={(text) => setFormData({...formData, descripcion: text})}
                style={{ textAlignVertical: 'top' }}
              />
            </View>

            <View className="flex-row gap-4 mt-6">
              <Pressable 
                className="flex-1 bg-white border border-gray-200 rounded-xl h-14 justify-center items-center active:bg-gray-100" 
                onPress={handleCancelar}
                disabled={submitting}
              >
                <Text className="text-gray-700 font-bold text-base">Cancelar</Text>
              </Pressable>
              
              <Pressable 
                className="flex-1 bg-blue-600 rounded-xl h-14 justify-center items-center active:bg-blue-700" 
                onPress={handleEnviar}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">Enviar solicitud</Text>
                )}
              </Pressable>
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}