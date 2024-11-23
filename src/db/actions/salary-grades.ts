'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { salaryGrades } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateSalaryGradeSchema,
  UpdateSalaryGradeSchema,
} from '@/lib/zod/schemas/salary-grade-schema';

export async function createSalaryGrade(input: CreateSalaryGradeSchema) {
  noStore();
  try {
    await db
      .insert(salaryGrades)
      .values({
        code: `SLG${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: salaryGrades.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/salary-grades');

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

export async function deleteSalaryGrade(input: { id: string }) {
  try {
    await db.delete(salaryGrades).where(eq(salaryGrades.id, input.id));

    revalidatePath('/salary-grades');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteSalaryGrades(input: { ids: string[] }) {
  try {
    await db.delete(salaryGrades).where(inArray(salaryGrades.id, input.ids));

    revalidatePath('/salary-grades');

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

export async function updateSalaryGrade(
  input: UpdateSalaryGradeSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(salaryGrades)
      .set({
        name: input.name,
      })
      .where(eq(salaryGrades.id, input.id));

    revalidatePath('/salary-grades');

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
