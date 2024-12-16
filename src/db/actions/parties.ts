'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { recordsParty } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreatePartySchema,
  UpdatePartySchema,
} from '@/lib/zod/schemas/record-schema';

export async function createParties(
  input: (CreatePartySchema & { recordId: string })[],
) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(recordsParty)
      .values([...input])
      .returning({
        id: recordsParty.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/records/parties');

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    // console.log(err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function createParty(
  input: CreatePartySchema & { recordId: string },
) {
  noStore();
  // console.log(input);
  try {
    await db
      .insert(recordsParty)
      .values({
        ...input,
      })
      .returning({
        id: recordsParty.id,
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

export async function deleteParty(input: { id: string }) {
  try {
    await db.delete(recordsParty).where(eq(recordsParty.id, input.id));

    revalidatePath('/records/parties');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteParties(input: { ids: string[] }) {
  try {
    await db.delete(recordsParty).where(inArray(recordsParty.id, input.ids));

    revalidatePath('/records/parties');

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

export async function updateParty(input: UpdatePartySchema & { id: string }) {
  noStore();

  const { id, ...rest } = input;

  try {
    await db
      .update(recordsParty)
      .set({
        ...rest,
      })
      .where(eq(recordsParty.id, input.id));

    revalidatePath('/records/parties');

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
