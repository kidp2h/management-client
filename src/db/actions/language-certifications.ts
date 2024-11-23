'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { languageCertifications } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateLanguageCertificationSchema,
  UpdateLanguageCertificationSchema,
} from '@/lib/zod/schemas/language-certification-schema';

export async function createLanguageCertification(
  input: CreateLanguageCertificationSchema,
) {
  noStore();
  try {
    await db
      .insert(languageCertifications)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: languageCertifications.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/language-certifications');

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

export async function deleteLanguageCertification(input: { id: string }) {
  try {
    await db
      .delete(languageCertifications)
      .where(eq(languageCertifications.id, input.id));

    revalidatePath('/language-certifications');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteLanguageCertifications(input: { ids: string[] }) {
  try {
    await db
      .delete(languageCertifications)
      .where(inArray(languageCertifications.id, input.ids));

    revalidatePath('/language-certifications');

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

export async function updateLanguageCertification(
  input: UpdateLanguageCertificationSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(languageCertifications)
      .set({
        name: input.name,
      })
      .where(eq(languageCertifications.id, input.id));

    revalidatePath('/language-certifications');

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
