import { apiClient } from './ApiClient';
import { ApiResult } from '@/types/own';

export interface StorageUrlResponse {
  uploadUrl: string;
  publicUrl: string;
}

export type StorageFolderType =
  | 'avatars'
  | 'profiles'
  | 'league-banners'
  | 'team-shields'
  | 'signatures'
  | 'match-records';

export const getUploadUrl = async (
  folder: StorageFolderType | string,
  extension: string
): Promise<ApiResult<StorageUrlResponse>> => {
  return await apiClient.get<StorageUrlResponse>(
    `/storage/upload-url?folder=${encodeURIComponent(folder)}&extension=${encodeURIComponent(extension)}`
  );
};

export const uploadFileToMinio = async (
  localFileUri: string,
  presignedUrl: string,
  mimeType: string
): Promise<void> => {
  // 1. Transformar la URI local en un binario (Blob)
  const localResponse = await fetch(localFileUri);
  const blob = await localResponse.blob();

  // 2. Ejecutar el PUT hacia la URL prefirmada de MinIO
  const minioResponse = await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': mimeType,
    },
    body: blob,
  });

  if (!minioResponse.ok) {
    throw new Error(`Fallo en la subida al Object Storage (${minioResponse.status})`);
  }
};

export const uploadFileToStorage = async (
  folder: StorageFolderType | string,
  localFileUri: string,
  mimeType: string = 'image/png',
  extension: string = 'png'
): Promise<string> => {
  const urlRes = await getUploadUrl(folder, extension);
  if (!urlRes.ok) {
    throw new Error(urlRes.error?.errorMessage || 'Error al obtener URL de subida');
  }
  await uploadFileToMinio(localFileUri, urlRes.data.uploadUrl, mimeType);
  return urlRes.data.publicUrl;
};
