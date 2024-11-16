'use server';
import { recordsTraining } from '@/db/schema';
import {
  CreateTrainingSchema,
  UpdateTrainingSchema,
} from '@/lib/zod/schemas/record-schema';
import { db } from '@/db';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { getErrorMessage } from '@/lib/handle-error';
import { eq, inArray } from 'drizzle-orm';

export async function createTraining(
  input: CreateTrainingSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsTraining)
      .values({
        ...input,
      })
      .returning({
        id: recordsTraining.id,
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

export async function deleteTrainings(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsTraining)
      .where(inArray(recordsTraining.id, input.ids));

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

export async function updateTraining(
  input: UpdateTrainingSchema & { id: string },
) {
  noStore();
  console.log(input);
  try {
    await db
      .update(recordsTraining)
      .set({
        ...input,
      })
      .where(eq(recordsTraining.id, input.id));

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
