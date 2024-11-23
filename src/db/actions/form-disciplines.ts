'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { formDisciplines } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateFormDisciplineSchema,
  UpdateFormDisciplineSchema,
} from '@/lib/zod/schemas/form-discipline-schema';

export async function createFormDiscipline(input: CreateFormDisciplineSchema) {
  noStore();
  try {
    await db
      .insert(formDisciplines)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: formDisciplines.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/form-disciplines');

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

export async function deleteFormDiscipline(input: { id: string }) {
  try {
    await db.delete(formDisciplines).where(eq(formDisciplines.id, input.id));

    revalidatePath('/form-disciplines');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteFormDisciplines(input: { ids: string[] }) {
  try {
    await db
      .delete(formDisciplines)
      .where(inArray(formDisciplines.id, input.ids));

    revalidatePath('/form-disciplines');

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

export async function updateFormDiscipline(
  input: UpdateFormDisciplineSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(formDisciplines)
      .set({
        name: input.name,
      })
      .where(eq(formDisciplines.id, input.id));

    revalidatePath('/form-disciplines');

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
