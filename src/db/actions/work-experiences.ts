'use server';
import { recordsWorkExperience } from '@/db/schema';
import {
  CreateWorkExperienceSchema,
  UpdateWorkExperienceSchema,
} from '@/lib/zod/schemas/record-schema';
import { db } from '@/db';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { getErrorMessage } from '@/lib/handle-error';
import { eq, inArray } from 'drizzle-orm';

export async function createWorkExperience(
  input: CreateWorkExperienceSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsWorkExperience)
      .values({
        ...input,
      })
      .returning({
        id: recordsWorkExperience.id,
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

export async function deleteWorkExperiences(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsWorkExperience)
      .where(inArray(recordsWorkExperience.id, input.ids));

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

export async function updateWorkExperience(
  input: UpdateWorkExperienceSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(recordsWorkExperience)
      .set({
        ...input,
      })
      .where(eq(recordsWorkExperience.id, input.id));

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
