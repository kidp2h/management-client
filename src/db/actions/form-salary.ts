'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { formSalary } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateFormSalarySchema,
  UpdateFormSalarySchema,
} from '@/lib/zod/schemas/form-salary-schema';

export async function createFormSalary(input: CreateFormSalarySchema) {
  noStore();
  try {
    await db
      .insert(formSalary)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: formSalary.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/form-salary');

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

export async function deleteFormSalary(input: { id: string }) {
  try {
    await db.delete(formSalary).where(eq(formSalary.id, input.id));

    revalidatePath('/form-salary');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteFormSalaries(input: { ids: string[] }) {
  try {
    await db.delete(formSalary).where(inArray(formSalary.id, input.ids));

    revalidatePath('/form-salary');

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

export async function updateFormSalary(
  input: UpdateFormSalarySchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(formSalary)
      .set({
        name: input.name,
      })
      .where(eq(formSalary.id, input.id));

    revalidatePath('/form-salary');

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
