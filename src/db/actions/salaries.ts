'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { salaries } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateSalarySchema,
  UpdateSalarySchema,
} from '@/lib/zod/schemas/salary-schema';

export async function createSalary(input: CreateSalarySchema) {
  noStore();
  try {
    await db
      .insert(salaries)
      .values({
        ...input,
        code: `SLR${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        rank: input.rank.toString(),
      })
      .returning({
        id: salaries.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/salaries');

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

export async function deleteSalary(input: { id: string }) {
  try {
    await db.delete(salaries).where(eq(salaries.id, input.id));

    revalidatePath('/salaries');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteSalaries(input: { ids: string[] }) {
  try {
    await db.delete(salaries).where(inArray(salaries.id, input.ids));

    revalidatePath('/salaries');

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

export async function updateSalary(input: UpdateSalarySchema & { id: string }) {
  noStore();
  try {
    await db
      .update(salaries)
      .set({
        ...input,
        rank: input.rank.toString(),
      })
      .where(eq(salaries.id, input.id));

    revalidatePath('/salaries');

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
