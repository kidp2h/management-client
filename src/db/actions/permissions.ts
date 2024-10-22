'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { permissions } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreatePermissionSchema,
  UpdatePermissionSchema,
} from '@/lib/zod/schemas/permission-schema';

export async function createPermission(input: CreatePermissionSchema) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(permissions)
      .values({
        code: `PMS${randomatic('A0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: permissions.id,
      })
      .then(takeFirstOrThrow);

    // Delete a task to keep the total number of tasks constant
    // await tx.delete(permissions).where(
    //   eq(
    //     permissions.id,
    //     (
    //       await tx
    //         .select({
    //           id: permissions.id,
    //         })
    //         .from(permissions)
    //         .limit(1)
    //         .where(not(eq(permissions.id, newPermission.id)))
    //         .orderBy(asc(permissions.createdAt))
    //         .then(takeFirstOrThrow)
    //     ).id,
    //   ),
    // );;

    revalidatePath('/permissions');

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

export async function deletePermission(input: { id: string }) {
  try {
    await db.delete(permissions).where(eq(permissions.id, input.id));

    revalidatePath('/permissions');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deletePermissions(input: { ids: string[] }) {
  try {
    await db.delete(permissions).where(inArray(permissions.id, input.ids));

    revalidatePath('/permissions');

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

export async function updatePermission(
  input: UpdatePermissionSchema & { id: string },
) {
  noStore();
  try {
    await db
      .update(permissions)
      .set({
        name: input.name,
      })
      .where(eq(permissions.id, input.id));

    revalidatePath('/permissions');

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
