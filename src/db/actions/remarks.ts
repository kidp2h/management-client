'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { recordsRemark } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateRemarkSchema,
  UpdateRemarkSchema,
} from '@/lib/zod/schemas/record-schema';

export async function createRemarks(
  input: (CreateRemarkSchema & { recordId: string })[],
) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(recordsRemark)
      .values([...input])
      .returning({
        id: recordsRemark.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/records/remarks');

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

export async function deleteRemark(input: { id: string }) {
  try {
    await db.delete(recordsRemark).where(eq(recordsRemark.id, input.id));

    revalidatePath('/records/remarks');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteRemarks(input: { ids: string[] }) {
  try {
    await db.delete(recordsRemark).where(inArray(recordsRemark.id, input.ids));

    revalidatePath('/records/remarks');

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

export async function updateRemark(input: UpdateRemarkSchema & { id: string }) {
  noStore();
  try {
    await db
      .update(recordsRemark)
      .set({
        ...input,
      })
      .where(eq(recordsRemark.id, input.id));

    revalidatePath('/records/remarks');

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
