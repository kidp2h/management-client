import { relations, sql } from 'drizzle-orm';
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
export const enumContractType: [string, ...string[]] = [
  'Biên chế hành chính',
  'Biên chế giáo viên',
  'Hợp đồng 68 CP',
  'Hợp đồng Thu hút, Đề án nhân lực cao',
];
export const enumRecruitmentType: [string, ...string[]] = [
  'Thi tuyển',
  'Xét tuyển',
  'Tuyển dụng',
];
export const enumGender: [string, ...string[]] = ['Nam', 'Nữ'];
export const enumAcademicQualification: [string, ...string[]] = [
  'Giáo sư',
  'Phó giáo sư',
];
export const enumQualifications: [string, ...string[]] = [
  'Thạc sĩ',
  'Tiến sĩ',
  'Tiến sĩ khoa học',
  'Cử nhân',
  'Kỹ sư',
  'Cao đẳng',
  'Trung cấp',
  'Sơ cấp',
  'Chuyên ngành',
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
export const enumHealthStatus: [string, ...string[]] = [
  'Khỏe mạnh',
  'Yếu',
  'Trung bình',
  'Khá',
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

export const enumMilitaryRank: [string, ...string[]] = [
  'Thiếu úy',
  'Trung úy',
  'Đại úy',
  'Thiếu tá',
  'Trung tá',
  'Đại tá',
  'Thiếu tướng',
  'Trung tướng',
  'Đại tướng',
  'Thượng sĩ',
  'Hạ sĩ',
  'Trung sĩ',
  'Thượng úy',
  'Binh nhì',
  'Binh nhất',
  'Thượng tướng',
];

export const enumPoliticalTheory: [string, ...string[]] = [
  'Sơ cấp',
  'Trung cấp',
  'Cao cấp',
];

export const enumFormTraining: [string, ...string[]] = [
  'Chính quy',
  'Vừa học vừa làm',
  'Đào tạo từ xa',
];
export const enumLevel: [string, ...string[]] = ['Giỏi', 'Khá', 'Trung bình'];
export const enumTypeDegree: [string, ...string[]] = [
  'Tin học',
  'Ngoại ngữ',
  'Chuyên ngành',
  'Chính trị',
  'Quản lý nhà nước',
  'An ninh - Quốc phòng',
];
export const enumWorkPlace: [string, ...string[]] = [
  'Đảng',
  'Chính quyền',
  'Đoàn thể',
  'Tổ chức xã hội',
];
export const enumRelation: [string, ...string[]] = [
  'Cha',
  'Mẹ',
  'Vợ',
  'Chồng',
  'Con trai',
  'Con gái',
  'Anh ruột',
  'Chị ruột',
  'Em trai',
  'Em gái',
];
export const enumTypeRelation: [string, ...string[]] = [
  'Bản thân',
  'Vợ',
  'Chồng',
];

export const enumTypeAllowance: [string, ...string[]] = [
  'Phụ cấp kiêm nhiệm',
  'Phụ cấp thâm niên vượt khung',
  'Phụ cấp khu vực',
  'Phụ cấp trách nhiệm',
  'Phụ cấp lưu động',
  'Phụ cấp ưu đãi theo nghề',
  'Phụ cấp công tác ở vùng có điều kiện kinh tế - xã hội đặc biệt khó khăn',
  'Phụ cấp theo phân loại đơn vị hành chính và theo phân hạng đơn vị sự nghiệp công lập',
  'Phụ cấp áp dụng riêng đối với lực lượng vũ trang',
];

export const enumTypeHouse: [string, ...string[]] = [
  'Nhà tự mua',
  'Nhà được cấp',
  'Nhà thuê',
  'Nhà ở khác',
];

export const enumTypeLand: [string, ...string[]] = [
  'Đất được cấp',
  'Đất tự mua',
  'Đất sản xuất, kinh doanh',
  'Khác',
];

export const enumEthnicities = [
  'Kinh',
  'Tày',
  'Thái',
  'Mường',
  'Hmong',
  'Nùng',
  'Khmer',
  'Dao',
  'Gia Rai',
  'Ede',
  'Ba Na',
  'Xơ Đăng',
  'Sán Chay',
  'Cơ Ho',
  'Chăm',
  'Sán Dìu',
  'Hrê',
  'Mnông',
  'Ra Glai',
  'Xinh Mun',
  'Bru - Vân Kiều',
  'Thổ',
  'Giáy',
  'Cơ Tu',
  'Giẻ Triêng',
  'Mạ',
  'Khơ Mú',
  'Co',
  'Tà Ôi',
  'Chơ Ro',
  'Hà Nhì',
  'Xtiêng',
  'Phù Lá',
  'La Chí',
  'Chứt',
  'Lào',
  'La Ha',
  'Pà Thẻn',
  'Lự',
  'Ngái',
  'Chăm Hroi',
  'Ơ Đu',
  'Rơ Măm',
  'Brâu',
  'Chu Ru',
] as [string, ...string[]];

export const religions = pgTable('religions', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const duties = pgTable('duties', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const positions = pgTable('positions', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const partyCommittees = pgTable('party_committees', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ethnicities = pgTable('ethnicities', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const academicQualifications = pgTable('academic_qualifications', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const militaryRanks = pgTable('military_ranks', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const qualifications = pgTable('qualifications', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const publicEmployeeRanks = pgTable('public_employee_ranks', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull(),
  type: text('type').notNull().default(''),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const civilServantRanks = pgTable('civil_servant_ranks', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  type: text('type').notNull().default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const familyBackgrounds = pgTable('family_backgrounds', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const salaries = pgTable('salaries', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull(),
  type: text('type').notNull(),
  rank: text('rank').notNull(),
  factor: text('factor').notNull(),
  salary: text('salary').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const languageCertifications = pgTable('language_certifications', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const technologyCertifications = pgTable('technology_certifications', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const appellations = pgTable('appellations', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const formCommendations = pgTable('form_commendations', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const formDisciplines = pgTable('form_disciplines', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const formRemarks = pgTable('form_remarks', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const formRetires = pgTable('form_retires', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const formRecruitments = pgTable('form_recruitment', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const formTrainings = pgTable('form_trainings', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const salaryGrades = pgTable('salary_grades', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
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
  gender: text('gender', {
    enum: enumGender,
  })
    .default('Nam')
    .notNull(),
  otherName: text('other_name'),
  ethnicity: text('ethnicity'),
  familyBackground: text('family_background'),
  previousJob: text('previous_job'),
  dateHired: timestamp('date_hired'),
  dateJoiningRevoluntionary: timestamp('date_joining_revoluntionary'),
  educationLevel: text('education_level'),
  highestConferredTitle: text('highest_conferred_title'),
  partyCommiteeLevelId: uuid('party_committee_level_id').references(
    () => partyCommittees.id,
  ),
  partyCommiteeConcurrentId: uuid('party_commitee_concurrent_id').references(
    () => partyCommittees.id,
  ),
  fullName: text('full_name'),
  religion: uuid('religion').references(() => religions.id),
  birthday: timestamp('birthday'),

  bloodType: text('blood_type', {
    enum: enumBloodType,
  }),

  currentResidence: text('current_residence'),
  birthPlace: text('birth_place'),
  hometown: text('home_town'),
  phoneNumber: text('phone_number'),
  englishCertification: text('english_certification', {
    enum: enumEnglishCertification,
  }),
  technologyCertification: text('technology_certification', {
    enum: enumTechnologyCertification,
  }),
  dateJoiningParty: timestamp('date_joining_party'),
  dateOfficialJoiningParty: timestamp('date_official_joining_party'),
  dateOfJoiningOrganization: timestamp('date_of_joining_organization'),
  generalEducation: text('general_education'),
  dateOfEnlistment: timestamp('date_of_enlistment'),
  dateOfDemobilization: timestamp('date_of_demobilization'),
  currentMainWork: text('current_main_work'),
  isPartyMember: boolean('is_party_member'),
  highestMilitaryRank: text('highest_military_rank', {
    enum: enumMilitaryRank,
  }),
  identityCard: text('identity_card'),
  dateOfIssue: timestamp('date_of_issue'),
  placeOfIssue: text('place_of_issue'),
  insuranceNumber: text('insurance_number'),
  salaryGradeId: uuid('salary_grade_id').references(() => salaryGrades.id),
  salaryFactor: text('salary_factor'),
  percentageOfSalary: text('percentage_of_salary'),

  dateOfEntilement: timestamp('date_of_entilement'),
  civilServantRankId: uuid('civil_servant_rank_id').references(
    () => civilServantRanks.id,
  ),
  publicEmployeeRankId: uuid('public_employee_rank_id').references(
    () => publicEmployeeRanks.id,
  ),
  dateOfAppointment: timestamp('date_of_appointment'),
  qualification: text('qualification', {
    enum: enumQualifications,
  }),
  politicalTheory: text('political_theory', {
    enum: enumPoliticalTheory,
  }),
  healthStatus: text('health_status', {
    enum: enumHealthStatus,
  }),
  weight: text('weight'),
  height: text('height'),
  sourceIncome: text('source_income'),
  otherSourceIncome: text('other_source_income'),
  appellationId: uuid('appellation_id').references(() => appellations.id),
  appellationYear: text('appellation_year'),
  longestJob: text('longest_job'),
  favouriteWork: text('favourite_work'),
  typeWounded: text('type_wounded'),
  isMartyrsFamily: boolean('is_martyrs_family'),
  dateOfJoiningCurrentWorkPlace: timestamp(
    'date_of_joining_current_work_place',
  ),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  dutyId: uuid('duty_id').references(() => duties.id),
  dutyAllowance: text('duty_allowance'),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => {
      return new Date();
    })
    .notNull(),
});

export const policyObjects = pgTable('policy_objects', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recordsPartyCommittee = pgTable('records_party_committee', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  level: text('level').notNull(),
  concurrent: text('concurrent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recordsDuty = pgTable('records_duty', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .unique()
    .references(() => records.id),
  dutyId: uuid('duty_id')
    .notNull()
    .references(() => duties.id),
  allowance: text('allowance').default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recordsTraining = pgTable('records_training', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  from: timestamp('from').notNull(),
  to: timestamp('to').notNull(),
  nameOfTrainingInstitution: text('name_of_training_institution').notNull(),
  qualification: uuid('qualification')
    .references(() => qualifications.id)
    .notNull(),
  formTraining: uuid('form_training')
    .references(() => formTrainings.id)
    .notNull(),

  majors: text('majors').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const recordsAppellation = pgTable('records_appellation', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .unique()
    .notNull()
    .references(() => records.id),
  appellationId: uuid('appellation_id')
    .notNull()
    .references(() => appellations.id),
  year: text('year').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const recordsProfession = pgTable('records_education', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  year: timestamp('year').notNull(),
  nameOfTrainingInstitution: text('name_of_training_institution').notNull(),
  typeDegree: text('type_degree', {
    enum: enumTypeDegree,
  }).notNull(),
  level: text('level').notNull(),
  mark: text('mark').notNull(),
  majors: text('majors').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const recordsCommendation = pgTable('records_commendation', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  award: uuid('award').references(() => appellations.id),
  year: text('year').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
// export const recordsCommendation = pgTable('records_commendation', {
//   id: uuid('id')
//     .$default(() => uuidv4())
//     .primaryKey(),
//   recordId: uuid('record_id')
//     .notNull()
//     .references(() => records.id),
//   from: timestamp('from').notNull(),
//   to: timestamp('to').notNull(),
//   decisionNumber: text('decision_number').notNull(),
//   decisionDate: timestamp('decision_date').notNull(),
//   decisionDepartment: text('decision_department').notNull(),
//   commendationType: text('commendation_type', {
//     enum: enumCommendationType,
//   })
//     .array()
//     .default([])
//     .notNull(),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
// });

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
  decisionDepartment: uuid('decision_department')
    .references(() => departments.id)
    .notNull(),
  formDiscipline: uuid('form_discipline')
    .references(() => formDisciplines.id)
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
  retireDate: timestamp('retire_date').notNull(),
  decisionDepartment: text('decision_department'),
  retirementType: text('retirement_type', {
    enum: enumRetirementType,
  })
    .default(enumRetirementType[0])
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recordsContract = pgTable('records_contract', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  from: timestamp('from').notNull(),
  to: timestamp('to').notNull(),
  decisionNumber: text('decision_number').notNull(),

  contractType: text('contract_type', {
    enum: enumContractType,
  }).notNull(),
  recruimentType: text('recruiment_type', {
    enum: enumRecruitmentType,
  }).notNull(),
  dateRecruiment: timestamp('date_recruiment').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recordsWorkExperience = pgTable('records_work_experience', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  from: timestamp('from').notNull(),
  to: timestamp('to').notNull(),
  department: uuid('department')
    .references(() => departments.id)
    .notNull(),
  duty: uuid('duty')
    .references(() => duties.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const recordsRelationship = pgTable('records_relationship', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  type: text('type', {
    enum: enumTypeRelation,
  }),
  fullName: text('fullName').notNull(),
  relation: text('relationship', {
    enum: enumRelation,
  }).notNull(),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  info: text('info').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const recordsSalary = pgTable('records_salary', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  at: timestamp('at').notNull(),
  classification: uuid('classification').notNull(),

  salaryGrade: uuid('salary_grade')
    .references(() => salaryGrades.id)
    .notNull(),
  salaryFactor: text('salary_factor').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recordsAllowance = pgTable('records_allowance', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  from: timestamp('from').notNull(),
  to: timestamp('to').notNull(),
  typeAllowance: text('type_allowance', {
    enum: enumTypeAllowance,
  }).notNull(),
  percent: text('percent').notNull(),
  factor: text('factor').notNull(),

  amount: text('amount').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recordsHouse = pgTable('records_house', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  typeHouse: text('type_house', {
    enum: enumTypeHouse,
  }).notNull(),
  area: text('area').notNull(),
  documents: text('documents')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const recordsLand = pgTable('records_land', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id')
    .notNull()
    .references(() => records.id),
  typeLand: text('type_land', {
    enum: enumTypeLand,
  }).notNull(),
  area: text('area').notNull(),
  documents: text('documents'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const recordsImprisioned = pgTable('records_imprisioned', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id').references(() => records.id),
  from: timestamp('from').notNull(),
  to: timestamp('to').notNull(),
  at: text('at').notNull(),
  providedTo: text('provided_to').notNull(),
  problems: text('problems').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recordsOldRegime = pgTable('records_old_regime', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id').references(() => records.id),
  department: text('department').notNull(),
  address: text('address').notNull(),
  duty: text('duty').notNull(),
  from: timestamp('from').notNull(),
  to: timestamp('to').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const recordsOrganization = pgTable('records_organization', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  recordId: uuid('record_id').references(() => records.id),
  organization: text('organization').notNull(),
  located: text('located').notNull(),
  do: text('do').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const recordsRelative = pgTable('records_relative', {
  id: uuid('id')
    .$default(() => uuidv4())
    .primaryKey(),
  relation: text('relation', {
    enum: enumRelation,
  }).notNull(),
  recordId: uuid('record_id').references(() => records.id),
  fullName: text('full_name').notNull(),
  country: text('country').notNull(),
  job: text('job').notNull(),
  address: text('address').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const recordsInsurance = pgTable('records_insurance', {
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
export type RecordsRetirement = typeof recordsRetirement.$inferSelect;
export type RecordsLanguages = typeof recordsToLanguages.$inferSelect;
export type EnumQualifications = typeof records.$inferSelect.qualification;
export type EnumBloodType = typeof records.$inferSelect.bloodType;
export type Roles = typeof roles.$inferSelect;
export type Permissions = typeof permissions.$inferSelect;
export type RolePermissions = typeof rolePermissions.$inferSelect;
export type RecordsDiscipline = typeof recordsDiscipline.$inferSelect;
export type RecordsCommendation = typeof recordsCommendation.$inferSelect;
export type RecordsRemark = typeof recordsRemark.$inferSelect;
export type RecordsContract = typeof recordsContract.$inferSelect;
export type RecordsTraining = typeof recordsTraining.$inferSelect;
export type RecordsProfession = typeof recordsProfession.$inferSelect;
export type RecordsWorkExperience = typeof recordsWorkExperience.$inferSelect;
export type RecordsRelationship = typeof recordsRelationship.$inferSelect;
export type RecordsSalary = typeof recordsSalary.$inferSelect;
export type RecordsAllowance = typeof recordsAllowance.$inferSelect;
export type RecordsHouse = typeof recordsHouse.$inferSelect;
export type RecordsLand = typeof recordsLand.$inferSelect;
export type AcademicQualifications = typeof academicQualifications.$inferSelect;
export type MilitaryRanks = typeof militaryRanks.$inferSelect;
export type Qualifications = typeof qualifications.$inferSelect;
export type PublicEmployeeRanks = typeof publicEmployeeRanks.$inferSelect;
export type CivilServantRanks = typeof civilServantRanks.$inferSelect;
export type FamilyBackgrounds = typeof familyBackgrounds.$inferSelect;
export type LanguageCertifications = typeof languageCertifications.$inferSelect;
export type TechnologyCertifications =
  typeof technologyCertifications.$inferSelect;
export type Appellations = typeof appellations.$inferSelect;
export type FormCommendations = typeof formCommendations.$inferSelect;
export type FormDisciplines = typeof formDisciplines.$inferSelect;
export type FormRemarks = typeof formRemarks.$inferSelect;
export type FormRetires = typeof formRetires.$inferSelect;
export type FormRecruitments = typeof formRecruitments.$inferSelect;
export type FormTrainings = typeof formTrainings.$inferSelect;
export type SalaryGrades = typeof salaryGrades.$inferSelect;
export type Positions = typeof positions.$inferSelect;
export type Duties = typeof duties.$inferSelect;
export type Ethnicities = typeof ethnicities.$inferSelect;
export type Religions = typeof religions.$inferSelect;
export type PolicyObjects = typeof policyObjects.$inferSelect;
export type Salaries = typeof salaries.$inferSelect;
export type PartyCommittees = typeof partyCommittees.$inferSelect;
export type RecordsImprisioned = typeof recordsImprisioned.$inferSelect;
export type RecordsOldRegime = typeof recordsOldRegime.$inferSelect;
export type RecordsOrganization = typeof recordsOrganization.$inferSelect;
export type RecordsRelative = typeof recordsRelative.$inferSelect;
