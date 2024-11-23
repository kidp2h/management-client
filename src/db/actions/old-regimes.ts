'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { recordsOldRegime } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateOldRegimeSchema,
  UpdateOldRegimeSchema,
} from '@/lib/zod/schemas/record-schema';

export async function createOldRegimes(
  input: (CreateOldRegimeSchema & { recordId: string })[],
) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(recordsOldRegime)
      .values([...input])
      .returning({
        id: recordsOldRegime.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/records/old-regime');

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

export async function createOldRegime(
  input: CreateOldRegimeSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsOldRegime)
      .values({
        ...input,
      })
      .returning({
        id: recordsOldRegime.id,
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

export async function deleteOldRegime(input: { id: string }) {
  try {
    await db.delete(recordsOldRegime).where(eq(recordsOldRegime.id, input.id));

    revalidatePath('/records/old-regime');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteOldRegimes(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsOldRegime)
      .where(inArray(recordsOldRegime.id, input.ids));

    revalidatePath('/records/old-regime');

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

export async function updateOldRegime(
  input: UpdateOldRegimeSchema & { id: string },
) {
  noStore();
  const { id, ...rest } = input;
  try {
    await db
      .update(recordsOldRegime)
      .set({
        ...rest,
      })
      .where(eq(recordsOldRegime.id, id));

    revalidatePath('/records/old-regime');

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
