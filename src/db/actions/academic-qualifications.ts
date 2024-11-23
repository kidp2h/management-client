'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { academicQualifications } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateAcademicQualificationSchema,
  UpdateAcademicQualificationSchema,
} from '@/lib/zod/schemas/academic-qualification-schema';

export async function createAcademicQualification(
  input: CreateAcademicQualificationSchema,
) {
  noStore();
  try {
    await db
      .insert(academicQualifications)
      .values({
        code: `ACQ${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: academicQualifications.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/academic-qualifications');

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

export async function deleteAcademicQualification(input: { id: string }) {
  try {
    await db
      .delete(academicQualifications)
      .where(eq(academicQualifications.id, input.id));

    revalidatePath('/academic-qualifications');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteAcademicQualifications(input: { ids: string[] }) {
  try {
    await db
      .delete(academicQualifications)
      .where(inArray(academicQualifications.id, input.ids));

    revalidatePath('/academic-qualifications');

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

export async function updateAcademicQualification(
  input: UpdateAcademicQualificationSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(academicQualifications)
      .set({
        name: input.name,
      })
      .where(eq(academicQualifications.id, input.id));

    revalidatePath('/academic-qualifications');

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
