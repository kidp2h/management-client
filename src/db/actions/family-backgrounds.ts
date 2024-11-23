'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { familyBackgrounds } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateFamilyBackgroundSchema,
  UpdateFamilyBackgroundSchema,
} from '@/lib/zod/schemas/family-background-schema';

export async function createFamilyBackground(
  input: CreateFamilyBackgroundSchema,
) {
  noStore();
  try {
    await db
      .insert(familyBackgrounds)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: familyBackgrounds.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/family-backgrounds');

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

export async function deleteFamilyBackground(input: { id: string }) {
  try {
    await db
      .delete(familyBackgrounds)
      .where(eq(familyBackgrounds.id, input.id));

    revalidatePath('/family-backgrounds');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteFamilyBackgrounds(input: { ids: string[] }) {
  try {
    await db
      .delete(familyBackgrounds)
      .where(inArray(familyBackgrounds.id, input.ids));

    revalidatePath('/family-backgrounds');

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

export async function updateFamilyBackground(
  input: UpdateFamilyBackgroundSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(familyBackgrounds)
      .set({
        name: input.name,
      })
      .where(eq(familyBackgrounds.id, input.id));

    revalidatePath('/family-backgrounds');

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
