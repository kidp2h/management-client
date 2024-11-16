'use server';
import { recordsAllowance } from '@/db/schema';
import {
  CreateAllowanceSchema,
  UpdateAllowanceSchema,
} from '@/lib/zod/schemas/record-schema';
import { db } from '@/db';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { getErrorMessage } from '@/lib/handle-error';
import { eq, inArray } from 'drizzle-orm';

export async function createAllowance(
  input: CreateAllowanceSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsAllowance)
      .values({
        ...input,
      })
      .returning({
        id: recordsAllowance.id,
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

export async function deleteAllowances(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsAllowance)
      .where(inArray(recordsAllowance.id, input.ids));

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

export async function updateAllowance(
  input: UpdateAllowanceSchema & { id: string },
) {
  noStore();

  try {
    await db
      .update(recordsAllowance)
      .set({
        ...input,
      })
      .where(eq(recordsAllowance.id, input.id));

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
