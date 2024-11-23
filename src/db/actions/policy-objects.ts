'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { policyObjects } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreatePolicyObjectSchema,
  UpdatePolicyObjectSchema,
} from '@/lib/zod/schemas/policy-object-schema';

export async function createPolicyObject(input: CreatePolicyObjectSchema) {
  noStore();
  try {
    await db
      .insert(policyObjects)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: policyObjects.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/policy-objects');

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

export async function deletePolicyObject(input: { id: string }) {
  try {
    await db.delete(policyObjects).where(eq(policyObjects.id, input.id));

    revalidatePath('/policy-objects');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deletePolicyObjects(input: { ids: string[] }) {
  try {
    await db.delete(policyObjects).where(inArray(policyObjects.id, input.ids));

    revalidatePath('/policy-objects');

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

export async function updatePolicyObject(
  input: UpdatePolicyObjectSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(policyObjects)
      .set({
        name: input.name,
      })
      .where(eq(policyObjects.id, input.id));

    revalidatePath('/policy-objects');

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
