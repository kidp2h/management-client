'use server';
import { clerkClient, type User } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { createRecord } from '@/db/actions/records';
import type {
  CreateUserSchema,
  UpdateUserSchema,
} from '@/lib/zod/schemas/user-schema';

export const createUser = async (input: CreateUserSchema) => {
  try {
    const record = await createRecord({
      fullName: input.fullName,
      birthday: input.birthday,
    });
    const data = await clerkClient().users.createUser({
      username: input.username,
      password: input.password,
      publicMetadata: {
        role: null,
        record: {
          id: record.data?.id,
          code: record.data?.code,
        },
      },
    });

    if (data && record.error === null) {
      revalidatePath('/users');
      return {
        data: null,
        error: null,
      };
    }
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
};

export const deleteUser = async (input: { id: string }) => {
  try {
    const data = await clerkClient().users.deleteUser(input.id);
    if (data) {
      revalidatePath('/users');
      return {
        data: null,
        error: null,
      };
    }
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
};

export const deleteUsers = async (input: { ids: string[] }) => {
  try {
    const list: Promise<User>[] = [];
    for (const id of input.ids) {
      list.push(clerkClient().users.deleteUser(id));
    }
    const data = await Promise.all(list);
    if (data) {
      revalidatePath('/users');
      return {
        data: null,
        error: null,
      };
    }
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
};

export const updateUser = async (input: UpdateUserSchema & { id: string }) => {
  try {
    const newData = {} as Record<string, string>;
    if (input.username) newData.username = input.username;
    if (input.password) newData.password = input.password;
    if (Object.keys(newData).length === 0) {
      return {
        data: null,
        error: null,
      };
    }
    const data = await clerkClient().users.updateUser(input.id, {
      ...newData,
      skipPasswordChecks: true,
    });
    console.log('hih', data);

    if (data) {
      revalidatePath('/users');
      return {
        data: null,
        error: null,
      };
    }
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
};
