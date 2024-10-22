import z from 'zod';

import {
  enumBloodType,
  enumDegree,
  enumEnglishCertification,
  enumReligions,
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
  religion: z.enum(enumReligions).optional(),
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
  rank: z.string().optional(),
  englishCertification: z.string().optional(),
  religion: z.string().optional(),
  birthday: z.string().optional(),
  technologyCertification: z.string().optional(),
});
export type GetRecordsSchema = z.infer<typeof getRecordsSchema>;

export const createRecordSchema = (_ranks: string[]) => {
  return z.object({
    fullName: z
      .string({
        required_error: 'Họ và tên không được để trống',
      })
      .optional()
      .describe('Họ và tên'),
    religion: z
      .enum(enumReligions, {
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
      .optional()
      .describe('Trình độ'),
  });
};

export const commendateRecordSchema = z
  .object({
    from: z.date({
      required_error: 'Không được để trống ngày bắt đầu',
    }),
    to: z.date({
      required_error: 'Không được để trống ngày kết thúc',
    }),
    decisionNumber: z.string({
      required_error: 'Không được để trống số quyết định',
    }),
    decisionDate: z.date({
      required_error: 'Không được để trống ngày quyết định',
    }),
    decisionDepartment: z.string({
      required_error: 'Không được để trống cơ quan quyết định',
    }),
  })
  .refine(data => data.from < data.to, {
    message: 'Ngày bắt đầu phải trước ngày kết thúc',
    path: ['from'],
  });
export const getCommendationRecordSchema = z.object({
  ...searchParamsSchema.shape,
  ...commendateRecordSchema.sourceType().shape,
  decisionDate: z.string().optional(),
  _from: z.string().optional(),
  _to: z.string().optional(),
});
export type GetCommendationRecordSchema = z.infer<
  typeof getCommendationRecordSchema
>;
export const disciplineRecordSchema = z.object({
  from: z.date(),
  to: z.date(),
  decisionNumber: z.string(),
  decisionDate: z.date(),
  decisionDepartment: z.string(),
});

export const getDisciplineRecordSchema = z.object({
  ...searchParamsSchema.shape,
  ...disciplineRecordSchema.shape,
  decisionDate: z.string().optional(),
  _from: z.string().optional(),
  _to: z.string().optional(),
});

export type GetDisciplineRecordSchema = z.infer<
  typeof getDisciplineRecordSchema
>;
export const remarkRecordSchema = z
  .object({
    from: z.date({
      required_error: 'Không được để trống ngày bắt đầu',
    }),
    to: z.date({
      required_error: 'Không được để trống ngày kết thúc',
    }),
    decisionNumber: z.string({
      required_error: 'Không được để trống số quyết định',
    }),
    decisionDate: z.date({
      required_error: 'Không được để trống ngày quyết định',
    }),
    decisionDepartment: z.string({
      required_error: 'Không được để trống cơ quan quyết định',
    }),
  })
  .refine(data => data.from < data.to, {
    message: 'Ngày bắt đầu phải trước ngày kết thúc',
    path: ['from'],
  });
export const getRemarkRecordSchema = z.object({
  ...searchParamsSchema.shape,
  ...remarkRecordSchema.sourceType().shape,
  decisionDate: z.string().optional(),
  _from: z.string().optional(),
  _to: z.string().optional(),
});
export type GetRemarkRecordSchema = z.infer<typeof getRemarkRecordSchema>;
export const updateRecordSchema = (_ranks: string[]) => {
  return z.object({
    fullName: z
      .string({
        required_error: 'Họ và tên không được để trống',
      })
      .optional()
      .describe('Họ và tên'),
    religion: z
      .enum(enumReligions, {
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
export type RemarkRecordSchema = z.infer<typeof remarkRecordSchema>;
export type CommendateRecordSchema = z.infer<typeof commendateRecordSchema>;
export type DisciplineRecordSchema = z.infer<typeof disciplineRecordSchema>;
export type CreateCommendationSchema = z.infer<typeof commendateRecordSchema>;
export type UpdateCommendationSchema = z.infer<typeof commendateRecordSchema>;
export type CreateDisciplineSchema = z.infer<typeof disciplineRecordSchema>;
export type UpdateDisciplineSchema = z.infer<typeof disciplineRecordSchema>;
export type CreateRemarkSchema = z.infer<typeof remarkRecordSchema>;
export type UpdateRemarkSchema = z.infer<typeof remarkRecordSchema>;
