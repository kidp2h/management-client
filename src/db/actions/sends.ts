'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import { recordsSend } from '@/db/schema';
import { getErrorMessage } from '@/lib/handle-error';
import { CreateSendRecordSchema } from '@/lib/zod/schemas/record-schema';

export async function createSend(
  input: CreateSendRecordSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsSend)
      .values({
        ...input,
      })
      .returning({
        id: recordsSend.id,
      });
    revalidatePath('/records');
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

export async function deleteSend(input: { id: string }) {
  try {
    await db.delete(recordsSend).where(eq(recordsSend.id, input.id));
    revalidatePath('/records');
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

export async function deleteSends(input: { ids: string[] }) {
  try {
    await db.delete(recordsSend).where(inArray(recordsSend.id, input.ids));

    revalidatePath('/records');

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
