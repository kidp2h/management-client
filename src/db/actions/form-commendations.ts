'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { formCommendations } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateFormCommendationSchema,
  UpdateFormCommendationSchema,
} from '@/lib/zod/schemas/form-commendation-schema';

export async function createFormCommendation(
  input: CreateFormCommendationSchema,
) {
  noStore();
  try {
    await db
      .insert(formCommendations)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: formCommendations.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/form-commendations');

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

export async function deleteFormCommendation(input: { id: string }) {
  try {
    await db
      .delete(formCommendations)
      .where(eq(formCommendations.id, input.id));

    revalidatePath('/form-commendations');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteFormCommendations(input: { ids: string[] }) {
  try {
    await db
      .delete(formCommendations)
      .where(inArray(formCommendations.id, input.ids));

    revalidatePath('/form-commendations');

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

export async function updateFormCommendation(
  input: UpdateFormCommendationSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(formCommendations)
      .set({
        name: input.name,
      })
      .where(eq(formCommendations.id, input.id));

    revalidatePath('/form-commendations');

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
