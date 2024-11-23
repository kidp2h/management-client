'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { duties } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateDutySchema,
  UpdateDutySchema,
} from '@/lib/zod/schemas/duty-schema';

export async function createDuty(input: CreateDutySchema) {
  noStore();
  try {
    await db
      .insert(duties)
      .values({
        code: `DTS${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: duties.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/duties');

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

export async function deleteDuty(input: { id: string }) {
  try {
    await db.delete(duties).where(eq(duties.id, input.id));

    revalidatePath('/duties');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteDuties(input: { ids: string[] }) {
  try {
    await db.delete(duties).where(inArray(duties.id, input.ids));

    revalidatePath('/duties');

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

export async function updateDuty(input: UpdateDutySchema & { id: string }) {
  noStore();
  try {
    await db
      .update(duties)
      .set({
        name: input.name,
      })
      .where(eq(duties.id, input.id));

    revalidatePath('/duties');

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
