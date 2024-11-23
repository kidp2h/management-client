'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { positions } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreatePositionSchema,
  UpdatePositionSchema,
} from '@/lib/zod/schemas/position-schema';

export async function createPosition(input: CreatePositionSchema) {
  noStore();
  try {
    await db
      .insert(positions)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: positions.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/positions');

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

export async function deletePosition(input: { id: string }) {
  try {
    await db.delete(positions).where(eq(positions.id, input.id));

    revalidatePath('/positions');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deletePositions(input: { ids: string[] }) {
  try {
    await db.delete(positions).where(inArray(positions.id, input.ids));

    revalidatePath('/positions');

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

export async function updatePosition(
  input: UpdatePositionSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(positions)
      .set({
        name: input.name,
      })
      .where(eq(positions.id, input.id));

    revalidatePath('/positions');

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
