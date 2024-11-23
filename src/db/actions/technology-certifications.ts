'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { technologyCertifications } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateTechnologyCertificationSchema,
  UpdateTechnologyCertificationSchema,
} from '@/lib/zod/schemas/technology-certification-schema';

export async function createTechnologyCertification(
  input: CreateTechnologyCertificationSchema,
) {
  noStore();
  try {
    await db
      .insert(technologyCertifications)
      .values({
        code: `DPM${randomatic('AA0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: technologyCertifications.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/technology-certifications');

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

export async function deleteTechnologyCertification(input: { id: string }) {
  try {
    await db
      .delete(technologyCertifications)
      .where(eq(technologyCertifications.id, input.id));

    revalidatePath('/technology-certifications');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteTechnologyCertifications(input: { ids: string[] }) {
  try {
    await db
      .delete(technologyCertifications)
      .where(inArray(technologyCertifications.id, input.ids));

    revalidatePath('/technology-certifications');

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

export async function updateTechnologyCertification(
  input: UpdateTechnologyCertificationSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(technologyCertifications)
      .set({
        name: input.name,
      })
      .where(eq(technologyCertifications.id, input.id));

    revalidatePath('/technology-certifications');

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
