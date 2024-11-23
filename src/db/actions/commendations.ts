'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { recordsCommendation } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateCommendationSchema,
  UpdateCommendationSchema,
} from '@/lib/zod/schemas/record-schema';

export async function createCommendations(
  input: (CreateCommendationSchema & { recordId: string })[],
) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(recordsCommendation)
      .values([...input])
      .returning({
        id: recordsCommendation.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/records/commendations');

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    console.log(err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function createCommendation(
  input: CreateCommendationSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsCommendation)
      .values({
        ...input,
      })
      .returning({
        id: recordsCommendation.id,
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

export async function deleteCommendation(input: { id: string }) {
  try {
    await db
      .delete(recordsCommendation)
      .where(eq(recordsCommendation.id, input.id));

    revalidatePath('/records/commendations');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteCommendations(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsCommendation)
      .where(inArray(recordsCommendation.id, input.ids));

    revalidatePath('/records/commendations');

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

export async function updateCommendation(
  input: UpdateCommendationSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(recordsCommendation)
      .set({
        award: input.award,
        year: input.year,
      })
      .where(eq(recordsCommendation.id, input.id));

    revalidatePath('/records/commendations');

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
