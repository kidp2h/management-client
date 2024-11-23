'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { formRemarks } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateFormRemarkSchema,
  UpdateFormRemarkSchema,
} from '@/lib/zod/schemas/form-remark-schema';

export async function createFormRemark(input: CreateFormRemarkSchema) {
  noStore();
  try {
    await db
      .insert(formRemarks)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: formRemarks.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/form-remarks');

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

export async function deleteFormRemark(input: { id: string }) {
  try {
    await db.delete(formRemarks).where(eq(formRemarks.id, input.id));

    revalidatePath('/form-remarks');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteFormRemarks(input: { ids: string[] }) {
  try {
    await db.delete(formRemarks).where(inArray(formRemarks.id, input.ids));

    revalidatePath('/form-remarks');

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

export async function updateFormRemark(
  input: UpdateFormRemarkSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(formRemarks)
      .set({
        name: input.name,
      })
      .where(eq(formRemarks.id, input.id));

    revalidatePath('/form-remarks');

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
