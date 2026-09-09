import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ImageSpecs, pickAndProcessImage, validateImageUrl } from '@/utils/ImageProcessor';

export interface ImageSelectorProps {
  label: string;
  specs: ImageSpecs;
  currentValue?: string;
  onChange: (result: { localUri?: string; publicUrl?: string; isLocal: boolean }) => void;
  aspectDesc?: string;
}

export default function ImageSelectorModal({
  label,
  specs,
  currentValue,
  onChange,
  aspectDesc,
}: ImageSelectorProps) {
  const [mode, setMode] = useState<'upload' | 'link'>('upload');
  const [previewUri, setPreviewUri] = useState<string>(currentValue || '');
  const [linkInput, setLinkInput] = useState<string>(
    currentValue && !currentValue.startsWith('file://') ? currentValue : ''
  );
  const [processing, setProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [imageSizeKb, setImageSizeKb] = useState<number | null>(null);

  // Seleccionar archivo local con recorte/zoom y compresión < 200KB
  const handlePickImage = async () => {
    setProcessing(true);
    setValidationError(null);
    try {
      const processed = await pickAndProcessImage(specs);
      if (processed) {
        setPreviewUri(processed.uri);
        setImageSizeKb(Math.round(processed.sizeBytes / 1024));
        onChange({ localUri: processed.uri, isLocal: true });
      }
    } catch (err: any) {
      setValidationError('Error al procesar la imagen: ' + (err.message || 'Error desconocido'));
    } finally {
      setProcessing(false);
    }
  };

  // Validar y aplicar link externo existente
  const handleApplyLink = async () => {
    if (!linkInput.trim()) {
      setValidationError('Introduce una URL válida.');
      return;
    }
    setProcessing(true);
    setValidationError(null);
    const val = await validateImageUrl(linkInput.trim(), specs.maxSizeBytes);
    setProcessing(false);

    if (val.valid) {
      setPreviewUri(linkInput.trim());
      setImageSizeKb(null);
      onChange({ publicUrl: linkInput.trim(), isLocal: false });
      alert('Enlace de imagen validado correctamente.');
    } else {
      setValidationError(val.error || 'La URL no es una imagen válida.');
    }
  };

  const isBanner = specs.height > specs.width;

  return (
    <View className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-sm font-bold text-gray-800">{label}</Text>
        <Text className="text-[11px] font-semibold text-gray-400">
          {aspectDesc || `${specs.width}x${specs.height} px · Máx 200KB`}
        </Text>
      </View>

      {/* Tabs Modo: Subir Propia vs Indicar Enlace */}
      <View className="flex-row bg-gray-100 p-1 rounded-xl">
        <TouchableOpacity
          className={`flex-1 py-1.5 rounded-lg items-center ${
            mode === 'upload' ? 'bg-white shadow-sm' : ''
          }`}
          onPress={() => {
            setMode('upload');
            setValidationError(null);
          }}
        >
          <Text
            className={`text-xs font-bold ${
              mode === 'upload' ? 'text-[#0060a8]' : 'text-gray-500'
            }`}
          >
            Subir Propia (Recorte)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-1.5 rounded-lg items-center ${
            mode === 'link' ? 'bg-white shadow-sm' : ''
          }`}
          onPress={() => {
            setMode('link');
            setValidationError(null);
          }}
        >
          <Text
            className={`text-xs font-bold ${
              mode === 'link' ? 'text-[#0060a8]' : 'text-gray-500'
            }`}
          >
            Enlace Existente (URL)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Vista Previa */}
      <View className="items-center justify-center py-2">
        {previewUri ? (
          <View className="relative items-center">
            <Image
              source={{ uri: previewUri }}
              style={{
                width: isBanner ? 140 : 110,
                height: isBanner ? 210 : 110,
                borderRadius: isBanner ? 16 : 55,
              }}
              className="border-2 border-[#0060a8] bg-gray-100"
              resizeMode="cover"
            />
            {imageSizeKb !== null && (
              <View className="mt-1 bg-green-100 px-2 py-0.5 rounded-full border border-green-300">
                <Text className="text-[10px] font-black text-green-800">
                  {imageSizeKb} KB (En memoria)
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              width: isBanner ? 140 : 100,
              height: isBanner ? 190 : 100,
              borderRadius: isBanner ? 16 : 50,
            }}
            className="border-2 border-dashed border-gray-300 items-center justify-center bg-gray-50"
          >
            <Ionicons name="image-outline" size={36} color="#9CA3AF" />
            <Text className="text-[10px] text-gray-400 mt-1">Sin imagen</Text>
          </View>
        )}
      </View>

      {/* Contenido según el modo */}
      {mode === 'upload' ? (
        <TouchableOpacity
          className="w-full bg-[#0060a8] py-2.5 rounded-xl flex-row items-center justify-center space-x-2 active:bg-[#004375]"
          onPress={handlePickImage}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="crop" size={16} color="white" />
              <Text className="text-white font-bold text-xs ml-1.5">
                Elegir imagen, recortar y comprimir
              </Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <View className="space-y-2">
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-11">
            <Ionicons name="link-outline" size={18} color="#9CA3AF" className="mr-2" />
            <TextInput
              className="flex-1 text-xs text-gray-800"
              placeholder="https://ejemplo.com/imagen.png"
              placeholderTextColor="#9CA3AF"
              value={linkInput}
              onChangeText={setLinkInput}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            className="w-full bg-gray-800 py-2.5 rounded-xl items-center active:bg-black"
            onPress={handleApplyLink}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-bold text-xs">
                Verificar y aplicar enlace seguro
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Mensaje de error de validación */}
      {validationError && (
        <View className="bg-red-50 p-2.5 rounded-xl border border-red-200 flex-row items-center space-x-2">
          <Ionicons name="alert-circle" size={16} color="#EF4444" />
          <Text className="text-[11px] text-red-600 font-semibold flex-1 ml-1.5">
            {validationError}
          </Text>
        </View>
      )}
    </View>
  );
}
