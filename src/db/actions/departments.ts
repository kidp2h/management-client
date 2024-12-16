'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { departments, recordsDepartments } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateDepartmentSchema,
  UpdateDepartmentSchema,
} from '@/lib/zod/schemas/department-schema';

export async function createDepartment(input: CreateDepartmentSchema) {
  noStore();
  try {
    await db
      .insert(departments)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
        parent: input.parent,
      })
      .returning({
        id: departments.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/departments');
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

export async function deleteDepartment(input: { id: string }) {
  try {
    await db.delete(departments).where(eq(departments.id, input.id));

    revalidatePath('/departments');
    revalidatePath('/records');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteDepartments(input: { ids: string[] }) {
  try {
    await db.delete(departments).where(inArray(departments.id, input.ids));

    revalidatePath('/departments');
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

export async function updateDepartment(
  input: UpdateDepartmentSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(departments)
      .set({
        name: input.name,
        parent: input.parent,
      })
      .where(eq(departments.id, input.id));

    revalidatePath('/departments');
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

export async function createRecordDepartment(
  recordId: string,
  departmentId: string,
) {
  console.log(recordId, departmentId);
  noStore();
  try {
    await db.insert(recordsDepartments).values({
      recordId,
      departmentId,
    });

    revalidatePath('/departments');
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
export async function deleteRecordsDepartment(id: string[]) {
  try {
    await db
      .delete(recordsDepartments)
      .where(inArray(recordsDepartments.id, id));

    revalidatePath('/departments');
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
