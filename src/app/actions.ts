'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export type Guest = {
  id: string;
  name: string;
  payment_status: 'pending' | 'paid';
  used_status: number;
  guests_count: number;
  created_at: string;
  paid_at?: string;
  phone?: string;
};

// Función interna para asegurar que la tabla exista (se ejecuta automáticamente al buscar invitados)
async function ensureTableExists() {
  await sql`
    CREATE TABLE IF NOT EXISTS guests (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
      used_status INTEGER NOT NULL DEFAULT 0,
      guests_count INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  // Add paid_at column if it doesn't exist
  await sql`ALTER TABLE guests ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;`;
  // Add phone column if it doesn't exist
  await sql`ALTER TABLE guests ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`;
}

export async function getGuests(): Promise<Guest[]> {
  try {
    await ensureTableExists();
    const { rows } = await sql`SELECT * FROM guests ORDER BY created_at DESC`;
    return rows as Guest[];
  } catch (error) {
    console.error('Error fetching guests:', error);
    return [];
  }
}

export async function addGuest(name: string, guestsCount: number = 1, phone: string = '') {
  try {
    const id = crypto.randomUUID().substring(0, 8); // Short ID for simpler QR
    await sql`
      INSERT INTO guests (id, name, payment_status, used_status, guests_count, phone)
      VALUES (${id}, ${name}, 'pending', 0, ${guestsCount}, ${phone})
    `;
    revalidatePath('/admin');
    return id;
  } catch (error) {
    console.error('Error adding guest:', error);
  }
}

export async function markAsPaid(id: string) {
  try {
    await sql`UPDATE guests SET payment_status = 'paid', paid_at = CURRENT_TIMESTAMP WHERE id = ${id}`;
    revalidatePath('/admin');
  } catch (error) {
    console.error('Error marking as paid:', error);
  }
}

export async function deleteGuest(id: string) {
  try {
    await sql`DELETE FROM guests WHERE id = ${id}`;
    revalidatePath('/admin');
  } catch (error) {
    console.error('Error deleting guest:', error);
  }
}

export async function verifyGuestAndMarkUsed(id: string) {
  try {
    const { rows } = await sql`SELECT * FROM guests WHERE id = ${id} LIMIT 1`;
    const guest = rows[0] as Guest | undefined;

    if (!guest) {
      return { success: false, message: 'Entrada no encontrada' };
    }

    if (guest.payment_status !== 'paid') {
      return { success: false, message: 'Pago pendiente', guest };
    }

    if (guest.used_status === 1) {
      return { success: false, message: 'Entrada ya fue usada', guest };
    }

    // Mark as used
    await sql`UPDATE guests SET used_status = 1 WHERE id = ${id}`;
    return { success: true, message: 'Acceso permitido', guest };
  } catch (error) {
    console.error('Error verifying guest:', error);
    return { success: false, message: 'Error interno de validación' };
  }
}

export async function getGuestById(id: string) {
  try {
    const { rows } = await sql`SELECT * FROM guests WHERE id = ${id} LIMIT 1`;
    return rows[0] as Guest | undefined;
  } catch (error) {
    console.error('Error fetching guest by id:', error);
    return undefined;
  }
}
