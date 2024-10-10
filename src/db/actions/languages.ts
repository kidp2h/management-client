'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { languages } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateLanguageSchema,
  UpdateLanguageSchema,
} from '@/lib/zod/schemas/language-schema';

export async function createLanguage(input: CreateLanguageSchema) {
  noStore();
  try {
    await db
      .insert(languages)
      .values({
        code: input.code,
        name: input.name,
      })
      .returning({
        id: languages.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/languages');

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
    await db.delete(languages).where(eq(languages.id, input.id));

    revalidatePath('/languages');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteLanguages(input: { ids: string[] }) {
  try {
    await db.delete(languages).where(inArray(languages.id, input.ids));

    revalidatePath('/languages');

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
  try {
    await db
      .update(languages)
      .set({
        code: input.code,
        name: input.name,
      })
      .where(eq(languages.id, input.id));

    revalidatePath('/languages');

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
