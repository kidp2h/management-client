'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { formTrainings } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateFormTrainingSchema,
  UpdateFormTrainingSchema,
} from '@/lib/zod/schemas/form-training-schema';

export async function createFormTraining(input: CreateFormTrainingSchema) {
  noStore();
  try {
    await db
      .insert(formTrainings)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: formTrainings.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/form-trainings');

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

export async function deleteFormTraining(input: { id: string }) {
  try {
    await db.delete(formTrainings).where(eq(formTrainings.id, input.id));

    revalidatePath('/form-trainings');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteFormTrainings(input: { ids: string[] }) {
  try {
    await db.delete(formTrainings).where(inArray(formTrainings.id, input.ids));

    revalidatePath('/form-trainings');

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

export async function updateFormTraining(
  input: UpdateFormTrainingSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(formTrainings)
      .set({
        name: input.name,
      })
      .where(eq(formTrainings.id, input.id));

    revalidatePath('/form-trainings');

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
