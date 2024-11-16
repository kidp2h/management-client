import z from 'zod';

import {
  enumBloodType,
  enumContractType,
  enumDegree,
  enumEnglishCertification,
  enumFormTraining,
  enumGender,
  enumLevel,
  enumRecruitmentType,
  enumRelation,
  enumReligions,
  enumRetirementType,
  enumTechnologyCertification,
  enumTypeAllowance,
  enumTypeDegree,
  enumTypeHouse,
  enumTypeLand,
  enumWorkPlace,
} from '@/db/schema';

import { searchParamsSchema } from '.';
import { fileSchema } from './file-schema';

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
  gender: z.enum(enumGender).optional(),
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
  gender: z.string().optional(),
});
export type GetRecordsSchema = z.infer<typeof getRecordsSchema>;

export const createRecordSchema = (_ranks: string[]) => {
  return z.object({
    fullName: z
      .string({
        required_error: 'Họ và tên không được để trống',
      })
      // .optional()
      .describe('Họ và tên'),
    // religion: z
    //   .enum(enumReligions, {
    //     required_error: 'Tôn giáo không được để trống',
    //   })
    //   // .optional()
    //   .describe('Tôn giáo'),

    birthday: z
      .date({
        required_error: 'Ngày sinh không được để trống',
      })
      // .optional()
      .describe('Ngày sinh'),
    // bloodType: z.enum(enumBloodType).optional().describe('Nhóm máu'),
    rankId: z
      .enum(_ranks as [string, ...string[]], {
        required_error: 'Cấp bậc không được để trống',
      })
      // .optional()
      .describe('Cấp bậc'),
    // englishCertification: z
    //   .enum(enumEnglishCertification)
    //   // .optional()
    //   .describe('Chứng chỉ tiếng Anh'),
    // technologyCertification: z
    //   .enum(enumTechnologyCertification)
    //   // .optional()
    //   .describe('Chứng chỉ tin học'),
    salaryGrade: z.string().optional().describe('Bậc lương'),
    salaryFactor: z.string().optional().describe('Hệ số lương'),
    dateOfEntilement: z.date().optional().describe('Ngày được hưởng'),
    gender: z
      .enum(enumGender, {
        required_error: 'Giới tính không được để trống',
      })
      .describe('Giới tính'),
    // isPartyMember: z
    //   .boolean({
    //     required_error: 'Đảng viên không được để trống',
    //   })
    //   // .optional()
    //   .describe('Đảng viên'),
    degree: z
      .enum(enumDegree, {
        required_error: 'Trình độ không được để trống',
      })
      // .optional()
      .describe('Trình độ'),
  });
};

export const updateInformationRecordSchema = z.object({
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
  rankId: z.string().optional().describe('Cấp bậc'),
  englishCertification: z
    .enum(enumEnglishCertification)
    .optional()
    .describe('Chứng chỉ tiếng Anh'),
  technologyCertification: z
    .enum(enumTechnologyCertification)
    .optional()
    .describe('Chứng chỉ tin học'),
  gender: z
    .enum(enumGender, {
      required_error: 'Giới tính không được để trống',
    })
    .describe('Giới tính'),
  isPartyMember: z
    .boolean({
      required_error: 'Đảng viên không được để trống',
    })
    .optional()
    .describe('Đảng viên'),
  dateJoiningParty: z.date().optional().describe('Ngày vào Đảng'),
  highestMilitaryRank: z.string().optional().describe('Quân hàm cao nhất'),
  politicalTheory: z.string().optional().describe('Lý luận chính trị'),
  degree: z
    .enum(enumDegree, {
      required_error: 'Trình độ không được để trống',
    })
    .optional()
    .describe('Trình độ'),
  identityCard: z
    .string({
      required_error: 'Số CCCD/CMT không được để trống',
    })
    .optional()
    .describe('Số CCCD/CMT'),
  dateOfIssue: z
    .date({
      required_error: 'Ngày cấp không được để trống',
    })
    .optional()
    .describe('Ngày cấp'),
  placeOfIssue: z.string().optional().describe('Nơi cấp'),
  province: z.string().optional().describe('Tỉnh/Thành'),
  district: z.string().optional().describe('Quận/Huyện'),
  ward: z.string().optional().describe('Phường/Xã'),
  hometownProvince: z.string().optional().describe('Tỉnh/Thành'),
  hometownDistrict: z.string().optional().describe('Quận/Huyện'),
  hometownWard: z.string().optional().describe('Phường/Xã'),
  hometownAddress: z.string().optional().describe('Địa chỉ'),
  address: z.string().optional().describe('Địa chỉ'),
  phoneNumber: z.string().optional().describe('Số điện thoại'),
  insuranceNumber: z.string().optional().describe('Số BHXH'),
  salaryGrade: z.string().optional().describe('Bậc lương'),
  salaryFactor: z.string().optional().describe('Hệ số lương'),
  percentageOfSalary: z.string().optional().describe('Phần trăm hưởng'),
  seniorityAllowance: z.string().optional().describe('Phụ cấp thâm niên'),
  dateOfSeniorityAllowance: z
    .date()
    .optional()
    .describe('Ngày được hưởng phụ cấp thâm niên'),
  dateOfEntilement: z.date().optional().describe('Ngày được hưởng'),
  classificationCode: z.string().optional().describe('Mã ngạch'),
  dateOfAppointment: z.date().optional().describe('Ngày bổ nhiệm'),
  dateOfEnlistment: z.date().optional().describe('Ngày nhập ngũ'),
  dateOfDemobilization: z.date().optional().describe('Ngày xuất ngũ'),
  healthStatus: z.string().optional().describe('Tình trạng sức khỏe'),
  height: z.string().optional().describe('Chiều cao'),
  weight: z.string().optional().describe('Cân nặng'),
});

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
    gender: z.enum(enumGender).optional().describe('Giới tính'),
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
    salaryGrade: z.string().optional().describe('Bậc lương'),
    salaryFactor: z.string().optional().describe('Hệ số lương'),
    dateOfEntilement: z.date().optional().describe('Ngày được hưởng'),
  });
};

