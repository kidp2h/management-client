'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { religions } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateReligionSchema,
  UpdateReligionSchema,
} from '@/lib/zod/schemas/religions-schema';

export async function createReligion(input: CreateReligionSchema) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(religions)
      .values({
        code: input.code,
        name: input.name,
      })
      .returning({
        id: religions.id,
      })
      .then(takeFirstOrThrow);

    // Delete a task to keep the total number of tasks constant
    // await tx.delete(religions).where(
    //   eq(
    //     religions.id,
    //     (
    //       await tx
    //         .select({
    //           id: religions.id,
    //         })
    //         .from(religions)
    //         .limit(1)
    //         .where(not(eq(religions.id, newReligion.id)))
    //         .orderBy(asc(religions.createdAt))
    //         .then(takeFirstOrThrow)
    //     ).id,
    //   ),
    // );;

    revalidatePath('/religions');

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

export async function deleteReligion(input: { id: string }) {
  try {
    await db.delete(religions).where(eq(religions.id, input.id));

    revalidatePath('/religions');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteReligions(input: { ids: string[] }) {
  try {
    await db.delete(religions).where(inArray(religions.id, input.ids));

    revalidatePath('/religions');

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

export async function updateReligion(
  input: UpdateReligionSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(religions)
      .set({
        code: input.code,
        name: input.name,
      })
      .where(eq(religions.id, input.id));

    revalidatePath('/religions');

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
