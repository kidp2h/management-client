'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { formRetires } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateFormRetireSchema,
  UpdateFormRetireSchema,
} from '@/lib/zod/schemas/form-retire-schema';

export async function createFormRetire(input: CreateFormRetireSchema) {
  noStore();
  try {
    await db
      .insert(formRetires)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: formRetires.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/form-retires');

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

export async function deleteFormRetire(input: { id: string }) {
  try {
    await db.delete(formRetires).where(eq(formRetires.id, input.id));

    revalidatePath('/form-retires');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteFormRetires(input: { ids: string[] }) {
  try {
    await db.delete(formRetires).where(inArray(formRetires.id, input.ids));

    revalidatePath('/form-retires');

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

export async function updateFormRetire(
  input: UpdateFormRetireSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(formRetires)
      .set({
        name: input.name,
      })
      .where(eq(formRetires.id, input.id));

    revalidatePath('/form-retires');

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
