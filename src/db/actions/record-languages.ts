'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { recordsLanguages } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateLanguageSchema,
  UpdateLanguageSchema,
} from '@/lib/zod/schemas/record-schema';

export async function createLanguages(
  input: (CreateLanguageSchema & { recordId: string })[],
) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(recordsLanguages)
      .values([...input])
      .returning({
        id: recordsLanguages.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/records/languages');

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    // console.log(err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function createLanguage(
  input: CreateLanguageSchema & { recordId: string },
) {
  noStore();
  // console.log(input);
  try {
    await db
      .insert(recordsLanguages)
      .values({
        ...input,
      })
      .returning({
        id: recordsLanguages.id,
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

export async function deleteLanguage(input: { id: string }) {
  try {
    await db.delete(recordsLanguages).where(eq(recordsLanguages.id, input.id));

    revalidatePath('/records/languages');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteLanguages(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsLanguages)
      .where(inArray(recordsLanguages.id, input.ids));

    revalidatePath('/records/languages');

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

export async function updateLanguage(
  input: UpdateLanguageSchema & { id: string },
) {
  noStore();

  const { id, ...rest } = input;

  try {
    await db
      .update(recordsLanguages)
      .set({
        ...rest,
      })
      .where(eq(recordsLanguages.id, input.id));

    revalidatePath('/records/languages');

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
