'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { qualifications } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateQualificationSchema,
  UpdateQualificationSchema,
} from '@/lib/zod/schemas/qualification-schema';

export async function createQualification(input: CreateQualificationSchema) {
  noStore();
  try {
    await db
      .insert(qualifications)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: qualifications.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/qualifications');

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

export async function deleteQualification(input: { id: string }) {
  try {
    await db.delete(qualifications).where(eq(qualifications.id, input.id));

    revalidatePath('/qualifications');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteQualifications(input: { ids: string[] }) {
  try {
    await db
      .delete(qualifications)
      .where(inArray(qualifications.id, input.ids));

    revalidatePath('/qualifications');

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

export async function updateQualification(
  input: UpdateQualificationSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(qualifications)
      .set({
        name: input.name,
      })
      .where(eq(qualifications.id, input.id));

    revalidatePath('/qualifications');

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
