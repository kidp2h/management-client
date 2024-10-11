import z from 'zod';

import {
  enumBloodType,
  enumDegree,
  enumEnglishCertification,
  enumTechnologyCertification,
} from '@/db/schema';

import { searchParamsSchema } from '.';

const stringToBoolean = (value: unknown) => {
  if (typeof value === 'string') {
    return value === 'true';
  }
  return value;
};

const stringToDate = (value: unknown) => {
  if (typeof value === 'string') {
    return new Date(value);
  }
  return value;
};
export const recordSchema = z.object({
  id: z.string().optional(),
  code: z.string().optional(),
  fullName: z.string().optional(),
  religionId: z.string().optional(),
  birthday: z.preprocess(stringToDate, z.date()).optional(),
  bloodType: z.enum(enumBloodType).optional(),
  rankId: z.string().optional(),
  englishCertification: z.enum(enumEnglishCertification).optional(),
  technologyCertification: z.enum(enumTechnologyCertification).optional(),
  isPartyMember: z.preprocess(stringToBoolean, z.boolean()).optional(),
  degree: z.enum(enumDegree).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type RecordSchema = z.infer<typeof recordSchema>;
export const getRecordsSchema = z.object({
  ...searchParamsSchema.shape,
  ...recordSchema.shape,
  bloodType: z.string().optional(),
  religion: z.string().optional(),
  rank: z.string().optional(),
  englishCertification: z.string().optional(),
  birthday: z.string().optional(),
  technologyCertification: z.string().optional(),
});
export type GetRecordsSchema = z.infer<typeof getRecordsSchema>;

export const createRecordSchema = (_religions: string[], _ranks: string[]) => {
  return z.object({
    code: z
      .string({
        required_error: 'Mã hồ sơ không được để trống',
      })
      .describe('Mã hồ sơ'),
    fullName: z
      .string({
        required_error: 'Họ và tên không được để trống',
      })
      .describe('Họ và tên'),
    religionId: z
      .enum(_religions as [string, ...string[]], {
        required_error: 'Tôn giáo không được để trống',
      })
      .describe('Tôn giáo'),

    birthday: z
      .date({
        required_error: 'Ngày sinh không được để trống',
      })
      .describe('Ngày sinh'),
    bloodType: z.enum(enumBloodType).optional().describe('Nhóm máu'),
    rankId: z
      .enum(_ranks as [string, ...string[]], {
        required_error: 'Cấp bậc không được để trống',
      })
      .describe('Cấp bậc'),
    englishCertification: z
      .enum(enumEnglishCertification)
      .optional()
      .describe('Chứng chỉ tiếng Anh'),
    technologyCertification: z
      .enum(enumTechnologyCertification)
      .optional()
      .describe('Chứng chỉ tin học'),
    isPartyMember: z
      .boolean({
        required_error: 'Đảng viên không được để trống',
      })
      .optional()
      .describe('Đảng viên'),
    degree: z
      .enum(enumDegree, {
        required_error: 'Trình độ không được để trống',
      })
      .describe('Trình độ'),
  });
};

export const updateRecordSchema = (_religions: string[], _ranks: string[]) => {
  return z.object({
    code: z
      .string({
        required_error: 'Mã hồ sơ không được để trống',
      })
      .optional()
      .describe('Mã hồ sơ'),
    fullName: z
      .string({
        required_error: 'Họ và tên không được để trống',
      })
      .optional()
      .describe('Họ và tên'),
    religionId: z
      .enum(_religions as [string, ...string[]], {
        required_error: 'Tôn giáo không được để trống',
      })
      .optional()
      .describe('Tôn giáo'),
    birthday: z
      .date({
        required_error: 'Ngày sinh không được để trống',
      })
      .optional()
      .describe('Ngày sinh'),
    bloodType: z.enum(enumBloodType).optional().describe('Nhóm máu'),
    rankId: z
      .enum(_ranks as [string, ...string[]], {
        required_error: 'Cấp bậc không được để trống',
      })
      .optional()
      .describe('Cấp bậc'),
    englishCertification: z
      .enum(enumEnglishCertification)
      .optional()
      .describe('Chứng chỉ tiếng Anh'),
    technologyCertification: z
      .enum(enumTechnologyCertification)
      .optional()
      .describe('Chứng chỉ tin học'),
    isPartyMember: z
      .boolean({
        required_error: 'Đảng viên không được để trống',
      })
      .optional()
      .describe('Đảng viên'),
    degree: z
      .enum(enumDegree, {
        required_error: 'Trình độ không được để trống',
      })
      .describe('Trình độ')
      .optional(),
  });
};
export type CreateRecordSchema = z.infer<ReturnType<typeof createRecordSchema>>;
export type UpdateRecordSchema = z.infer<ReturnType<typeof updateRecordSchema>>;
