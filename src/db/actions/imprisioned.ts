'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { recordsImprisioned } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateImprisionedSchema,
  UpdateImprisionedSchema,
} from '@/lib/zod/schemas/record-schema';

export async function createImprisioneds(
  input: (CreateImprisionedSchema & { recordId: string })[],
) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(recordsImprisioned)
      .values([...input])
      .returning({
        id: recordsImprisioned.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/records/imprisioned');

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

export async function createImprisioned(
  input: CreateImprisionedSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsImprisioned)
      .values({
        ...input,
      })
      .returning({
        id: recordsImprisioned.id,
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

export async function deleteImprisioned(input: { id: string }) {
  try {
    await db
      .delete(recordsImprisioned)
      .where(eq(recordsImprisioned.id, input.id));

    revalidatePath('/records/imprisioned');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteImprisioneds(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsImprisioned)
      .where(inArray(recordsImprisioned.id, input.ids));

    revalidatePath('/records/imprisioned');

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

export async function updateImprisioned(
  input: UpdateImprisionedSchema & { id: string },
) {
  noStore();
  const { id, ...rest } = input;
  try {
    await db
      .update(recordsImprisioned)
      .set({
        ...rest,
      })
      .where(eq(recordsImprisioned.id, id));

    revalidatePath('/records/imprisioned');

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
