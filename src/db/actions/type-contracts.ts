'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { typeContracts } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateTypeContractSchema,
  UpdateTypeContractSchema,
} from '@/lib/zod/schemas/type-contract-schema';

export async function createTypeContract(input: CreateTypeContractSchema) {
  noStore();
  try {
    await db
      .insert(typeContracts)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: typeContracts.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/type-contracts');

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

export async function deleteTypeContract(input: { id: string }) {
  try {
    await db.delete(typeContracts).where(eq(typeContracts.id, input.id));

    revalidatePath('/type-contracts');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteTypeContracts(input: { ids: string[] }) {
  try {
    await db.delete(typeContracts).where(inArray(typeContracts.id, input.ids));

    revalidatePath('/type-contracts');

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

export async function updateTypeContract(
  input: UpdateTypeContractSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(typeContracts)
      .set({
        name: input.name,
      })
      .where(eq(typeContracts.id, input.id));

    revalidatePath('/type-contracts');

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