export const listRecordsRetireSchema = z.object({
  decisionNumber: z
    .string({
      required_error: 'Không được để trống số quyết định',
    })
    .describe('Số quyết định'),
  retireDate: z
    .date({
      required_error: 'Không được để trống ngày nghỉ hưu',
    })
    .describe('Ngày quyết định'),
  retirementType: z
    .enum(enumRetirementType, {
      required_error: 'Không được để trống hình thức nghỉ hưu',
    })
    .describe('Hình thức nghỉ hưu'),
});
export const getListRecordsRetireSchema = z.object({
  ...searchParamsSchema.shape,
  ...listRecordsRetireSchema.partial().shape,
  retireDate: z.string().optional(),
  retirementType: z.string().optional(),
  fullName: z.string().optional(),
});

export const createContractSchema = z.object({
  from: z.date().describe('Ngày bắt đầu'),
  to: z.date().describe('Ngày kết thúc'),
  decisionNumber: z
    .string({
      required_error: 'Không được để trống số quyết định',
    })
    .describe('Số quyết định'),

  contractType: z
    .enum(enumContractType, {
      required_error: 'Không được để trống loại hợp đồng',
    })
    .describe('Loại hợp đồng'),
  recruimentType: z
    .enum(enumRecruitmentType, {
      required_error: 'Không được để trống hình thức tuyển dụng',
    })
    .describe('Hình thức tuyển dụng'),
  dateRecruiment: z
    .date({
      required_error: 'Không được để trống ngày tuyển dụng',
    })
    .describe('Ngày tuyển dụng'),
});

export const createTrainingSchema = z.object({
  from: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Từ năm'),
  to: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Đến năm'),
  nameOfTrainingInstitution: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên cơ sở đào tạo'),
  degree: z
    .enum(enumDegree, {
      required_error: 'Không được để trống',
    })
    .describe('Trình độ'),
  form: z
    .enum(enumFormTraining, {
      required_error: 'Không được để trống',
    })
    .describe('Hình thức'),
  level: z
    .enum(enumLevel, {
      required_error: 'Không được để trống',
    })
    .describe('Loại'),
  majors: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Chuyên ngành'),
});

export const updateTrainingSchema = createTrainingSchema.partial();
export const updateContractSchema = createContractSchema.partial();

export const createSalarySchema = z.object({
  from: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Từ'),
  to: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Đến'),
  classification: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Ngạch'),
  salaryGrade: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Bậc lương'),
  salaryFactor: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Hệ số lương'),
  salary: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tiền lương'),
});
export const updateSalarySchema = createSalarySchema.partial();

