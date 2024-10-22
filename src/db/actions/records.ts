'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { records } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateRecordSchema,
  UpdateRecordSchema,
} from '@/lib/zod/schemas/record-schema';

export async function createRecord(input: CreateRecordSchema) {
  noStore();
  try {
    // await db.transaction(async tx => {
    const data = await db
      .insert(records)
      .values({
        code: `R${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        fullName: input.fullName,
        religion: input.religion,
        birthday: input.birthday,
        rankId: input.rankId,
        englishCertification: input.englishCertification,
        technologyCertification: input.technologyCertification,
        bloodType: input.bloodType,
        isPartyMember: input.isPartyMember || false,
        degree: input.degree,
      })
      .returning({
        id: records.id,
        code: records.code,
      })
      .then(takeFirstOrThrow);
    revalidatePath('/records');

    return {
      data,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteRecord(input: { id: string }) {
  try {
    await db.delete(records).where(eq(records.id, input.id));

    revalidatePath('/records');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteRecords(input: { ids: string[] }) {
  try {
    await db.delete(records).where(inArray(records.id, input.ids));

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

export async function updateRecord(input: UpdateRecordSchema & { id: string }) {
  noStore();
  try {
    await db
      .update(records)
      .set({
        fullName: input.fullName,
        religion: input.religion,
        birthday: input.birthday,
        rankId: input.rankId,
        englishCertification: input.englishCertification,
        technologyCertification: input.technologyCertification,
        bloodType: input.bloodType,
        isPartyMember: input.isPartyMember,
        degree: input.degree,
      })
      .where(eq(records.id, input.id));

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
