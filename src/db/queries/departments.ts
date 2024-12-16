import 'server-only';

import { and, asc, count, desc, eq, gte, lte, or, type SQL } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/db';
import type { Departments } from '@/db/schema';
import { departments, records, recordsDepartments } from '@/db/schema';
import { filterColumn } from '@/lib/filter-column';
import type { GetDepartmentsSchema } from '@/lib/zod/schemas/department-schema';
import type { DrizzleWhere } from '@/types';

export async function getDepartments(input: Partial<GetDepartmentsSchema>) {
  noStore();

  try {
    const offset = (input.page! - 1) * input.per_page!;
    const [column, order] = (input.sort?.split('.').filter(Boolean) ?? [
      'createdAt',
      'desc',
    ]) as [keyof Departments | undefined, 'asc' | 'desc' | undefined];

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      input.code
        ? filterColumn({
            column: departments.code,
            value: input.code,
          })
        : undefined,
      !!input.name
        ? filterColumn({
            column: departments.name,
            value: input.name,
          })
        : undefined,

      fromDate ? gte(departments.createdAt, fromDate) : undefined,
      toDate ? lte(departments.createdAt, toDate) : undefined,
    ];
    const where: DrizzleWhere<Departments> =
      !input.operator || input.operator === 'and'
        ? and(...expressions)
        : or(...expressions);
    const { data, total } = await db.transaction(async tx => {
      const data = await tx
        .select()
        .from(departments)
        .limit(input.per_page!)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in departments
            ? order === 'asc'
              ? asc(departments[column])
              : desc(departments[column])
            : desc(departments.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(departments)
        .where(where)
        .execute()
        .then(res => res[0]?.count ?? 0);

      return {
        data,
        total,
      };
    });

    const pageCount = Math.ceil(total / input.per_page!);
    return { data, pageCount };
  } catch (error) {
    console.error('Error getting departments:', error);
    return { data: [], pageCount: 0 };
  }
}

export async function getAllDepartments() {
  try {
    const data = await db.select().from(departments);
    if (data) {
      const hierarchy = buildDepartmentHierarchy(data);
      // console.log(JSON.stringify(hierarchy, null, 2));
      // console.log(hierarchy);
      return { data: hierarchy };
    }
    return { data: [] };
  } catch (error) {
    console.error('Error getting departments:', error);
    return { data: null, error: 'Error getting departments' };
  }
}

export async function getChildOfDepartment(id: string) {
  try {
    const data = await db
      .select()
      .from(departments)
      .where(eq(departments.parent, id));
    // if (data) {
    //   const hierarchy = buildDepartmentHierarchy(data);

    // }
    // return { data: [], error: null };
    return { data, error: null };
  } catch (error) {
    console.error('Error getting departments:', error);
    return { data: null };
  }
}

export async function getDepartmentsByRecord(id: string) {
  try {
    const data = await db
      .select({
        id: recordsDepartments.id,
        record: records,
        department: departments,
      })
      .from(recordsDepartments)
      .where(eq(recordsDepartments.recordId, id))
      .leftJoin(
        departments,
        eq(recordsDepartments.departmentId, departments.id),
      )
      .leftJoin(records, eq(recordsDepartments.recordId, records.id));
    return { data, error: null };
  } catch (error) {
    console.error('Error getting departments:', error);
    return { data: null, error: 'Error getting departments' };
  }
}

function buildDepartmentHierarchy(departments: any[]) {
  const departmentMap = new Map<
    string,
    Departments & { children: Departments[] }
  >();

  // Initialize the map with all departments
  departments.forEach(department => {
    departmentMap.set(department.id, { ...department, children: null });
  });

  // Build the hierarchy
  const hierarchy: (Departments & { children: Departments[] })[] = [];
  departmentMap.forEach(department => {
    // // console.log(department);
    if (department.parent) {
      const parent = departmentMap.get(department.parent);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(department);
      }
    } else {
      hierarchy.push(department);
    }
  });

  return hierarchy;
}

export async function getAllRecordsDepartments() {
  try {
    const data = await db
      .select({
        id: recordsDepartments.id,
        record: records,
        department: departments,
      })
      .from(recordsDepartments)
      .leftJoin(
        departments,
        eq(recordsDepartments.departmentId, departments.id),
      )
      .leftJoin(records, eq(recordsDepartments.recordId, records.id));
    return { data };
  } catch (error) {
    console.error('Error getting departments:', error);
    return { data: null };
  }
}
