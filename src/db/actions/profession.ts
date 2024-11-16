'use server';
import { recordsProfession } from '@/db/schema';
import {
  CreateProfessionSchema,
  UpdateProfessionSchema,
} from '@/lib/zod/schemas/record-schema';
import { db } from '@/db';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { getErrorMessage } from '@/lib/handle-error';
import { eq, inArray } from 'drizzle-orm';

export async function createProfession(
  input: CreateProfessionSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsProfession)
      .values({
        ...input,
      })
      .returning({
        id: recordsProfession.id,
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

export async function deleteProfessions(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsProfession)
      .where(inArray(recordsProfession.id, input.ids));

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

export async function updateProfession(
  input: UpdateProfessionSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(recordsProfession)
      .set({
        ...input,
      })
      .where(eq(recordsProfession.id, input.id));

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
