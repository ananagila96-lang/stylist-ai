import { supabase } from './supabase';

export async function uploadPrivatePhoto(userId, position, file) {
  if (!supabase) throw new Error('Backend não configurado.');
  if (!['frente','perfil','costas'].includes(position)) throw new Error('Posição de foto inválida.');
  if (!file?.type?.startsWith('image/')) throw new Error('Escolha uma imagem.');
  if (file.size > 15 * 1024 * 1024) throw new Error('A imagem deve ter no máximo 15 MB.');

  const extension = (file.name?.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${userId}/${position}.${extension}`;
  const { error } = await supabase.storage.from('private-photos').upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw error;
  return path;
}

export async function getPrivatePhotoUrl(path) {
  const { data, error } = await supabase.storage.from('private-photos').createSignedUrl(path, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
}
