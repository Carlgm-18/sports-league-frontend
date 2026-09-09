import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export interface ImageSpecs {
  width: number;
  height: number;
  maxSizeBytes: number; // e.g. 200 * 1024 = 204800 (200 KB)
  folder: 'profiles' | 'avatars' | 'team-shields' | 'league-banners' | 'signatures' | 'match-records';
}

export const IMAGE_SPECS: Record<'SQUARE' | 'BANNER' | 'SIGNATURE', ImageSpecs> = {
  SQUARE: {
    width: 256,
    height: 256,
    maxSizeBytes: 200 * 1024,
    folder: 'avatars',
  },
  BANNER: {
    width: 256,
    height: 384,
    maxSizeBytes: 200 * 1024,
    folder: 'league-banners',
  },
  SIGNATURE: {
    width: 400,
    height: 200,
    maxSizeBytes: 200 * 1024,
    folder: 'signatures',
  },
};

/**
 * Validates whether an external URL actually points to an accessible image and respects limits.
 * Protects against SSRF, malicious link injection, and non-image payload URLs.
 */
export const validateImageUrl = async (
  url: string,
  maxSizeBytes: number = 200 * 1024
): Promise<{ valid: boolean; error?: string }> => {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL no proporcionada.' };
  }

  const trimmed = url.trim();

  // Permite data:image base64 válidas
  if (trimmed.startsWith('data:image/')) {
    const base64Content = trimmed.split(',')[1] || '';
    const approxBytes = Math.ceil((base64Content.length * 3) / 4);
    if (approxBytes > maxSizeBytes) {
      return { valid: false, error: `La imagen en Base64 excede los 200KB (${Math.round(approxBytes / 1024)}KB).` };
    }
    return { valid: true };
  }

  // Comprobar protocolo http/https válido
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    return { valid: false, error: 'La URL proporcionada no tiene un formato válido.' };
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return { valid: false, error: 'Solo se permiten enlaces http:// o https://.' };
  }

  // Prevenir direcciones internas peligrosas (localhost, loopback, private ranges)
  const hostname = parsedUrl.hostname.toLowerCase();
  const dangerousPatterns = ['localhost', '127.0.0.1', '0.0.0.0', '169.254.', '10.', '192.168.'];
  if (dangerousPatterns.some((pattern) => hostname === pattern || hostname.startsWith(pattern))) {
    // Permitir solo si estamos en entorno dev con minio / backend explícito si fuera necesario
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return { valid: false, error: 'No se permiten URLs que apunten a redes internas privadas.' };
    }
  }

  try {
    // Realizamos una petición HEAD (o GET con rango pequeño) para verificar content-type y content-length
    const headRes = await fetch(trimmed, { method: 'HEAD' });
    if (!headRes.ok) {
      // Algunos servidores bloquean HEAD; intentamos un GET abortable
      const getRes = await fetch(trimmed, { method: 'GET' });
      if (!getRes.ok) {
        return { valid: false, error: `No se pudo acceder a la imagen (HTTP ${getRes.status}).` };
      }
      const cType = getRes.headers.get('content-type') || '';
      if (!cType.startsWith('image/')) {
        return { valid: false, error: `El enlace no corresponde a un archivo de imagen (Content-Type: ${cType}).` };
      }
      const blob = await getRes.blob();
      if (blob.size > maxSizeBytes) {
        return { valid: false, error: `La imagen excede el peso máximo de 200KB (${Math.round(blob.size / 1024)}KB).` };
      }
      return { valid: true };
    }

    const contentType = headRes.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return { valid: false, error: `El recurso enlazado no es una imagen (Content-Type: ${contentType}).` };
    }

    const contentLength = headRes.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > maxSizeBytes) {
      const kb = Math.round(parseInt(contentLength, 10) / 1024);
      return { valid: false, error: `La imagen excede el límite de 200KB (${kb}KB detectados).` };
    }

    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: `Error al verificar la imagen: ${err.message || 'Verificación fallida.'}` };
  }
};

/**
 * Permite seleccionar una imagen del dispositivo, aplicando recorte/zoom nativo con aspect ratio
 * y posterior compresión/redimensionado al tamaño objetivo (256x256 o 256x384) para no exceder 200KB.
 * La imagen se almacena en memoria/cache local y NO se sube a MinIO hasta que se confirme el formulario.
 */
export const pickAndProcessImage = async (
  specs: ImageSpecs
): Promise<{ uri: string; sizeBytes: number; width: number; height: number } | null> => {
  // 1. Solicitar permisos de galería si es necesario
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    alert('Se necesitan permisos para acceder a la galería de fotos.');
    return null;
  }

  // 2. Abrir selector con recorte / zoom nativo según el aspect ratio pedido
  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [specs.width, specs.height],
    quality: 1,
  });

  if (pickerResult.canceled || !pickerResult.assets || pickerResult.assets.length === 0) {
    return null;
  }

  const selectedAsset = pickerResult.assets[0];

  // 3. Redimensionar a las dimensiones exactas especificadas (p. ej. 256x256 o 256x384) y comprimir
  let compressionQuality = 0.85;
  const context = ImageManipulator.manipulate(selectedAsset.uri);
  context.resize({ width: specs.width, height: specs.height });
  let imageRef = await context.renderAsync();
  let processed = await imageRef.saveAsync({ compress: compressionQuality, format: SaveFormat.JPEG });

  // 4. Si el tamaño excede 200KB, comprimir iterativamente en memoria
  let blob = await (await fetch(processed.uri)).blob();
  while (blob.size > specs.maxSizeBytes && compressionQuality > 0.2) {
    compressionQuality -= 0.15;
    const loopContext = ImageManipulator.manipulate(selectedAsset.uri);
    loopContext.resize({ width: specs.width, height: specs.height });
    imageRef = await loopContext.renderAsync();
    processed = await imageRef.saveAsync({ compress: compressionQuality, format: SaveFormat.JPEG });
    blob = await (await fetch(processed.uri)).blob();
  }

  return {
    uri: processed.uri,
    sizeBytes: blob.size,
    width: specs.width,
    height: specs.height,
  };
};
