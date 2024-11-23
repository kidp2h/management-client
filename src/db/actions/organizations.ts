'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { recordsOrganization } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateOrganizationSchema,
  UpdateOrganizationSchema,
} from '@/lib/zod/schemas/record-schema';

export async function createOrganizations(
  input: (CreateOrganizationSchema & { recordId: string })[],
) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(recordsOrganization)
      .values([...input])
      .returning({
        id: recordsOrganization.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/records/organizations');

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    console.log(err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function createOrganization(
  input: CreateOrganizationSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsOrganization)
      .values({
        ...input,
      })
      .returning({
        id: recordsOrganization.id,
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

export async function deleteOrganization(input: { id: string }) {
  try {
    await db
      .delete(recordsOrganization)
      .where(eq(recordsOrganization.id, input.id));

    revalidatePath('/records/organizations');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteOrganizations(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsOrganization)
      .where(inArray(recordsOrganization.id, input.ids));

    revalidatePath('/records/organizations');

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

export async function updateOrganization(
  input: UpdateOrganizationSchema & { id: string },
) {
  noStore();
  const { id, ...rest } = input;
  try {
    await db
      .update(recordsOrganization)
      .set({
        ...rest,
      })
      .where(eq(recordsOrganization.id, input.id));

    revalidatePath('/records/organizations');

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
