'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { ranks } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateRankSchema,
  UpdateRankSchema,
} from '@/lib/zod/schemas/rank-schema';

export async function createRank(input: CreateRankSchema) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(ranks)
      .values({
        code: input.code,
        name: input.name,
      })
      .returning({
        id: ranks.id,
      })
      .then(takeFirstOrThrow);

    // Delete a task to keep the total number of tasks constant
    // await tx.delete(ranks).where(
    //   eq(
    //     ranks.id,
    //     (
    //       await tx
    //         .select({
    //           id: ranks.id,
    //         })
    //         .from(ranks)
    //         .limit(1)
    //         .where(not(eq(ranks.id, newRank.id)))
    //         .orderBy(asc(ranks.createdAt))
    //         .then(takeFirstOrThrow)
    //     ).id,
    //   ),
    // );;

    revalidatePath('/ranks');

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

export async function deleteRank(input: { id: string }) {
  try {
    await db.delete(ranks).where(eq(ranks.id, input.id));

    revalidatePath('/ranks');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteRanks(input: { ids: string[] }) {
  try {
    await db.delete(ranks).where(inArray(ranks.id, input.ids));

    revalidatePath('/ranks');

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

export async function updateRank(input: UpdateRankSchema & { id: string }) {
  noStore();
  try {
    await db
      .update(ranks)
      .set({
        code: input.code,
        name: input.name,
      })
      .where(eq(ranks.id, input.id));

    revalidatePath('/ranks');

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
