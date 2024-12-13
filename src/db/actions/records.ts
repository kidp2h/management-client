'use server';

import { and, eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import {
  records,
  recordsApprove,
  recordsContract,
  recordsDepartments,
  recordsIncreaseSalaryEarly,
  recordsIncreaseSalaryRegular,
  recordsRetirement,
} from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateContractSchema,
  CreateIncreaseSalaryEarlySchema,
  CreateIncreaseSalaryRegularSchema,
  ListRecordsRetireSchema,
  UpdateContractSchema,
  UpdateInformationRecordSchema,
} from '@/lib/zod/schemas/record-schema';
import { UploadedFile } from '@/types';

export async function createRecord(input: any) {
  noStore();
  try {
    const departments = input.departments;
    delete input.departments;
    // await db.transaction(async tx => {
    const data = await db
      .insert(records)
      .values({
        code: `R${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        ...input,
      })
      .returning({
        id: records.id,
        code: records.code,
      })
      .then(takeFirstOrThrow);
    console.log(departments);
    for (const department of departments) {
      await db.insert(recordsDepartments).values({
        recordId: data.id,
        departmentId: department,
      });
    }
    revalidatePath('/records');
    return {
      data,
      error: null,
    };
  } catch (err) {
    console.log('errne', err);
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
export async function deleteRecordsDepartment(input: {
  ids: string[];
  departmentId: string;
}) {
  try {
    await db
      .delete(recordsDepartments)
      .where(
        and(
          inArray(recordsDepartments.recordId, input.ids),
          eq(recordsDepartments.departmentId, input.departmentId),
        ),
      );

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

export async function updateRecord(input: Partial<any> & { id: string }) {
  noStore();
  console.log('input', input);
  try {
    await db
      .update(records)
      .set({
        // fullName: input.fullName,
        // religion: input.religion,
        // birthday: input.birthday,
        // ethnicity: input.ethnicity,
        // bloodType: input.bloodType,
        ...input,
      })
      .where(eq(records.id, input.id));

    revalidatePath('/records');

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
export async function createIncreaseSalaryRegular(
  input: CreateIncreaseSalaryRegularSchema & { recordId: string },
) {
  noStore();
  try {
    console.log('input ne', input);
    const data = await db.insert(recordsIncreaseSalaryRegular).values({
      ...input,
      recordId: input.recordId,
      preOverAllowance: input.preOverAllowance,
    });

    revalidatePath('/records');
    return {
      data,
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
export async function createIncreaseSalaryEarly(
  input: CreateIncreaseSalaryEarlySchema & { recordId: string },
) {
  noStore();
  try {
    console.log('input ne', input);
    const data = await db.insert(recordsIncreaseSalaryEarly).values({
      ...input,
      recordId: input.recordId,
    });

    revalidatePath('/records');
    return {
      data,
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
export async function updateInformationRecord(
  dirtyFields: any,
  defaultValues: any,
  input: Partial<UpdateInformationRecordSchema> & { id: string },
  files: UploadedFile[],
) {
  const urls = files.map(file => `${file.appUrl}|${file.name}`);
  noStore();
  const changes: any[] = [];
  const listFields = Object.keys(dirtyFields);

  for (const field of listFields) {
    changes.push({
      key: field,
      newValue: input?.[field],
      oldValue: defaultValues?.[field === '_province' ? 'province' : field],
    });
  }

  console.log(input, changes);
  // return;
  // console.log(defaultValues, 'defaultValues');
  try {
    let data: Record<string, any> = {
      ...input,

      hometown: `${input.hometownAddress}|${input.hometownWard}|${input.hometownDistrict}|${input.hometownProvince}`,
      currentResidence: `${input.address}|${input.ward}|${input.district}|${input.province}`,
      avatar: urls[0],
      province: input._province,
    };
    delete data._province;

    data = {
      ...data,
    };

    if (changes.length > 0) {
      const r = await db.insert(recordsApprove).values({
        data,
        changes,
        type: 'information',
        recordId: input.id,
      });
    }

    // console.log(input, data);

    revalidatePath('/record');

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
export async function approveRecordByData(id: string, data: any) {
  try {
    await db.delete(recordsApprove).where(eq(recordsApprove.id, id));
    const keys = Object.keys(data);
    for (const key of keys) {
      const item = data[key];
      console.log(typeof item);
      if (item && typeof item === 'string') {
        console.log(item);
        const splits = item?.split('.') || null;
        if (splits?.length > 1) {
          data[key] = splits[0];
        }
      }
    }
    console.log('update ne', data);
    // return;
    await db
      .update(records)
      .set({
        ...data,
      })
      .where(eq(records.id, data.id));
    revalidatePath('/approve');
    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: getErrorMessage(error),
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
  // console.log(input);
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
