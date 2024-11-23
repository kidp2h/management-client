'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { formRecruitments } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateFormRecruitmentSchema,
  UpdateFormRecruitmentSchema,
} from '@/lib/zod/schemas/form-recruitment-schema';

export async function createFormRecruitment(
  input: CreateFormRecruitmentSchema,
) {
  noStore();
  try {
    await db
      .insert(formRecruitments)
      .values({
        code: `FRC${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: formRecruitments.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/form-recruitments');

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

export async function deleteFormRecruitment(input: { id: string }) {
  try {
    await db.delete(formRecruitments).where(eq(formRecruitments.id, input.id));

    revalidatePath('/form-recruitments');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteFormRecruitments(input: { ids: string[] }) {
  try {
    await db
      .delete(formRecruitments)
      .where(inArray(formRecruitments.id, input.ids));

    revalidatePath('/form-recruitments');

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

export async function updateFormRecruitment(
  input: UpdateFormRecruitmentSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(formRecruitments)
      .set({
        name: input.name,
      })
      .where(eq(formRecruitments.id, input.id));

    revalidatePath('/form-recruitments');

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
