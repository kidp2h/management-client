'use server';
import { recordsRelationship } from '@/db/schema';
import {
  CreateRelationshipSchema,
  UpdateRelationshipSchema,
} from '@/lib/zod/schemas/record-schema';
import { db } from '@/db';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { getErrorMessage } from '@/lib/handle-error';
import { eq, inArray } from 'drizzle-orm';

export async function createRelationship(
  input: CreateRelationshipSchema & { recordId: string; type: string },
) {
  noStore();
  try {
    await db
      .insert(recordsRelationship)
      .values({
        ...input,
      })
      .returning({
        id: recordsRelationship.id,
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

export async function deleteRelationships(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsRelationship)
      .where(inArray(recordsRelationship.id, input.ids));

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

export async function updateRelationship(
  input: UpdateRelationshipSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(recordsRelationship)
      .set({
        ...input,
      })
      .where(eq(recordsRelationship.id, input.id));

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
