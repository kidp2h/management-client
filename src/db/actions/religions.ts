'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { religions } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateReligionSchema,
  UpdateReligionSchema,
} from '@/lib/zod/schemas/religion-schema';

export async function createReligion(input: CreateReligionSchema) {
  noStore();
  try {
    await db
      .insert(religions)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: religions.id,
      })
      .then(takeFirstOrThrow);

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
