'use server';
import { recordsHouse } from '@/db/schema';
import {
  CreateHouseSchema,
  UpdateHouseSchema,
} from '@/lib/zod/schemas/record-schema';
import { db } from '@/db';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { getErrorMessage } from '@/lib/handle-error';
import { eq, inArray } from 'drizzle-orm';
import { UploadedFile } from '@/types';

export async function createHouse(
  input: CreateHouseSchema & { recordId: string },
  files: UploadedFile[],
) {
  noStore();
  try {
    const urls = files.map(file => `${file.appUrl}|${file.name}`);
    await db
      .insert(recordsHouse)
      .values({
        ...input,
        documents: urls,
      })
      .returning({
        id: recordsHouse.id,
      });
    revalidatePath('/record');
    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteHouses(input: { ids: string[] }) {
  try {
    await db.delete(recordsHouse).where(inArray(recordsHouse.id, input.ids));

    revalidatePath('/record');

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateHouse(input: UpdateHouseSchema & { id: string }) {
  noStore();

  try {
    await db
      .update(recordsHouse)
      .set({
        ...input,
      })
      .where(eq(recordsHouse.id, input.id));

    revalidatePath('/record');

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
