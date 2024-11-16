'use server';
import { recordsLand } from '@/db/schema';
import {
  CreateLandSchema,
  UpdateLandSchema,
} from '@/lib/zod/schemas/record-schema';
import { db } from '@/db';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { getErrorMessage } from '@/lib/handle-error';
import { eq, inArray } from 'drizzle-orm';

export async function createLand(
  input: CreateLandSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsLand)
      .values({
        ...input,
      })
      .returning({
        id: recordsLand.id,
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

export async function deleteLands(input: { ids: string[] }) {
  try {
    await db.delete(recordsLand).where(inArray(recordsLand.id, input.ids));

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

export async function updateLand(input: UpdateLandSchema & { id: string }) {
  noStore();

  try {
    await db
      .update(recordsLand)
      .set({
        ...input,
      })
      .where(eq(recordsLand.id, input.id));

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
