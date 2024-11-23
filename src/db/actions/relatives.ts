'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { recordsRelative } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateRelativeSchema,
  UpdateRelativeSchema,
} from '@/lib/zod/schemas/record-schema';

export async function createRelatives(
  input: (CreateRelativeSchema & { recordId: string })[],
) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(recordsRelative)
      .values([...input])
      .returning({
        id: recordsRelative.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/records/relatives');

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

export async function createRelative(
  input: CreateRelativeSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsRelative)
      .values({
        ...input,
      })
      .returning({
        id: recordsRelative.id,
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

export async function deleteRelative(input: { id: string }) {
  try {
    await db.delete(recordsRelative).where(eq(recordsRelative.id, input.id));

    revalidatePath('/records/relatives');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteRelatives(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsRelative)
      .where(inArray(recordsRelative.id, input.ids));

    revalidatePath('/records/relatives');

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

export async function updateRelative(
  input: UpdateRelativeSchema & { id: string },
) {
  noStore();
  const { id, ...rest } = input;
  try {
    await db
      .update(recordsRelative)
      .set({
        ...rest,
      })
      .where(eq(recordsRelative.id, input.id));

    revalidatePath('/records/relatives');

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
