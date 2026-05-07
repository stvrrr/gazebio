import { supabase } from '@/lib/firebase';
import { UserProfile, Link } from '@/types';

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('bio_pages')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return data as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const getProfileByUsername = async (username: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('bio_pages')
      .select('*')
      .eq('username', username)
      .single();

    if (error) throw error;

    return data as UserProfile;
  } catch (error) {
    console.error('Error getting profile by username:', error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bio_pages')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const addLink = async (userId: string, link: Link): Promise<void> => {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('bio_pages')
      .select('links')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const currentLinks = profile?.links || [];
    const { error } = await supabase
      .from('bio_pages')
      .update({
        links: [...currentLinks, link],
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error adding link:', error);
    throw error;
  }
};

export const updateLink = async (
  userId: string,
  linkId: string,
  updates: Partial<Link>
): Promise<void> => {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('bio_pages')
      .select('links')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const links = profile?.links.map((link: Link) =>
      link.id === linkId ? { ...link, ...updates } : link
    );

    const { error } = await supabase
      .from('bio_pages')
      .update({
        links,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating link:', error);
    throw error;
  }
};

export const deleteLink = async (userId: string, linkId: string): Promise<void> => {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('bio_pages')
      .select('links')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const links = profile?.links.filter((link: Link) => link.id !== linkId);

    const { error } = await supabase
      .from('bio_pages')
      .update({
        links,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting link:', error);
    throw error;
  }
};

export const uploadProfileImage = async (
  userId: string,
  file: File
): Promise<string> => {
  try {
    const filename = `${userId}_${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filename, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('profile-images').getPublicUrl(filename);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

export const recordProfileView = async (userId: string): Promise<void> => {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('bio_pages')
      .select('views')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const currentViews = profile?.views || 0;
    await supabase
      .from('bio_pages')
      .update({ views: currentViews + 1 })
      .eq('user_id', userId);
  } catch (error) {
    console.error('Error recording view:', error);
  }
};

export const recordLinkClick = async (userId: string, linkId: string): Promise<void> => {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('bio_pages')
      .select('links, total_clicks')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const links = profile?.links.map((link: Link) =>
      link.id === linkId ? { ...link, clicks: (link.clicks || 0) + 1 } : link
    );

    const totalClicks = links.reduce((sum: number, link: Link) => sum + (link.clicks || 0), 0);

    await supabase
      .from('bio_pages')
      .update({
        links,
        total_clicks: totalClicks,
      })
      .eq('user_id', userId);
  } catch (error) {
    console.error('Error recording link click:', error);
  }
};

export const checkUsernameAvailable = async (username: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('bio_pages')
      .select('id')
      .eq('username', username);

    if (error) throw error;

    return (data?.length || 0) === 0;
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
};
