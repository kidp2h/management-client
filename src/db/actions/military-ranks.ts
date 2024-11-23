'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { militaryRanks } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateMilitaryRankSchema,
  UpdateMilitaryRankSchema,
} from '@/lib/zod/schemas/military-rank-schema';

export async function createMilitaryRank(input: CreateMilitaryRankSchema) {
  noStore();
  try {
    await db
      .insert(militaryRanks)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: militaryRanks.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/military-ranks');

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

export async function deleteMilitaryRank(input: { id: string }) {
  try {
    await db.delete(militaryRanks).where(eq(militaryRanks.id, input.id));

    revalidatePath('/military-ranks');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteMilitaryRanks(input: { ids: string[] }) {
  try {
    await db.delete(militaryRanks).where(inArray(militaryRanks.id, input.ids));

    revalidatePath('/military-ranks');

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

export async function updateMilitaryRank(
  input: UpdateMilitaryRankSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(militaryRanks)
      .set({
        name: input.name,
      })
      .where(eq(militaryRanks.id, input.id));

    revalidatePath('/military-ranks');

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
