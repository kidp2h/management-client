import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';

export const enumBloodType: [string, ...string[]] = ['A', 'B', 'AB', 'O'];
export const enumDegree: [string, ...string[]] = [
  'Thạc sĩ',
  'Tiến sĩ',
  'Giáo sư',
  'Phó giáo sư',
];
export const enumEnglishCertification: [string, ...string[]] = [
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2',
];
export const enumTechnologyCertification: [string, ...string[]] = [
  'A',
  'B',
  'C',
];

export const enumRemarkType: [string, ...string[]] = [
  'Hoàn thành tốt nhiệm vụ',
  'Đạt kết quả cao trong công tác',
  'Đạt kết quả cao trong nghiên cứu',
  'Đạt kết quả cao trong công tác đào tạo',
  'Đạt kết quả cao trong công tác quản lý',
  'Đạt kết quả cao trong công tác giáo dục',
];
export const enumCommendationType: [string, ...string[]] = [
  'Lao động tiên tiến',
  'Chiến sĩ thi đua thành phố',
  'Chiến sĩ thi đua cấp quận',
  'Chiến sĩ thi đua cấp phường',
  'Chiến sĩ thi đua cấp xã',
];
export const enumDisciplineType: [string, ...string[]] = [
  'Kỷ luật cảnh cáo',
  'Kỷ luật đình chỉ công tác',
  'Kỷ luật giảm chức vụ',
  'Kỷ luật kỷ luật cách chức',
];
export const enumReligions: [string, ...string[]] = [
  'Thiên Chúa giáo', // Christianity
  'Công giáo La Mã', // Roman Catholicism
  'Chính Thống giáo', // Eastern Orthodoxy
  'Tin Lành', // Protestantism
  'Hồi giáo', // Islam
  'Sunni',
  'Shia',
  'Ấn Độ giáo', // Hinduism
  'Phật giáo', // Buddhism
  'Do Thái giáo', // Judaism
  'Sikh giáo', // Sikhism
  'Đạo giáo', // Taoism
  'Thần đạo', // Shinto
  'Hỏa giáo', // Zoroastrianism
  'Jain giáo', // Jainism
  // eslint-disable-next-line style/quotes
  "Bahá'í", // Bahá'í Faith
  'Đạo Cao Đài', // Caodaism
];

export const enumRetirementType: [string, ...string[]] = [
  'Nghỉ hưu định tuổi',
  'Nghỉ hưu do sức khỏe',
  'Hưởng bảo hiểm xã hội',
];
export const departments = pgTable('departments', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ranks = pgTable('ranks', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  name: text('name').notNull().unique(),
  code: text('code').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const languages = pgTable('languages', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const records = pgTable('records', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  fullName: text('full_name'),
  religion: text('religion', {
    enum: enumReligions,
  }),
  birthday: timestamp('birthday'),

  bloodType: text('blood_type', {
    enum: enumBloodType,
  }),
  rankId: uuid('rank_id'),
  englishCertification: text('english_certification', {
    enum: enumEnglishCertification,
  }),
  technologyCertification: text('technology_certification', {
    enum: enumTechnologyCertification,
  }),
  isPartyMember: boolean('is_party_member'),
  degree: text('degree', {
    enum: enumDegree,
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => {
      return new Date();
    })
    .notNull(),
});

export const recordsCommendation = pgTable('records_commendation', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  from: timestamp('from').notNull(),
  to: timestamp('to').notNull(),
  decisionNumber: text('decision_number').notNull(),
  decisionDate: timestamp('decision_date').notNull(),
  decisionDepartment: text('decision_department').notNull(),
  commendationType: text('commendation_type', {
    enum: enumCommendationType,
  })
    .array()
    .default([])
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recordsRemark = pgTable('records_remark', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  from: timestamp('from').notNull(),
  to: timestamp('to').notNull(),
  decisionNumber: text('decision_number').notNull(),
  decisionDate: timestamp('decision_date').notNull(),
  decisionDepartment: text('decision_department').notNull(),
  remarkType: text('remark_type', {
    enum: enumRemarkType,
  })
    .array()
    .default([])
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const recordsDiscipline = pgTable('records_discipline', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  from: timestamp('from').notNull(),
  to: timestamp('to').notNull(),
  decisionNumber: text('decision_number').notNull(),
  decisionDate: timestamp('decision_date').notNull(),
  decisionDepartment: text('decision_department').notNull(),
  disciplineType: text('discipline_type', {
    enum: enumDisciplineType,
  })
    .array()
    .default([])
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recordsRetirement = pgTable('records_retirement', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  decisionNumber: text('decision_number').notNull(),
  retireDate: timestamp('decision_date').notNull(),
  decisionDepartment: text('decision_department').notNull(),
  retirementType: text('discipline_type', {
    enum: enumRetirementType,
  })
    .array()
    .default([])
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recordsToLanguages = pgTable(
  'records_to_languages',
  {
    recordId: uuid('record_id')
      .notNull()
      .references(() => records.id),
    languageId: uuid('language_id')
      .notNull()
      .references(() => languages.id),
  },
  t => ({
    pk: primaryKey({ columns: [t.recordId, t.languageId] }),
  }),
);
export const recordsToLanguagesRelations = relations(
  recordsToLanguages,
  ({ one }) => ({
    records: one(records, {
      fields: [recordsToLanguages.recordId],
      references: [records.id],
    }),
    languages: one(languages, {
      fields: [recordsToLanguages.languageId],
      references: [languages.id],
    }),
  }),
);

export const roles = pgTable('roles', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const permissions = pgTable('permissions', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const rolePermissions = pgTable('role_permissions', {
  roleId: uuid('role_id')
    .references(() => roles.id)
    .notNull(),
  permissionId: uuid('permission_id')
    .references(() => permissions.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);

export const languagesRelations = relations(languages, ({ many }) => ({
  recordsToLanguages: many(recordsToLanguages),
}));

export type Departments = typeof departments.$inferSelect;
export type Languages = typeof languages.$inferSelect;
export type Ranks = typeof ranks.$inferSelect;
export type Records = typeof records.$inferSelect;
export type RecordsLanguages = typeof recordsToLanguages.$inferSelect;
export type EnumDegree = typeof records.$inferSelect.degree;
export type EnumBloodType = typeof records.$inferSelect.bloodType;
export type Roles = typeof roles.$inferSelect;
export type Permissions = typeof permissions.$inferSelect;
export type RolePermissions = typeof rolePermissions.$inferSelect;
export type RecordsDiscipline = typeof recordsDiscipline.$inferSelect;
export type RecordsCommendation = typeof recordsCommendation.$inferSelect;
export type RecordsRemark = typeof recordsRemark.$inferSelect;
