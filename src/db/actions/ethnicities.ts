'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { ethnicities } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateEthnicitySchema,
  UpdateEthnicitySchema,
} from '@/lib/zod/schemas/ethnicity-schema';

export async function createEthnicity(input: CreateEthnicitySchema) {
  noStore();
  try {
    await db
      .insert(ethnicities)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: ethnicities.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/ethnicities');

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

export async function deleteEthnicity(input: { id: string }) {
  try {
    await db.delete(ethnicities).where(eq(ethnicities.id, input.id));

    revalidatePath('/ethnicities');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteEthnicities(input: { ids: string[] }) {
  try {
    await db.delete(ethnicities).where(inArray(ethnicities.id, input.ids));

    revalidatePath('/ethnicities');

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

export async function updateEthnicity(
  input: UpdateEthnicitySchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(ethnicities)
      .set({
        name: input.name,
      })
      .where(eq(ethnicities.id, input.id));

    revalidatePath('/ethnicities');

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
