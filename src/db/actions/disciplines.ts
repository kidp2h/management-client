'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { recordsDiscipline } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateDisciplineSchema,
  UpdateDisciplineSchema,
} from '@/lib/zod/schemas/record-schema';

export async function createDisciplines(
  input: (CreateDisciplineSchema & { recordId: string })[],
) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(recordsDiscipline)
      .values([...input])
      .returning({
        id: recordsDiscipline.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/records/disciplines');

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    console.log(err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function createDiscipline(
  input: CreateDisciplineSchema & { recordId: string },
) {
  noStore();
  console.log(input);
  try {
    await db
      .insert(recordsDiscipline)
      .values({
        ...input,
      })
      .returning({
        id: recordsDiscipline.id,
      });
    revalidatePath('/record');
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

export async function deleteDiscipline(input: { id: string }) {
  try {
    await db
      .delete(recordsDiscipline)
      .where(eq(recordsDiscipline.id, input.id));

    revalidatePath('/records/disciplines');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteDisciplines(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsDiscipline)
      .where(inArray(recordsDiscipline.id, input.ids));

    revalidatePath('/records/disciplines');

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

export async function updateDiscipline(
  input: UpdateDisciplineSchema & { id: string },
) {
  noStore();

  const { id, ...rest } = input;

  try {
    await db
      .update(recordsDiscipline)
      .set({
        ...rest,
      })
      .where(eq(recordsDiscipline.id, input.id));

    revalidatePath('/records/disciplines');

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
