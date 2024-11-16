'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { records, recordsContract, recordsRetirement } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateContractSchema,
  CreateRecordSchema,
  ListRecordsRetireSchema,
  UpdateContractSchema,
  UpdateInformationRecordSchema,
  UpdateRecordSchema,
} from '@/lib/zod/schemas/record-schema';

export async function createRecord(input: Partial<CreateRecordSchema>) {
  noStore();
  try {
    // await db.transaction(async tx => {
    const data = await db
      .insert(records)
      .values({
        code: `R${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        rankId: input.rankId,
        ...input,
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

export async function listRecordsRetire(
  input: ListRecordsRetireSchema & { ids: string[] },
) {
  try {
    await db.insert(recordsRetirement).values(
      input.ids.map(id => ({
        recordId: id,
        retirementType: input.retirementType,
        decisionNumber: input.decisionNumber,
        retireDate: input.retireDate,
      })),
    );

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

export async function updateRecord(
  input: Partial<UpdateRecordSchema> & { id: string },
) {
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
        ...input,
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

export async function updateInformationRecord(
  input: Partial<UpdateInformationRecordSchema> & { id: string },
) {
  noStore();
  try {
    const data = {
      ...input,
      hometown: `${input.hometownAddress}|${input.hometownWard}|${input.hometownDistrict}|${input.hometownProvince}`,
      birthPlace: `${input.address}|${input.ward}|${input.district}|${input.province}`,
    };
    console.log(input, data);
    await db
      .update(records)
      .set({ ...data })
      .where(eq(records.id, input.id));

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

export async function createContract(
  input: CreateContractSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsContract)
      .values({
        ...input,
      })
      .returning({
        id: recordsContract.id,
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

export async function deleteContracts(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsContract)
      .where(inArray(recordsContract.id, input.ids));

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

export async function updateContract(
  input: UpdateContractSchema & { id: string },
) {
  noStore();
  console.log(input);
  try {
    await db
      .update(recordsContract)
      .set({
        ...input,
      })
      .where(eq(recordsContract.id, input.id));

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
