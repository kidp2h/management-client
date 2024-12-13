'use server';
import { recordsSalary } from '@/db/schema';
import {
  CreateSalarySchema,
  UpdateSalarySchema,
} from '@/lib/zod/schemas/record-schema';
import { db } from '@/db';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { getErrorMessage } from '@/lib/handle-error';
import { eq, inArray } from 'drizzle-orm';

export async function createSalary(
  input: CreateSalarySchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsSalary)
      .values({
        ...input,
      })
      .returning({
        id: recordsSalary.id,
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

export async function deleteSalaries(input: { ids: string[] }) {
  try {
    await db.delete(recordsSalary).where(inArray(recordsSalary.id, input.ids));

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

export async function updateSalary(input: UpdateSalarySchema & { id: string }) {
  noStore();
  // console.log(input);
  try {
    await db
      .update(recordsSalary)
      .set({
        ...input,
      })
      .where(eq(recordsSalary.id, input.id));

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