export const createAllowanceSchema = z.object({
  from: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Từ'),
  to: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Đến'),
  typeAllowance: z
    .enum(enumTypeAllowance, {
      required_error: 'Không được để trống',
    })
    .describe('Loại phụ cấp'),
  percent: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Phần trăm hưởng'),
  factor: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Hệ số'),

  amount: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Giá trị'),
});
export const updateAllowanceSchema = createAllowanceSchema.partial();
export const createHouseSchema = z.object({
  typeHouse: z.enum(enumTypeHouse, {
    required_error: 'Không được để trống',
  }),
  area: z.string({
    required_error: 'Không được để trống',
  }),
  ...fileSchema.shape,
});
export const updateHouseSchema = createHouseSchema.partial();
export const createLandSchema = z.object({
  typeLand: z.enum(enumTypeLand, {
    required_error: 'Không được để trống',
  }),
  area: z.string({
    required_error: 'Không được để trống',
  }),
  documents: z.string().optional(),
});
export const updateLandSchema = createLandSchema.partial();
export const createProfessionSchema = z.object({
  year: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Ngày tốt nghiệp'),
  typeDegree: z
    .enum(enumTypeDegree, {
      required_error: 'Không được để trống',
    })
    .describe('Loại trình độ'),
  nameOfTrainingInstitution: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên cơ sở đào tạo'),
  level: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Trình độ'),
  mark: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Loại/Điểm'),
  majors: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Chuyên ngành'),
});
export const updateProfessionSchema = createProfessionSchema.partial();

export const createWorkExperienceSchema = z.object({
  from: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Từ năm'),
  to: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Đến năm'),
  workPlace: z
    .enum(enumWorkPlace, {
      required_error: 'Không được để trống',
    })
    .describe('Đơn vị công tác'),
  position: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Chức vụ'),
});

export const updateWorkExperienceSchema = createWorkExperienceSchema.partial();

export const createRelationshipSchema = z.object({
  fullName: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Họ và tên'),
  dateOfBirth: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Ngày sinh'),
  relation: z
    .enum(enumRelation, {
      required_error: 'Không được để trống',
    })
    .describe('Quan hệ'),
  info: z
    .string()
    .describe(
      'Quê quán, nghề nghiệp, chức danh, chức vụ, đơn vị công tác, học tập, nơi ở',
    ),
});

export const updateRelationshipSchema = createRelationshipSchema.partial();
export type GetListRecordsRetireSchema = z.infer<
  typeof getListRecordsRetireSchema
>;
export type ListRecordsRetireSchema = z.infer<typeof listRecordsRetireSchema>;
export type CreateRecordSchema = z.infer<ReturnType<typeof createRecordSchema>>;
export type UpdateRecordSchema = z.infer<ReturnType<typeof updateRecordSchema>>;
export type UpdateInformationRecordSchema = z.infer<
  typeof updateInformationRecordSchema
>;
export type RemarkRecordSchema = z.infer<typeof remarkRecordSchema>;
export type CommendateRecordSchema = z.infer<typeof commendateRecordSchema>;
export type DisciplineRecordSchema = z.infer<typeof disciplineRecordSchema>;
export type CreateCommendationSchema = z.infer<typeof commendateRecordSchema>;
export type UpdateCommendationSchema = z.infer<typeof commendateRecordSchema>;
export type CreateDisciplineSchema = z.infer<typeof disciplineRecordSchema>;
export type UpdateDisciplineSchema = z.infer<typeof disciplineRecordSchema>;
export type CreateRemarkSchema = z.infer<typeof remarkRecordSchema>;
export type UpdateRemarkSchema = z.infer<typeof remarkRecordSchema>;
export type CreateContractSchema = z.infer<typeof createContractSchema>;
export type UpdateContractSchema = z.infer<typeof updateContractSchema>;
export type CreateTrainingSchema = z.infer<typeof createTrainingSchema>;
export type UpdateTrainingSchema = z.infer<typeof updateTrainingSchema>;
export type CreateProfessionSchema = z.infer<typeof createProfessionSchema>;
export type UpdateProfessionSchema = z.infer<typeof updateProfessionSchema>;
export type CreateWorkExperienceSchema = z.infer<
  typeof createWorkExperienceSchema
>;
export type UpdateWorkExperienceSchema = z.infer<
  typeof updateWorkExperienceSchema
>;
export type CreateRelationshipSchema = z.infer<typeof createRelationshipSchema>;
export type UpdateRelationshipSchema = z.infer<typeof updateRelationshipSchema>;
export type CreateSalarySchema = z.infer<typeof createSalarySchema>;
export type UpdateSalarySchema = z.infer<typeof updateSalarySchema>;
export type CreateAllowanceSchema = z.infer<typeof createAllowanceSchema>;
export type UpdateAllowanceSchema = z.infer<typeof updateAllowanceSchema>;
export type CreateHouseSchema = z.infer<typeof createHouseSchema>;
export type UpdateHouseSchema = z.infer<typeof updateHouseSchema>;
export type CreateLandSchema = z.infer<typeof createLandSchema>;
export type UpdateLandSchema = z.infer<typeof updateLandSchema>;
