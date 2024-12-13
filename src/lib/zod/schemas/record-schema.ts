import z from 'zod';

import {
  enumBloodType,
  enumQualifications,
  enumEnglishCertification,
  enumGender,
  enumRelation,
  enumReligions,
  enumRetirementType,
  enumTechnologyCertification,
  enumTypeAllowance,
  enumTypeDegree,
  enumTypeHouse,
  enumTypeLand,
  enumEthnicities,
  nationalities,
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

  englishCertification: z.enum(enumEnglishCertification).optional(),
  technologyCertification: z.enum(enumTechnologyCertification).optional(),
  isPartyMember: z.preprocess(stringToBoolean, z.boolean()).optional(),
  qualification: z.enum(enumQualifications).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type RecordSchema = z.infer<typeof recordSchema>;
export const getRecordsSchema = z.object({
  ...searchParamsSchema.shape,
  ...recordSchema.shape,
  bloodType: z.string().optional(),
  rank: z.string().optional(),
  // englishCertification: z.string().optional(),
  religion: z.string().optional(),
  birthday: z.string().optional(),
  // technologyCertification: z.string().optional(),
  gender: z.string().optional(),
  birthPlace: z.string().optional(),
  ethnicity: z.string().optional(),
  departments: z.string().optional(),
});
export type GetRecordsSchema = z.infer<typeof getRecordsSchema>;

export const createRecordSchema = z.object({
  fullName: z
    .string({
      required_error: 'Họ và tên không được để trống',
    })
    .describe('Họ và tên'),

  birthday: z
    .date({
      required_error: 'Ngày sinh không được để trống',
    })
    .describe('Ngày sinh'),
  gender: z
    .enum(enumGender, {
      required_error: 'Giới tính không được để trống',
    })
    .describe('Giới tính'),
  deparments: z.array(z.string()),
});

export const updateInformationRecordSchema = z.object({
  fullName: z
    .string({
      required_error: 'Họ và tên không được để trống',
    })
    .optional()
    .describe('Họ và tên'),
  otherName: z.string().optional().describe('Tên gọi khác'),
  // avatar: z.string().optional().describe('Ảnh 4x6'),
  ...fileSchema.shape,

  religion: z
    .enum(enumReligions, {
      required_error: 'Tôn giáo không được để trống',
    })
    .optional()
    .describe('Tôn giáo'),
  affiliatedUnit: z.string().optional().describe('Đơn vị trực thuộc'),
  serialNumber: z.string().optional().describe('Số hiệu cán bộ, công chức'),
  baseUnit: z.string().optional().describe('Đơn vị cơ sở'),
  _province: z.string().optional().describe('Tỉnh'),
  overAllowance: z.string().optional().describe('Phụ cấp vượt khung'),
  birthday: z
    .date({
      required_error: 'Ngày sinh không được để trống',
    })
    .optional()
    .describe('Ngày sinh'),
  bloodType: z.enum(enumBloodType).optional().describe('Nhóm máu'),
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
  qualification: z
    .enum(enumQualifications, {
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
  birthPlace: z.string().optional().describe('Nơi sinh'),
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
  salaryGradeId: z.string().optional().describe('Bậc lương'),
  salaryFactor: z.string().optional().describe('Hệ số lương'),
  percentageOfSalary: z.string().optional().describe('Phần trăm hưởng'),
  seniorityAllowance: z.string().optional().describe('Phụ cấp thâm niên'),
  ethnicity: z.enum(enumEthnicities).optional().describe('Dân tộc'),
  dateOfSeniorityAllowance: z
    .date()
    .optional()
    .describe('Ngày được hưởng phụ cấp thâm niên'),
  dateOfEntilement: z.date().optional().describe('Ngày được hưởng'),
  civilServantRankId: z.string().optional().describe('Mã ngạch'),
  dateOfAppointment: z.date().optional().describe('Ngày bổ nhiệm'),
  dateOfEnlistment: z.date().optional().describe('Ngày nhập ngũ'),
  dateOfDemobilization: z.date().optional().describe('Ngày xuất ngũ'),
  healthStatus: z.string().optional().describe('Tình trạng sức khỏe'),
  height: z.string().optional().describe('Chiều cao'),
  weight: z.string().optional().describe('Cân nặng'),
  partyCommitteeLevelId: z.string().optional().describe('Cấp ủy hiện tại'),
  partyCommitteeConcurrentId: z.string().optional().describe('Cấp uỷ kiêm'),
  dutyId: z.string().optional().describe('Chức vụ'),
  dutyAllowance: z.string().optional().describe('Phụ cấp chức vụ'),
  familyBackground: z
    .string()
    .optional()
    .describe('Thành phần gia đình xuất thân'),
  previousJob: z
    .string()
    .optional()
    .describe('Nghề nghiệp bản thân trước khi được tuyển dụng'),
  dateHired: z.date().optional().describe('Ngày được tuyển dụng'),
  dateJoiningRevolutionary: z
    .date()
    .optional()
    .describe('Ngày tham gia cách mạng'),
  dateOfficialJoiningParty: z.date().optional().describe('Ngày chính thức'),
  dateOfJoiningOrganization: z
    .date()
    .optional()
    .describe('Ngày tham gia các tổ chức chính trị xã hội'),
  generalEducation: z
    .string()
    .optional()
    .describe('Trình độ giáo dục phổ thông'),
  appellationId: z.string().optional(),
  appellationYear: z.string().optional(),
  favouriteWork: z.string().optional(),
  longestJob: z.string().optional(),
  typeWounded: z.string().optional(),
  isMartyrsFamily: z.boolean().optional(),
  dateOfJoiningCurrentWorkPlace: z.date().optional(),
  currentMainWork: z.string().optional(),
});
export const createIncreaseSalaryRegularSchema = z.object({
  department: z.string(),
  decisionNumber: z.string(),
  decisionDepartment: z.string(),
  decisionDate: z.date(),
  salaryGrade: z.string(),
  previousSalaryGrade: z.string(),
  previousSalaryFactor: z.string(),
  preOverAllowance: z.string(),
  salaryFactor: z.string(),
  overAllowance: z.string(),
});
export const createIncreaseSalaryEarlySchema = z.object({
  department: z.string(),
  decisionNumber: z.string(),
  decisionDepartment: z.string(),
  decisionDate: z.date(),
  previousSalaryFactor: z.string(),
  salaryFactor: z.string(),
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
export const createCommendationSchema = z.object({
  from: z.date(),
  to: z.date(),
  reason: z.string(),
  decisionNumber: z.string(),
  year: z.string().optional(),
  award: z.string(),
});
export const updateCommendationSchema = createCommendationSchema.partial();
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

export const createDisciplineSchema = z.object({
  from: z.date(),
  to: z.date(),
  decisionNumber: z.string(),
  decisionDate: z.date(),
  decisionDepartment: z.string(),
  formDiscipline: z.string(),
});
export const createPartySchema = z.object({
  from: z.date(),
  to: z.date(),
  organization: z.string(),
  dutyParty: z.string(),
});
export const updatePartySchema = createPartySchema.partial();
export const updateDisciplineSchema = createDisciplineSchema.partial();

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
export const updateRecordSchema = () => {
  return z.object({
    fullName: z
      .string({
        required_error: 'Họ và tên không được để trống',
      })
      .optional()
      .describe('Họ và tên'),

    birthday: z
      .date({
        required_error: 'Ngày sinh không được để trống',
      })
      .optional()
      .describe('Ngày sinh'),
    bloodType: z.enum(enumBloodType).optional().describe('Nhóm máu'),

    gender: z.enum(enumGender).optional().describe('Giới tính'),
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
  from: z
    .date({
      required_error: 'Không được để trống ngày bắt đầu',
    })
    .describe('Ngày bắt đầu'),
  to: z
    .date({
      required_error: 'Không được để trống ngày kết thúc',
    })
    .describe('Ngày kết thúc'),
  decisionNumber: z
    .string({
      required_error: 'Không được để trống số quyết định',
    })
    .describe('Số quyết định'),

  typeContract: z
    .string({
      required_error: 'Không được để trống loại hợp đồng',
    })
    .describe('Loại hợp đồng'),
  recruimentType: z
    .string({
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
  qualification: z
    .enum(enumQualifications, {
      required_error: 'Không được để trống',
    })
    .describe('Trình độ'),
  formTraining: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Hình thức'),

  majors: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Chuyên ngành'),
});

export const updateTrainingSchema = createTrainingSchema.partial();
export const updateContractSchema = createContractSchema.partial();

export const createSalarySchema = z.object({
  at: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Tháng/Năm'),
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
    .describe('Đến năm')
    .optional(),
  department: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Đơn vị công tác'),
  duty: z
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
export const createImprisionedSchema = z.object({
  from: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Từ ngày'),
  to: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Đến ngày'),
  at: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Ở đâu'),
  providedTo: z.string().describe('Đã khai báo cho ai'),
  problems: z.string().describe('Những vấn đề gì'),
});
export const updateImprisionedSchema = createImprisionedSchema.partial();
export const createOldRegimeSchema = z.object({
  department: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Cơ quan/Đơn vị nào'),
  address: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Địa điểm'),
  duty: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Chức vụ'),
  from: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Từ ngày'),
  to: z
    .date({
      required_error: 'Không được để trống',
    })
    .describe('Đến ngày'),
});
export const updateOldRegimeSchema = createOldRegimeSchema.partial();

export const createOrganizationSchema = z.object({
  organization: z.string({}).describe('Tổ chức'),
  located: z.string({}).describe('Trụ sở tại'),
  do: z.string({}).describe('Làm gì'),
});

export const mobilizationRecordSchema = z.object({
  department: z.string({
    required_error: 'Không được để trống',
  }),
  dateMobilizate: z.date({
    required_error: 'Không được để trống',
  }),
  decisionNumber: z.string({
    required_error: 'Không được để trống',
  }),
  dateDecision: z.date({
    required_error: 'Không được để trống',
  }),
  fromDepartment: z.string({
    required_error: 'Không được để trống',
  }),
});
export const sendRecordSchema = z.object({
  decisionNumber: z.string({
    required_error: 'Không được để trống',
  }),
  dateDecision: z.date({
    required_error: 'Không được để trống',
  }),
  departmentDecision: z.string({
    required_error: 'Không được để trống',
  }),
  funding: z.string({
    required_error: 'Không được để trống',
  }),
  curriculum: z.string({
    required_error: 'Không được để trống',
  }),
  school: z.string({
    required_error: 'Không được để trống',
  }),
  country: z.enum(nationalities, {
    required_error: 'Không được để trống',
  }),
  yearStart: z.date({
    required_error: 'Không được để trống',
  }),
  yearEnd: z.date({
    required_error: 'Không được để trống',
  }),
  qualification: z.string({
    required_error: 'Không được để trống',
  }),
});
export const acceptMobilizationSchema = z.object({
  formSalary: z.string({
    required_error: 'Không được để trống',
  }),
  civilServantRank: z.string({
    required_error: 'Không được để trống',
  }),
  salaryGrade: z.string({
    required_error: 'Không được để trống',
  }),
  dateSalary: z.date({
    required_error: 'Không được để trống',
  }),
  duty: z.string({
    required_error: 'Không được để trống',
  }),
  department: z.string({
    required_error: 'Không được để trống',
  }),
});

export const increaseSalarySchema = z.object({
  decisionNumber: z.string({
    required_error: 'Không được để trống',
  }),
  dateDecision: z.date({
    required_error: 'Không được để trống',
  }),
  department: z.string({
    required_error: 'Không được để trống',
  }),
  salaryGrade: z.string({
    required_error: 'Không được để trống',
  }),
  salaryFactor: z.string({
    required_error: 'Không được để trống',
  }),
  overAllowance: z.string({
    required_error: 'Không được để trống',
  }),
});
export const increaseSalaryEarlySchema = z.object({
  decisionNumber: z.string({
    required_error: 'Không được để trống',
  }),
  dateDecision: z.date({
    required_error: 'Không được để trống',
  }),
  department: z.string({
    required_error: 'Không được để trống',
  }),

  salaryFactor: z.string({
    required_error: 'Không được để trống',
  }),
});
export const updateOrganizationSchema = createOrganizationSchema.partial();

export const createRelativeSchema = z.object({
  fullName: z.string().describe('Họ và tên'),
  country: z.string().describe('Quốc gia'),
  job: z.string().describe('Nghề nghiệp'),
  relation: z
    .enum(enumRelation, {
      required_error: 'Không được để trống',
    })
    .describe('Quan hệ'),
  address: z.string().describe('Địa chỉ'),
});
export const updateRelativeSchema = createRelativeSchema.partial();

export const createDualSchema = z.object({
  decisionNumber: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Số quyết định'),
  department: z.string({
    required_error: 'Không được để trống',
  }),
  startDate: z.date({
    required_error: 'Không được để trống',
  }),
  endDate: z.date({
    required_error: 'Không được để trống',
  }),
  duty: z.string({
    required_error: 'Không được để trống',
  }),
  issuer: z.string({
    required_error: 'Không được để trống',
  }),
  dateOfIssue: z.date({
    required_error: 'Không được để trống',
  }),
});

export const updateDualSchema = createDualSchema.partial();

export const createSecondmentSchema = z.object({
  decisionNumber: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Số quyết định'),
  department: z.string({
    required_error: 'Không được để trống',
  }),
  startDate: z.date({
    required_error: 'Không được để trống',
  }),
  endDate: z.date({
    required_error: 'Không được để trống',
  }),
  duty: z.string({
    required_error: 'Không được để trống',
  }),
  issuer: z.string({
    required_error: 'Không được để trống',
  }),
  dateOfIssue: z.date({
    required_error: 'Không được để trống',
  }),
});
export const updateSecondmentSchema = createSecondmentSchema.partial();

export const updateRelationshipSchema = createRelationshipSchema.partial();

export const createLanguageSchema = z.object({
  language: z.string().describe('Tên ngôn ngữ'),
  mark: z.string().describe('Điểm/Bậc'),
});
export const updateLanguageSchema = createLanguageSchema.partial();
export type GetListRecordsRetireSchema = z.infer<
  typeof getListRecordsRetireSchema
>;
export type ListRecordsRetireSchema = z.infer<typeof listRecordsRetireSchema>;
export type CreateRecordSchema = z.infer<typeof createRecordSchema>;
export type UpdateRecordSchema = z.infer<ReturnType<typeof updateRecordSchema>>;
export type UpdateInformationRecordSchema = z.infer<
  typeof updateInformationRecordSchema
>;
export type RemarkRecordSchema = z.infer<typeof remarkRecordSchema>;
export type CommendateRecordSchema = z.infer<typeof commendateRecordSchema>;
export type DisciplineRecordSchema = z.infer<typeof disciplineRecordSchema>;
export type CreateCommendationSchema = z.infer<typeof createCommendationSchema>;
export type UpdateCommendationSchema = z.infer<
  ReturnType<typeof createCommendationSchema.partial>
>;
export type CreateDisciplineSchema = z.infer<typeof createDisciplineSchema>;
export type UpdateDisciplineSchema = z.infer<typeof updateDisciplineSchema>;
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
export type CreateImprisionedSchema = z.infer<typeof createImprisionedSchema>;
export type UpdateImprisionedSchema = z.infer<typeof updateImprisionedSchema>;
export type CreateOldRegimeSchema = z.infer<typeof createOldRegimeSchema>;
export type UpdateOldRegimeSchema = z.infer<typeof updateOldRegimeSchema>;
export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationSchema = z.infer<typeof updateOrganizationSchema>;
export type CreateRelativeSchema = z.infer<typeof createRelativeSchema>;
export type UpdateRelativeSchema = z.infer<typeof updateRelativeSchema>;
export type CreateLanguageSchema = z.infer<typeof createLanguageSchema>;
export type UpdateLanguageSchema = z.infer<typeof updateLanguageSchema>;
export type CreateMobilizationRecordSchema = z.infer<
  typeof mobilizationRecordSchema
>;
export type CreateDualSchema = z.infer<typeof createDualSchema>;
export type UpdateDualSchema = z.infer<typeof updateDualSchema>;

export type CreateSecondmentSchema = z.infer<typeof createSecondmentSchema>;
export type UpdateSecondmentSchema = z.infer<typeof updateSecondmentSchema>;
export type CreateIncreaseSalaryRegularSchema = z.infer<
  typeof createIncreaseSalaryRegularSchema
>;
export type CreateIncreaseSalaryEarlySchema = z.infer<
  typeof createIncreaseSalaryEarlySchema
>;
export type CreateSendRecordSchema = z.infer<typeof sendRecordSchema>;
export type CreatePartySchema = z.infer<typeof createPartySchema>;
export type UpdatePartySchema = z.infer<typeof updatePartySchema>;
