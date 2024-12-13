'use server';

import { and, eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import {
  records,
  recordsDepartments,
  recordsMobilization,
} from '@/db/schema';
import { getErrorMessage } from '@/lib/handle-error';
import {
  acceptMobilizationSchema,
  CreateMobilizationRecordSchema,
} from '@/lib/zod/schemas/record-schema';
import { z } from 'zod';

export async function createMobilization(
  input: CreateMobilizationRecordSchema & { recordId: string },
) {
  noStore();
  try {
    await db
      .insert(recordsMobilization)
      .values({
        ...input,
      })
      .returning({
        id: recordsMobilization.id,
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

export async function deleteMobilization(input: { id: string }) {
  try {
    await db
      .delete(recordsMobilization)
      .where(eq(recordsMobilization.id, input.id));
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
export async function acceptMobilization(
  input: z.infer<typeof acceptMobilizationSchema> & {
    id: string;
    recordId: string;
    fromDepartment: string;
  },
) {
  try {
    const result = [
      db
        .update(records)
        .set({
          civilServantRankId: input.civilServantRank,
          salaryGradeId: input.salaryGrade,
          dutyId: input.duty,
          dateOfEntilement: input.dateSalary,
        })
        .where(eq(records.id, input.recordId)),
      db
        .delete(recordsMobilization)
        .where(eq(recordsMobilization.id, input.id)),
      db
        .update(recordsDepartments)
        .set({
          departmentId: input.department,
        })
        .where(
          and(
            eq(recordsDepartments.recordId, input.recordId),
            eq(recordsDepartments.departmentId, input.fromDepartment),
          ),
        ),
    ];
    await Promise.all(result);
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

export async function deleteMobilizations(input: { ids: string[] }) {
  try {
    await db
      .delete(recordsMobilization)
      .where(inArray(recordsMobilization.id, input.ids));

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
