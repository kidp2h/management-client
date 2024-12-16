'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { recordsSecondment } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateSecondmentSchema,
  UpdateSecondmentSchema,
} from '@/lib/zod/schemas/record-schema';

export async function createSecondments(
  input: (CreateSecondmentSchema & { recordId: string })[],
) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(recordsSecondment)
      .values([...input])
      .returning({
        id: recordsSecondment.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/records/secondments');

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    // console.log(err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function createSecondment(
  input: CreateSecondmentSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsSecondment)
      .values({
        ...input,
      })
      .returning({
        id: recordsSecondment.id,
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

export async function deleteSecondment(input: { id: string }) {
  try {
    await db
      .delete(recordsSecondment)
      .where(eq(recordsSecondment.id, input.id));

    revalidatePath('/records/secondments');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteSecondments(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsSecondment)
      .where(inArray(recordsSecondment.id, input.ids));

    revalidatePath('/records/secondments');

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

export async function updateSecondment(
  input: UpdateSecondmentSchema & { id: string },
) {
  noStore();
  const { id, ...rest } = input;
  try {
    await db
      .update(recordsSecondment)
      .set({
        ...rest,
      })
      .where(eq(recordsSecondment.id, input.id));

    revalidatePath('/records/secondments');

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
