import { supabase } from './supabase';

export async function uploadPropertyImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `properties/${fileName}`;

    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}

export async function deletePropertyImage(url: string): Promise<boolean> {
  try {
    const path = url.split('/property-images/')[1];
    
    const { error } = await supabase.storage
      .from('property-images')
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}