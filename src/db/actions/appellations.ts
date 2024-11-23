'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { appellations } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateAppellationSchema,
  UpdateAppellationSchema,
} from '@/lib/zod/schemas/appellation-schema';

export async function createAppellation(input: CreateAppellationSchema) {
  noStore();
  try {
    await db
      .insert(appellations)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: appellations.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/appellations');

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

export async function deleteAppellation(input: { id: string }) {
  try {
    await db.delete(appellations).where(eq(appellations.id, input.id));

    revalidatePath('/appellations');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteAppellations(input: { ids: string[] }) {
  try {
    await db.delete(appellations).where(inArray(appellations.id, input.ids));

    revalidatePath('/appellations');

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

export async function updateAppellation(
  input: UpdateAppellationSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(appellations)
      .set({
        name: input.name,
      })
      .where(eq(appellations.id, input.id));

    revalidatePath('/appellations');

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
