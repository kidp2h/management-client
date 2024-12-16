'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { recordsDual } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateDualSchema,
  UpdateDualSchema,
} from '@/lib/zod/schemas/record-schema';

export async function createDuals(
  input: (CreateDualSchema & { recordId: string })[],
) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(recordsDual)
      .values([...input])
      .returning({
        id: recordsDual.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/records/duals');

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

export async function createDual(
  input: CreateDualSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsDual)
      .values({
        ...input,
      })
      .returning({
        id: recordsDual.id,
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

export async function deleteDual(input: { id: string }) {
  try {
    await db.delete(recordsDual).where(eq(recordsDual.id, input.id));

    revalidatePath('/records/duals');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteDuals(input: { ids: string[] }) {
  try {
    await db.delete(recordsDual).where(inArray(recordsDual.id, input.ids));

    revalidatePath('/records/duals');

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

export async function updateDual(input: UpdateDualSchema & { id: string }) {
  noStore();
  const { id, ...rest } = input;
  try {
    await db
      .update(recordsDual)
      .set({
        ...rest,
      })
      .where(eq(recordsDual.id, input.id));

    revalidatePath('/records/duals');

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
