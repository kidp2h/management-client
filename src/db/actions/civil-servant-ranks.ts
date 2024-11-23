'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { civilServantRanks } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateCivilServantRankSchema,
  UpdateCivilServantRankSchema,
} from '@/lib/zod/schemas/civil-servant-rank-schema';

export async function createCivilServantRank(
  input: CreateCivilServantRankSchema,
) {
  noStore();
  try {
    await db
      .insert(civilServantRanks)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: civilServantRanks.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/civil-servant-ranks');

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

export async function deleteCivilServantRank(input: { id: string }) {
  try {
    await db
      .delete(civilServantRanks)
      .where(eq(civilServantRanks.id, input.id));

    revalidatePath('/civil-servant-ranks');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteCivilServantRanks(input: { ids: string[] }) {
  try {
    await db
      .delete(civilServantRanks)
      .where(inArray(civilServantRanks.id, input.ids));

    revalidatePath('/civil-servant-ranks');

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

export async function updateCivilServantRank(
  input: UpdateCivilServantRankSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(civilServantRanks)
      .set({
        name: input.name,
      })
      .where(eq(civilServantRanks.id, input.id));

    revalidatePath('/civil-servant-ranks');

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
