'use server';

import supabase from '@/lib/db';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export type Guest = {
  id: string;
  name: string;
  payment_status: 'pending' | 'paid';
  used_status: number;
  guests_count: number;
  created_at: string;
};

export async function getGuests(): Promise<Guest[]> {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching guests:', error);
    return [];
  }
  return data as Guest[];
}

export async function addGuest(name: string, guestsCount: number = 1) {
  const id = crypto.randomUUID().substring(0, 8); // Short ID for simpler QR
  const { error } = await supabase
    .from('guests')
    .insert([{ id, name, payment_status: 'pending', used_status: 0, guests_count: guestsCount }]);

  if (error) console.error('Error adding guest:', error);
  revalidatePath('/admin');
  return id;
}

export async function markAsPaid(id: string) {
  const { error } = await supabase
    .from('guests')
    .update({ payment_status: 'paid' })
    .eq('id', id);

  if (error) console.error('Error marking as paid:', error);
  revalidatePath('/admin');
}

export async function deleteGuest(id: string) {
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', id);

  if (error) console.error('Error deleting guest:', error);
  revalidatePath('/admin');
}

export async function verifyGuestAndMarkUsed(id: string) {
  const { data: guest, error } = await supabase
    .from('guests')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !guest) {
    return { success: false, message: 'Entrada no encontrada' };
  }

  if (guest.payment_status !== 'paid') {
    return { success: false, message: 'Pago pendiente', guest };
  }

  if (guest.used_status === 1) {
    return { success: false, message: 'Entrada ya fue usada', guest };
  }

  // Mark as used
  const { error: updateError } = await supabase
    .from('guests')
    .update({ used_status: 1 })
    .eq('id', id);

  if (updateError) {
    return { success: false, message: 'Error actualizando entrada', guest };
  }

  return { success: true, message: 'Acceso permitido', guest };
}

export async function getGuestById(id: string) {
  const { data: guest, error } = await supabase
    .from('guests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return undefined;
  return guest as Guest;
}
