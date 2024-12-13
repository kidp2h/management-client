'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import randomatic from 'randomatic';

import { db } from '@/db';
import { configRole, roles } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '@/lib/handle-error';
import type {
  CreateRoleSchema,
  UpdateRoleSchema,
} from '@/lib/zod/schemas/role-schema';

export async function createRole(input: CreateRoleSchema) {
  noStore();
  try {
    // await db.transaction(async tx => {
    await db
      .insert(roles)
      .values({
        code: `RL${randomatic('A0A', 10)}${new Date().getSeconds()}${new Date().getFullYear()}`,
        name: input.name,
      })
      .returning({
        id: roles.id,
      })
      .then(takeFirstOrThrow);

    revalidatePath('/roles');

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

export async function deleteRole(input: { id: string }) {
  try {
    await db.delete(roles).where(eq(roles.id, input.id));

    revalidatePath('/roles');
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteRoles(input: { ids: string[] }) {
  try {
    await db.delete(roles).where(inArray(roles.id, input.ids));

    revalidatePath('/roles');

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

export async function updateRole(input: UpdateRoleSchema & { id: string }) {
  noStore();
  try {
    await db
      .update(roles)
      .set({
        name: input.name,
      })
      .where(eq(roles.id, input.id));

    revalidatePath('/roles');

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

export async function setRoleAdmin(input: { id: string }) {
  try {
    const first = await db.select().from(configRole);
    if (first.length === 0) {
      await db
        .insert(configRole)
        .values({
          roleId: [input.id],
        })
        .returning({
          id: configRole.id,
        })
        .then(takeFirstOrThrow);

      revalidatePath('/roles');

      return {
        data: null,
        error: null,
      };
    } else {
      const data = first[0].roleId;
      data?.push(input.id);
      // filter data duplicate
      const dataFilter = data?.filter(
        (item, index) => data?.indexOf(item) === index,
      );
      console.log(data);

      await db
        .update(configRole)
        .set({
          roleId: dataFilter,
        })
        .where(eq(configRole.id, first[0].id));

      revalidatePath('/roles');

      return {
        data: null,
        error: null,
      };
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function removeRoleAdmin(id: string) {
  try {
    const first = await db.select().from(configRole);
    if (first.length > 0) {
      const data = first[0].roleId;
      const dataFilter = data?.filter(item => item !== id);
      console.log(dataFilter);
      await db
        .update(configRole)
        .set({
          roleId: dataFilter,
        })
        .where(eq(configRole.id, first[0].id));

      revalidatePath('/roles');

      return {
        data: null,
        error: null,
      };
    } else {
      return {
        data: null,
        error: 'Không tìm thấy dữ liệu',
      };
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function setRoleApprove(input: { id: string }) {
  try {
    const first = await db.select().from(configRole);
    if (first.length === 0) {
      await db
        .insert(configRole)
        .values({
          rolesCanApprove: [input.id],
        })
        .returning({
          id: configRole.id,
        })
        .then(takeFirstOrThrow);

      revalidatePath('/roles');

      return {
        data: null,
        error: null,
      };
    } else {
      const data = first[0].rolesCanApprove;
      data?.push(input.id);
      // filter data duplicate
      const dataFilter = data?.filter(
        (item, index) => data?.indexOf(item) === index,
      );
      console.log(data);

      await db
        .update(configRole)
        .set({
          rolesCanApprove: dataFilter,
        })
        .where(eq(configRole.id, first[0].id));

      revalidatePath('/roles');

      return {
        data: null,
        error: null,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function removeRoleApprove(id: string) {
  try {
    const first = await db.select().from(configRole);
    if (first.length > 0) {
      const data = first[0].rolesCanApprove;
      const dataFilter = data?.filter(item => item !== id);
      console.log(dataFilter);
      await db
        .update(configRole)
        .set({
          rolesCanApprove: dataFilter,
        })
        .where(eq(configRole.id, first[0].id));

      revalidatePath('/roles');

      return {
        data: null,
        error: null,
      };
    } else {
      return {
        data: null,
        error: 'Không tìm thấy dữ liệu',
      };
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
