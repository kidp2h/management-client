'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { partyCommittees } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreatePartyCommitteeSchema,
  UpdatePartyCommitteeSchema,
} from '@/lib/zod/schemas/party-committee-schema';

export async function createPartyCommittee(input: CreatePartyCommitteeSchema) {
  noStore();
  try {
    await db
      .insert(partyCommittees)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: partyCommittees.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/party-committees');

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

export async function deletePartyCommittee(input: { id: string }) {
  try {
    await db.delete(partyCommittees).where(eq(partyCommittees.id, input.id));

    revalidatePath('/party-committees');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deletePartyCommittees(input: { ids: string[] }) {
  try {
    await db
      .delete(partyCommittees)
      .where(inArray(partyCommittees.id, input.ids));

    revalidatePath('/party-committees');

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

export async function updatePartyCommittee(
  input: UpdatePartyCommitteeSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(partyCommittees)
      .set({
        name: input.name,
      })
      .where(eq(partyCommittees.id, input.id));

    revalidatePath('/party-committees');

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
