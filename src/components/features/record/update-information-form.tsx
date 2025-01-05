'use client';
import { FileUploader } from '@/components/common/file-uploader';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { updateInformationRecord } from '@/db/actions/records';
import { getAllAppellations } from '@/db/queries/appellations';
import { getAllCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import { getAllDuties } from '@/db/queries/duties';
import { getAllEthnicities } from '@/db/queries/ethnicities';
import { getAllFamilyBackgrounds } from '@/db/queries/family-backgrounds';
import { getAllMilitaryRanks } from '@/db/queries/military-ranks';
import { getAllPartyCommittees } from '@/db/queries/party-committees';
import { getAllPublicEmployeeRanks } from '@/db/queries/public-employee-ranks';
import { getAllQualifications } from '@/db/queries/qualifications';
import { getAllReligions } from '@/db/queries/religions';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';
import {
  enumBloodType,
  enumGender,
  enumHealthStatus,
  enumPoliticalTheory,
} from '@/db/schema';
import { useUploadFile } from '@/hooks/use-upload-file';
import { updateInformationRecordSchema } from '@/lib/zod/schemas/record-schema';
import { useGlobalStore } from '@/providers/global-store-provider';
import { ReloadIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import {
  Activity,
  Award,
  Badge,
  BookHeart,
  BookOpenText,
  BriefcaseBusiness,
  CalendarClock,
  ChartNoAxesGantt,
  Dna,
  FileBadge2,
  FlagTriangleLeft,
  Goal,
  GraduationCap,
  HandCoins,
  Hash,
  HeartPulse,
  IdCard,
  LocateFixed,
  MapPin,
  MapPinHouse,
  MapPinned,
  Navigation,
  Ruler,
  ShieldEllipsis,
  SquareArrowOutDownRight,
  SquareStack,
  TypeOutline,
  University,
  Weight,
} from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface DataInformation {
  religions: ReturnType<typeof getAllReligions>;
  publicEmployeeRanks: ReturnType<typeof getAllPublicEmployeeRanks>;
  civilServantRanks: ReturnType<typeof getAllCivilServantRanks>;
  // policyObjects: ReturnType<typeof getAllPolicyObjects>;
  militaryRanks: ReturnType<typeof getAllMilitaryRanks>;
  // academicQualifications: ReturnType<typeof getAllAcademicQualifications>;
  qualifications: ReturnType<typeof getAllQualifications>;
  appellations: ReturnType<typeof getAllAppellations>;
  ethnicities: ReturnType<typeof getAllEthnicities>;
  salaryGrades: ReturnType<typeof getAllSalaryGrades>;
  familyBackgrounds: ReturnType<typeof getAllFamilyBackgrounds>;
  partyCommittees: ReturnType<typeof getAllPartyCommittees>;
  duties: ReturnType<typeof getAllDuties>;
}
export interface UpdateInformationFormProps {
  defaultValues: any;
  data: DataInformation;
  setTab: (tab: string) => void;
}

export default function UpdateInformationForm({
  defaultValues,
  data,
  setTab,
}: UpdateInformationFormProps) {
  const { fetchProvinces, provinces, fetchClassifications, classifications } =
    useGlobalStore(state => state);

  const [isUpdatePending, startUpdateTransition] = useTransition();
  const { data: religions } = React.use(data.religions);
  const { data: ethnicities } = React.use(data.ethnicities);
  const { data: militaryRanks } = React.use(data.militaryRanks);
  const { data: salaryGrades } = React.use(data.salaryGrades);
  const { data: publicEmployeeRanks } = React.use(data.publicEmployeeRanks);
  const { data: civilServantRanks } = React.use(data.civilServantRanks);
  // const { data: policyObjects } = React.use(data.policyObjects);
  // const { data: academicQualifications } = React.use(
  //   data.academicQualifications,
  // );
  const { data: duties } = React.use(data.duties);
  const [changes, setChanges] = React.useState<any[]>([]);
  const { data: partyCommittees } = React.use(data.partyCommittees);
  const { data: appellations } = React.use(data.appellations);

  const { data: qualifications } = React.use(data.qualifications);

  const { data: familyBackgrounds } = React.use(data.familyBackgrounds);
  const rangeYears = useCallback((stop, step) => {
    const currentYear = new Date().getFullYear();

    return Array.from(
      { length: (stop - currentYear) / step + 1 },
      (_, i) => currentYear + i * step,
    );
  }, []);
  const refInputFile = React.useRef<HTMLInputElement>(null);
  const classificationsMapped = React.useMemo(() => {
    return classifications.map(i => ({
      label: `[${i.code}] ${i.name}`,
      value: `[${i.code}] ${i.name}`,
    }));
  }, [classifications]);
  const [location, setLocation] = React.useState({
    province: undefined,
    district: undefined,
    ward: undefined,
  });
  const updateLocation = (key: string, value: any) => {
    setLocation(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };
  const [hometown, setHometown] = React.useState({
    province: undefined,
    district: undefined,
    ward: undefined,
  });
  const updateHometown = (key: string, value: any) => {
    setHometown(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  React.useEffect(() => {
    fetchProvinces();
    fetchClassifications();
    setHometown({
      province: defaultValues.hometown?.split('|')[3] || '',
      district: defaultValues.hometown?.split('|')[2] || '',
      ward: defaultValues.hometown?.split('|')[1] || '',
    });
    setLocation({
      province: defaultValues.currentResidence?.split('|')[3] || '',
      district: defaultValues.currentResidence?.split('|')[2] || '',
      ward: defaultValues.currentResidence?.split('|')[1] || '',
    });
  }, [fetchProvinces, fetchClassifications]);
  const form = useForm<z.infer<typeof updateInformationRecordSchema>>({
    // resolver: zodResolver(updateInformationRecordSchema),
    defaultValues: {
      ...defaultValues,
      // _province: defaultValues.province,
      // hometownAddress: defaultValues.hometown?.split('|')[0] || null,
      // hometownWard: defaultValues.hometown?.split('|')[1] || null,
      // hometownDistrict: defaultValues.hometown?.split('|')[2] || null,
      // hometownProvince: defaultValues.hometown?.split('|')[3] || null,
      // address: defaultValues.currentResidence?.split('|')[0] || null,
      // ward: defaultValues.currentResidence?.split('|')[1] || null,
      // district: defaultValues.currentResidence?.split('|')[2] || null,
      // province: defaultValues.currentResidence?.split('|')[3] || null,
    },
  });

  const { onUpload, progresses, isUploading } = useUploadFile('imageUploader', {
    defaultUploadedFiles: [],
  });
  const onSubmit = (values: z.infer<typeof updateInformationRecordSchema>) => {
    startUpdateTransition(async () => {
      toast.promise(
        onUpload(values.files, async uploaded => {
          delete values.files;
          console.log(changes);
          const { error } = await updateInformationRecord(
            form.formState.dirtyFields,
            defaultValues,
            {
              id: defaultValues.id,
              ...values,
            },
            uploaded || [],
          );
          if (error) {
            toast.error('Cập nhật hồ sơ thất bại');
            return;
          }
          toast.success(
            'Hồ sơ đã được cập nhật, vui lòng đợi cán bộ tổ chức duyệt hồ sơ',
          );
        }),
        {
          loading: 'Đang xử lý yêu cầu và tệp',
          success: () => {
            form.resetField('files');
            return 'Xử lý cập nhật thành công';
          },
          error: 'Xử lý yêu cầu thất bại',
        },
      );
    });
  };
  const handleUploadClick = () => {
    if (refInputFile.current) {
      refInputFile.current.click();
    }
  };

  const handleChanges = (key, newValue, oldValue) => {
    if (newValue !== oldValue) {
      // remove the key if it exists
      const index = changes.findIndex(change => change.key === key);
      if (index !== -1) {
        setChanges(prev => {
          const newChanges = [...prev];
          newChanges[index] = {
            key,
            newValue,
            oldValue,
          };
          return newChanges;
        });
      } else {
        setChanges(prev => [
          ...prev,
          {
            key,
            newValue,
            oldValue,
          },
        ]);
      }
    }
  };
  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      // Handle the selected file (e.g., upload it to the server or display a preview)
      // // console.log('Selected file:', file);
    }
  };

  return (
    <Form {...form}>
      {/* <pre>1{JSON.stringify(form.formState.dirtyFields, null, 2)}</pre> */}
      <div className="text-2xl font-bold uppercase mb-5">Thông tin hồ sơ</div>
      <div className="grid grid-cols-4 gap-5">
        <div>
          <span className="font-bold">Mã hồ sơ: </span>
          <span>{defaultValues.code}</span>
        </div>
        <div>
          <span className="font-bold">Họ và tên: </span>
          <span>{defaultValues.fullName}</span>
        </div>
        <div>
          <span className="font-bold">Giới tính: </span>
          <span>{defaultValues.gender}</span>
        </div>
        <div>
          <span className="font-bold">Tên gọi khác: </span>
          <span>
            {defaultValues.otherName === ''
              ? defaultValues.otherName
              : 'Chưa cập nhật'}
          </span>
        </div>
        <div>
          <span className="font-bold">Số hiệu cán bộ, công chức: </span>
          <span>
            {defaultValues.serialNumber === ''
              ? defaultValues.serialNumber
              : 'Chưa cập nhật'}
          </span>
        </div>
        <div>
          <span className="font-bold">Ngày sinh: </span>
          <span>
            {defaultValues?.birthday
              ? (dayjs(defaultValues.birthday).format('D-MM-YYYY') as string)
              : 'Chưa cập nhật'}
          </span>
        </div>
        <div>
          <span className="font-bold">Số điện thoại: </span>
          <span>
            {defaultValues?.phoneNumber
              ? (defaultValues.phoneNumber as string)
              : 'Chưa cập nhật'}
          </span>
        </div>
        <div>
          <span className="font-bold">Nơi sinh: </span>
          <span>
            {defaultValues.birthPlace === ''
              ? defaultValues.birthPlace
              : 'Chưa cập nhật'}
          </span>
        </div>
        <div>
          <span className="font-bold">Dân tộc: </span>
          <span>
            {ethnicities?.find(v => v.id === defaultValues.ethnicity)?.name
              ? ethnicities?.find(v => v.id === defaultValues.ethnicity)?.name
              : 'Chưa cập nhật'}
          </span>
        </div>
        <div>
          <span className="font-bold">Tôn giáo: </span>
          <span>
            {religions?.find(v => v.id === defaultValues.religion)?.name
              ? religions?.find(v => v.id === defaultValues.religion)?.name
              : 'Chưa cập nhật'}
          </span>
        </div>
      </div>
      <Separator className="my-5" />
      <div className="text-2xl font-bold uppercase mb-5">
        Biểu mẫu cập nhật thông tin
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-3 gap-5 mb-5">
          <div className="col-span-3 lg:col-span-1 grid grid-rows-2 grid-cols-1 gap-5">
            <FormField
              control={form.control}
              name="_province"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Tỉnh</FormLabel>
                  <Combobox
                    startIcon={MapPinned}
                    type="form"
                    form={form}
                    callback={label => {
                      handleChanges('_province', label, defaultValues.province);
                    }}
                    placeholder="Tỉnh"
                    field={field}
                    className="w-full"
                    dataset={provinces.map(province => ({
                      label: province.name,
                      value: province.name,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="affiliatedUnit"
              render={({ field }) => (
                <FormItem className="col-span-3 lg:col-span-1">
                  <FormLabel>Đơn vị trực thuộc</FormLabel>
                  <FormControl>
                    <Input
                      startIcon={Split}
                      placeholder="Đơn vị trực thuộc"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baseUnit"
              render={({ field }) => (
                <FormItem className="col-span-3 lg:col-span-1">
                  <FormLabel>Đơn vị cơ sở</FormLabel>
                  <FormControl>
                    <Input
                      startIcon={Baseline}
                      placeholder="Đơn vị cơ sở"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem className="col-span-3 lg:col-span-1">
                  <FormLabel>Số hiệu cán bộ, công chức</FormLabel>
                  <FormControl>
                    <Input
                      startIcon={Badge}
                      placeholder="Số hiệu cán bộ, công chức"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="col-span-3" />
          {/* <div className="grid col-span-3 grid-cols-2 grid-rows-1"> */}
          <div className="flex lg:flex-row flex-col col-span-3 w-full gap-10 lg: lg:items-start items-center lg:justify-start justify-center">
            <div>
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <div className="w-44 h-72">
                    <FormItem className="w-full ">
                      <FormLabel>Ảnh 4x6</FormLabel>
                      {defaultValues.avatar?.split('|')?.[0] && (
                        <Link
                          href={defaultValues.avatar.split('|')[0]}
                          target="_blank"
                          className="text-blue-500 underline mt-3 block"
                        >
                          Xem ảnh hiện tại
                        </Link>
                      )}
                      <FormControl>
                        <FileUploader
                          value={field.value}
                          onValueChange={field.onChange}
                          className="size-full"
                          maxFileCount={1}
                          maxSize={4 * 1024 * 1024}
                          progresses={progresses}
                          disabled={isUploading}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              {/* <div
                className="w-44 cursor-pointer flex-col h-60 text-xs mt-8 rounded-xl border-dashed border-2 text-muted-foreground font-bold flex items-center justify-center"
                onClick={handleUploadClick}
              >
                Ảnh 4 x 6
                <br />
                <p className="">(Nhấn vào đây để tải ảnh lên)</p>
              </div>
              <Input type="file" className="hidden" ref={refInputFile} />
              <div className="w-14 h-16 mt-3 bg-red-500"></div> */}
            </div>

            <div className="grid grid-cols-3 gap-5 mb-5 col-span-3 w-full">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="col-span-3 lg:col-span-1">
                    <FormLabel>1. Họ và tên</FormLabel>
                    <FormControl>
                      <Input
                        startIcon={TypeOutline}
                        placeholder="Họ và tên"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="col-span-3 lg:col-span-1">
                    <FormLabel>Giới tính</FormLabel>
                    <FormControl>
                      <Combobox
                        startIcon={Dna}
                        type="form"
                        form={form}
                        field={field}
                        placeholder="Chọn giới tính"
                        callback={() => {
                          handleChanges(
                            'gender',
                            form.getValues().gender,
                            defaultValues.gender,
                          );
                        }}
                        dataset={enumGender.map(gender => ({
                          label: gender,
                          value: gender,
                        }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otherName"
                render={({ field }) => (
                  <FormItem className="col-span-3 lg:col-span-1">
                    <FormLabel>2. Tên gọi khác</FormLabel>
                    <FormControl>
                      <Input
                        startIcon={TypeOutline}
                        placeholder="Tên gọi khác"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <>
                {/* <div className="col-span-3 lg:col-span-1 flex flex-col lg:flex-row gap-5"> */}
                <FormField
                  control={form.control}
                  name="partyCommitteeLevelId"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>3. Cấp uỷ hiện tại</FormLabel>
                      <FormControl>
                        <Combobox
                          startIcon={FlagTriangleLeft}
                          type="form"
                          form={form}
                          placeholder="Chọn cấp uỷ hiện tại"
                          field={field}
                          className="w-full"
                          callback={() => {
                            handleChanges(
                              'partyCommitteeLevelId',
                              form.getValues().partyCommitteeLevelId,
                              defaultValues.partyCommitteeLevelId,
                            );
                          }}
                          dataset={
                            partyCommittees
                              ?.filter(
                                pC =>
                                  pC.id !==
                                  form.getValues().partyCommitteeConcurrentId,
                              )
                              ?.map(pC => ({
                                label: pC.name,
                                value: `${pC.id}.${pC.name}`,
                              })) || []
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="partyCommitteeConcurrentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cấp uỷ kiêm</FormLabel>
                      <FormControl>
                        <Combobox
                          startIcon={FlagTriangleLeft}
                          type="form"
                          form={form}
                          placeholder="Chọn cấp uỷ kiêm"
                          field={field}
                          className="w-full"
                          callback={() => {
                            handleChanges(
                              'partyCommitteeConcurrentId',
                              form.getValues().partyCommitteeConcurrentId,
                              defaultValues.partyCommitteeConcurrentId,
                            );
                          }}
                          dataset={
                            partyCommittees
                              ?.filter(
                                pC =>
                                  pC.id !==
                                  form.getValues().partyCommitteeLevelId,
                              )
                              ?.map(pC => ({
                                label: pC.name,
                                value: `${pC.id}.${pC.name}`,
                              })) || []
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* </div> */}

                <FormField
                  control={form.control}
                  name="dutyId"
                  render={({ field }) => (
                    <FormItem className="col-span-3 lg:col-span-1">
                      <FormLabel>Chức vụ</FormLabel>
                      <FormControl>
                        <Combobox
                          startIcon={Goal}
                          type="form"
                          form={form}
                          placeholder="Chọn chức vụ"
                          callback={() => {
                            handleChanges(
                              'dutyId',
                              form.getValues().dutyId,
                              defaultValues.dutyId,
                            );
                          }}
                          field={field}
                          className="w-full"
                          dataset={
                            duties?.map(d => ({
                              label: d.name,
                              value: `${d.id}.${d.name}`,
                            })) || []
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dutyAllowance"
                  render={({ field }) => (
                    <FormItem className="col-span-3 lg:col-span-1">
                      <FormLabel>Phụ cấp chức vụ</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          startIcon={HandCoins}
                          unit="đồng"
                          pattern="[0-9]*"
                          placeholder="Phụ cấp chức vụ"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
              <div className="col-span-3 grid-cols-1 lg:grid-cols-2 grid gap-3">
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>4. Ngày sinh</FormLabel>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        callback={() => {
                          setChanges(prev => [
                            ...prev,
                            {
                              key: 'birthday',
                              newValue: form.getValues().birthday,
                              oldValue: defaultValues.birthday,
                            },
                          ]);
                        }}
                        placeholder="Ngày sinh"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthPlace"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>5. Nơi sinh</FormLabel>
                      <Combobox
                        startIcon={MapPinned}
                        type="form"
                        form={form}
                        placeholder="Nơi sinh"
                        field={field}
                        className="w-full"
                        callback={() => {
                          if (
                            form.getValues().birthPlace !==
                            defaultValues.birthPlace
                          ) {
                            setChanges(prev => [...prev, 'birthPlace']);
                          }
                        }}
                        dataset={provinces.map(province => ({
                          label: province.name,
                          value: province.name,
                        }))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* </div> */}

          <>
            <span className="col-span-3 text-sm ">6. Quê quán</span>
            <Separator className="col-span-3" />
            <FormField
              control={form.control}
              name="hometownProvince"
              render={({ field }) => (
                <FormItem className="pb-3 col-span-3 lg:col-span-1">
                  <FormLabel>Tỉnh/Thành</FormLabel>
                  <Combobox
                    startIcon={MapPinned}
                    type="form"
                    form={form}
                    placeholder="Tỉnh/Thành"
                    field={field}
                    callback={() => {
                      form.setValue('hometownDistrict', undefined);
                      form.setValue('hometownWard', undefined);
                      updateHometown('district', undefined);
                      updateHometown('ward', undefined);
                    }}
                    className="w-full"
                    setValue={value => {
                      updateHometown('province', value);
                    }}
                    dataset={provinces.map(province => ({
                      label: province.name,
                      value: province.name,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hometownDistrict"
              render={({ field }) => (
                <FormItem className="pb-3 col-span-3 lg:col-span-1">
                  <FormLabel>Quận/Huyện</FormLabel>
                  <Combobox
                    startIcon={MapPin}
                    type="form"
                    form={form}
                    placeholder="Quận/Huyện"
                    field={field}
                    setValue={value => {
                      updateHometown('district', value);
                    }}
                    className="w-full"
                    callback={() => {
                      form.setValue('ward', undefined);
                      updateHometown('ward', undefined);
                    }}
                    disabled={!hometown.province}
                    dataset={
                      provinces
                        .filter(
                          _province => _province.name === hometown.province,
                        )[0]
                        ?.districts.map((district: any) => ({
                          label: district.name,
                          value: district.name,
                        })) || []
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hometownWard"
              render={({ field }) => (
                <FormItem className="pb-3 col-span-3 lg:col-span-1">
                  <FormLabel>Phường/Xã</FormLabel>
                  <Combobox
                    startIcon={LocateFixed}
                    type="form"
                    form={form}
                    placeholder="Phường/Xã"
                    field={field}
                    disabled={!hometown.district}
                    className="w-full"
                    setValue={value => {
                      updateHometown('ward', value);
                    }}
                    dataset={
                      provinces
                        .filter(
                          _province => _province.name === hometown.province,
                        )[0]
                        ?.districts.filter(
                          (_district: any) =>
                            _district.name === hometown.district,
                        )[0]
                        ?.wards.map((ward: any) => ({
                          label: ward.name,
                          value: ward.name,
                        })) || []
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hometownAddress"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input
                      startIcon={MapPinHouse}
                      placeholder="Địa chỉ"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>

          <>
            <span className="col-span-3 text-sm ">7. Nơi ở hiện nay</span>
            <Separator className="col-span-3" />
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem className="pb-3 col-span-3 lg:col-span-1">
                  <FormLabel>Tỉnh/Thành</FormLabel>
                  <Combobox
                    startIcon={MapPinned}
                    type="form"
                    form={form}
                    placeholder="Tỉnh/Thành"
                    field={field}
                    callback={() => {
                      form.setValue('district', undefined);
                      form.setValue('ward', undefined);
                      updateLocation('district', undefined);
                      updateLocation('ward', undefined);
                    }}
                    className="w-full"
                    setValue={value => {
                      updateLocation('province', value);
                    }}
                    dataset={provinces.map(province => ({
                      label: province.name,
                      value: province.name,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem className="pb-3 col-span-3 lg:col-span-1">
                  <FormLabel>Quận/Huyện</FormLabel>
                  <Combobox
                    startIcon={MapPin}
                    type="form"
                    form={form}
                    placeholder="Quận/Huyện"
                    field={field}
                    setValue={value => {
                      updateLocation('district', value);
                    }}
                    className="w-full"
                    callback={() => {
                      form.setValue('ward', undefined);
                      updateLocation('ward', undefined);
                    }}
                    disabled={!location.province}
                    dataset={
                      provinces
                        .filter(
                          _province => _province.name === location.province,
                        )[0]
                        ?.districts.map((district: any) => ({
                          label: district.name,
                          value: district.name,
                        })) || []
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem className="pb-3 col-span-3 lg:col-span-1">
                  <FormLabel>Phường/Xã</FormLabel>
                  <Combobox
                    startIcon={LocateFixed}
                    type="form"
                    form={form}
                    placeholder="Phường/Xã"
                    field={field}
                    disabled={!location.district}
                    className="w-full"
                    setValue={value => {
                      updateLocation('ward', value);
                    }}
                    dataset={
                      provinces
                        .filter(
                          _province => _province.name === location.province,
                        )[0]
                        ?.districts.filter(
                          (_district: any) =>
                            _district.name === location.district,
                        )[0]
                        ?.wards.map((ward: any) => ({
                          label: ward.name,
                          value: ward.name,
                        })) || []
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-3 lg:col-span-2">
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input
                      startIcon={MapPinHouse}
                      placeholder="Địa chỉ"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="col-span-3 lg:col-span-1">
                  <FormLabel>Điện thoại</FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      className="w-full"
                      defaultCountry="VN"
                      placeholder="Số điện thoại"
                      international
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>

          <FormField
            control={form.control}
            name="ethnicity"
            render={({ field }) => (
              <FormItem className="col-span-3 lg:col-span-1">
                <FormLabel>8. Dân tộc</FormLabel>
                <FormControl>
                  <Combobox
                    startIcon={University}
                    type="form"
                    form={form}
                    field={field}
                    placeholder="Chọn dân tộc"
                    dataset={
                      ethnicities?.map(e => ({
                        label: e.name,
                        value: `${e.id}.${e.name}`,
                      })) || []
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem className="col-span-3 lg:col-span-1">
                <FormLabel>9. Tôn giáo</FormLabel>
                <FormControl>
                  <Combobox
                    startIcon={University}
                    type="form"
                    form={form}
                    field={field}
                    placeholder="Chọn tôn giáo"
                    dataset={
                      religions?.map(religion => ({
                        label: religion.name,
                        value: `${religion.id}.${religion.name}`,
                      })) || []
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="familyBackground"
            render={({ field }) => (
              <FormItem className="col-span-3 lg:col-span-1">
                <FormLabel>10. Thành phần gia đình xuất thân</FormLabel>
                <FormControl>
                  <Combobox
                    startIcon={University}
                    type="form"
                    form={form}
                    field={field}
                    placeholder="Chọn thành phần gia đình xuất thân"
                    dataset={
                      familyBackgrounds?.map(f => ({
                        label: f.name,
                        value: `${f.id}.${f.name}`,
                      })) || []
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="insuranceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số BHXH</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    startIcon={Hospital}
                    placeholder="Số BHXH"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div className="col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="previousJob"
              render={({ field }) => (
                <FormItem className="col-span-3 lg:col-span-1">
                  <FormLabel>
                    11. Nghề nghiệp trước khi được tuyển dụng
                  </FormLabel>
                  <FormControl>
                    <Input
                      startIcon={BriefcaseBusiness}
                      placeholder="Nghề nghiệp trước khi được tuyển dụng"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateHired"
              render={({ field }) => (
                <FormItem className="col-span-3 lg:col-span-1">
                  <FormLabel>12. Ngày được tuyển dụng</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      placeholder="Ngày được tuyển dụng"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-3 grid grid-cols-1 lg:grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="dateOfJoiningCurrentWorkPlace"
              render={({ field }) => (
                <FormItem className="col-span-3 lg:col-span-1">
                  <FormLabel>13. Ngày vào cơ quan hiện đang công tác</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      placeholder="Ngày vào cơ quan hiện đang công tác"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateJoiningRevolutionary"
              render={({ field }) => (
                <FormItem className="col-span-3 lg:col-span-1">
                  <FormLabel>Ngày tham gia cách mạng</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      placeholder="Ngày tham gia cách mạng"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateJoiningParty"
              render={({ field }) => (
                <FormItem className="col-span-3 lg:col-span-1">
                  <FormLabel>14. Ngày vào Đảng</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      placeholder="Ngày vào Đảng"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfficialJoiningParty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày chính thức</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      placeholder="Ngày chính thức"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="dateOfJoiningOrganization"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>
                  15. Ngày tham gia các tổ chức chính trị, xã hội
                </FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    placeholder="Ngày tham gia các tổ chức chính trị, xã hội"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <>
            {/* <Separator className="col-span-3" />
            <span className="col-span-3 font-bold text-xl">
              16. Thông tin nhập ngũ
            </span>
            <Separator className="col-span-3" /> */}
            <FormField
              control={form.control}
              name="dateOfEnlistment"
              render={({ field }) => (
                <FormItem className="col-span-3 lg:col-span-1">
                  <FormLabel>16. Ngày nhập ngũ</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      placeholder="Ngày nhập ngũ"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfDemobilization"
              render={({ field }) => (
                <FormItem className="col-span-3 lg:col-span-1">
                  <FormLabel>Ngày xuất ngũ</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      placeholder="Ngày xuất ngũ"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="highestMilitaryRank"
              render={({ field }) => (
                <FormItem className="col-span-3 lg:col-span-1">
                  <FormLabel>Quân hàm cao nhất</FormLabel>
                  <FormControl>
                    <Combobox
                      startIcon={FileBadge2}
                      type="form"
                      form={form}
                      placeholder="Chọn quân hàm cao nhất"
                      field={field}
                      dataset={
                        militaryRanks?.map(rank => ({
                          label: rank.name,
                          value: `${rank.id}.${rank.name}`,
                        })) || []
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>

          <>
            <span className="col-span-3 text-sm ">17. Trình độ học vấn</span>
            <Separator className="col-span-3" />
            <div className="col-span-full flex lg:flex-row flex-col gap-5">
              <FormField
                control={form.control}
                name="generalEducation"
                render={({ field }) => (
                  <FormItem className="lg:w-1/2 w-full">
                    <FormLabel>Giáo dục phổ thông/Hệ (10/12 năm)</FormLabel>
                    <FormControl>
                      <Input
                        startIcon={GraduationCap}
                        placeholder="Lớp mấy/ Hệ 10/12 năm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem className="lg:w-1/2 w-full">
                    <FormLabel>Học hàm/học vị cao nhất</FormLabel>
                    <FormControl>
                      <Combobox
                        startIcon={GraduationCap}
                        type="form"
                        form={form}
                        field={field}
                        placeholder="Chọn học hàm/học vị cao nhất"
                        dataset={
                          qualifications?.map(q => ({
                            label: q.name,
                            value: `${q.id}.${q.name}`,
                          })) || []
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-full flex lg:flex-row flex-col gap-5">
              <FormField
                control={form.control}
                name="politicalTheory"
                render={({ field }) => (
                  <FormItem className="lg:w-1/2 w-full">
                    <FormLabel>Lý luận chính trị</FormLabel>
                    <FormControl>
                      <Combobox
                        startIcon={ShieldEllipsis}
                        type="form"
                        form={form}
                        placeholder="Chọn lý luận chính trị"
                        field={field}
                        dataset={enumPoliticalTheory.map(i => ({
                          label: i,
                          value: i,
                        }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-rows-2 grid-cols-1">
                <span
                  className="text-sm cursor-pointer underline flex items-center flex-row gap-2 font-bold mt-1 text-blue-500"
                  onClick={() => setTab('commendation')}
                >
                  Ngoại ngữ
                  <SquareArrowOutDownRight className="size-4" />
                </span>
              </div>
            </div>
          </>
          {/* <Separator className="col-span-3" />
          <span className="col-span-3 font-bold text-xl">Sức khoẻ</span>
          <Separator className="col-span-3" /> */}
          <FormField
            control={form.control}
            name="currentMainWork"
            render={({ field }) => (
              <FormItem className="w-full col-span-3">
                <FormLabel>18. Công tác chính đang làm</FormLabel>
                <FormControl>
                  <Input
                    startIcon={BookOpenText}
                    placeholder="Công tác chính đang làm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-3 grid grid-cols-3 gap-5">
            <FormField
              control={form.control}
              name="civilServantRankId"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>19. Ngạch công chức</FormLabel>
                  <FormControl>
                    <Combobox
                      type="form"
                      startIcon={BriefcaseBusiness}
                      form={form}
                      lazy={false}
                      placeholder="Chọn ngạch công chức"
                      field={field}
                      dataset={
                        civilServantRanks?.map(rank => ({
                          label: `[${rank.code}] [${rank.type}] ${rank.name}`,
                          value: `${rank.id}.${rank.name}`,
                        })) || []
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salaryGradeId"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Bậc lương</FormLabel>
                  <FormControl>
                    <Combobox
                      startIcon={ChartNoAxesGantt}
                      type="form"
                      form={form}
                      placeholder="Bậc lương"
                      field={field}
                      dataset={
                        salaryGrades?.map(grade => ({
                          label: grade.name,
                          value: `${grade.id}.${grade.name}`,
                        })) || []
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="overAllowance"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Phụ cấp vượt khung</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      step="1"
                      unit="%"
                      startIcon={HandCoins}
                      pattern="[0-9]*"
                      placeholder="Phụ cấp vượt khung"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="overAllowance"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Phụ cấp thâm niên</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      step="1"
                      unit="%"
                      startIcon={HandCoins}
                      pattern="[0-9]*"
                      placeholder="Phụ cấp thâm niên"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="salaryFactor"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Hệ số lương</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        step="0.1"
                        startIcon={Hash}
                        pattern="[0-9]*"
                        placeholder="Hệ số lương"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfAppointment"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Ngày bổ nhiệm ngạch</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        placeholder="Ngày bổ nhiệm ngạch"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="appellationId"
            render={({ field }) => (
              <FormItem className="col-span-3 lg:col-span-1">
                <FormLabel>
                  20. Danh hiệu nhà nước phong tặng cao nhất
                </FormLabel>
                <FormControl>
                  <Combobox
                    startIcon={Award}
                    type="form"
                    form={form}
                    field={field}
                    placeholder="Danh hiệu nhà nước phong tặng"
                    dataset={
                      appellations?.map(a => ({
                        label: a.name,
                        value: `${a.id}.${a.name}`,
                      })) || []
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="appellationYear"
            render={({ field }) => (
              <FormItem className="col-span-3 lg:col-span-1">
                <FormLabel>Danh hiệu được phong năm nào</FormLabel>
                <FormControl>
                  <Combobox
                    startIcon={Award}
                    type="form"
                    form={form}
                    field={field}
                    placeholder="Năm được phong tặng"
                    dataset={rangeYears(1960, -1).map(year => ({
                      label: year.toString(),
                      value: year.toString(),
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-full flex lg:flex-row flex-col gap-5">
            <FormField
              control={form.control}
              name="favouriteWork"
              render={({ field }) => (
                <FormItem className="lg:w-1/2 w-full">
                  <FormLabel>21. Sở trường công tác</FormLabel>
                  <FormControl>
                    <Input
                      startIcon={BookHeart}
                      placeholder="Sở trường công tác"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longestJob"
              render={({ field }) => (
                <FormItem className="lg:w-1/2 w-full">
                  <FormLabel>Công việc làm lâu nhất</FormLabel>
                  <FormControl>
                    <Input
                      startIcon={CalendarClock}
                      placeholder="Công việc làm lâu nhất"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-full grid grid-rows-2 gap-5 text-sm cursor-pointer underline font-bold text-blue-500">
            <span
              onClick={() => setTab('commendation')}
              className="flex flex-row items-center gap-1"
            >
              22. Khen thưởng <SquareArrowOutDownRight className="size-4" />
            </span>
            <span
              onClick={() => setTab('discipline')}
              className="flex flex-row items-center gap-1"
            >
              23. Kỷ luật <SquareArrowOutDownRight className="size-4" />
            </span>
          </div>

          <>
            <FormField
              control={form.control}
              name="healthStatus"
              render={({ field }) => (
                <FormItem className="lg:col-span-1 col-span-3">
                  <FormLabel>24. Tình trạng sức khoẻ</FormLabel>
                  <FormControl>
                    <Combobox
                      type="form"
                      form={form}
                      startIcon={Activity}
                      field={field}
                      placeholder="Chọn tình trạng sức khoẻ"
                      dataset={enumHealthStatus.map(i => ({
                        label: i,
                        value: i,
                      }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="lg:col-span-1 col-span-3 flex lg:flex-row flex-col gap-5">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chiều cao</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        unit="cm"
                        startIcon={Ruler}
                        pattern="[0-9]*"
                        placeholder="Chiều cao"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cân nặng</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        unit="kg"
                        startIcon={Weight}
                        placeholder="Cân nặng"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bloodType"
              render={({ field }) => (
                <FormItem className="lg:col-span-1 col-span-3">
                  <FormLabel>Nhóm máu</FormLabel>
                  <FormControl>
                    <Combobox
                      startIcon={HeartPulse}
                      type="form"
                      form={form}
                      field={field}
                      placeholder="Chọn nhóm máu"
                      dataset={enumBloodType.map(bloodType => ({
                        label: bloodType,
                        value: bloodType,
                      }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>

          <>
            <FormField
              control={form.control}
              name="identityCard"
              render={({ field }) => (
                <FormItem className="lg:col-span-1 col-span-3">
                  <FormLabel>25. Số CCCD/CMT</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      startIcon={IdCard}
                      pattern="[0-9]*"
                      placeholder="Số CCCD/CMT"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="lg:col-span-1 col-span-3 flex lg:flex-row flex-col gap-5">
              <FormField
                control={form.control}
                name="dateOfIssue"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Ngày cấp</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        placeholder="Ngày cấp"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="placeOfIssue"
                render={({ field }) => (
                  <FormItem className="pb-3 w-full ">
                    <FormLabel>Nơi cấp</FormLabel>
                    <Combobox
                      type="form"
                      form={form}
                      startIcon={Navigation}
                      placeholder="Nơi cấp"
                      field={field}
                      dataset={provinces.map(province => ({
                        label: province.name,
                        value: province.name,
                      }))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex lg:flex-row flex-col lg:col-span-1 col-span-3 gap-5">
              <FormField
                control={form.control}
                name="typeWounded"
                render={({ field }) => (
                  <FormItem className="pb-3 w-1/2 ">
                    <FormLabel>Thương binh loại</FormLabel>
                    <Combobox
                      type="form"
                      form={form}
                      startIcon={SquareStack}
                      placeholder="Chọn loại thương binh"
                      field={field}
                      dataset={['A', 'B'].map(type => ({
                        label: type,
                        value: type,
                      }))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isMartyrsFamily"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Gia đình liệt sĩ</FormLabel>
                    <div className="">
                      <FormControl className="bg-red-500 mt-5">
                        <Switch
                          className="flex "
                          onCheckedChange={field.onChange}
                          id="isPartyMember"
                          checked={field.value}
                        />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>

          {/* <Separator className="col-span-3" />
          <span className="col-span-3 font-bold text-xl">17. Học vấn</span>
          <Separator className="col-span-3" /> */}

          {/* <FormField
            control={form.control}
            name="englishCertification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chứng chỉ tiếng Anh</FormLabel>
                <FormControl>
                  <Combobox
                    type="form"
                    form={form}
                    startIcon={Languages}
                    placeholder="Chọn chứng chỉ tiếng Anh"
                    field={field}
                    dataset={enumEnglishCertification.map(cert => ({
                      label: cert,
                      value: cert,
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="technologyCertification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chứng chỉ Tin học</FormLabel>
                <FormControl>
                  <Combobox
                    type="form"
                    form={form}
                    startIcon={Cpu}
                    placeholder="Chọn chứng chỉ Tin học"
                    field={field}
                    dataset={enumTechnologyCertification.map(cert => ({
                      label: cert,
                      value: cert,
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* <FormField
            control={form.control}
            name="highestMilitaryRank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đối tượng chính sách</FormLabel>
                <FormControl>
                  <Combobox
                    startIcon={Group}
                    type="form"
                    form={form}
                    placeholder="Chọn đối tượng chính sách"
                    field={field}
                    dataset={
                      policyObjects?.map(p => ({
                        label: p.name,
                        value: p.id,
                      })) || []
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="highestMilitaryRank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trình độ chuyên môn cao nhất</FormLabel>
                <FormControl>
                  <Combobox
                    startIcon={Group}
                    type="form"
                    form={form}
                    placeholder="Chọn trình độ chuyên môn cao nhất"
                    field={field}
                    dataset={
                      qualifications?.map(q => ({
                        label: q.name,
                        value: q.id,
                      })) || []
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          {/* <Separator className="col-span-3" />
          <span className="col-span-3 font-bold text-xl">Lương</span>
          <Separator className="col-span-3" /> */}

          {/* <FormField
            control={form.control}
            name="dateOfEntilement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày được hưởng</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    placeholder="Ngày được hưởng"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          {/* <>
            <FormField
              control={form.control}
              name="dateOfAppointment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày bổ nhiệm ngạch công chức</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      placeholder="Ngày bổ nhiệm ngạch"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="percentageOfSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phần trăm hưởng</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      step="1"
                      startIcon={Percent}
                      unit="%"
                      pattern="[0-9]*"
                      placeholder="Phần trăm hưởng"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seniorityAllowance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phụ cấp thâm niên vượt khung</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      step="1"
                      startIcon={HandCoins}
                      unit="%"
                      pattern="[0-9]*"
                      placeholder="Phụ cấp thâm niên vượt khung"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfSeniorityAllowance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày hưởng PCTNVK</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      placeholder="Ngày hưởng PCTNVK"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </> */}
        </div>
        <Button type="submit" disabled={isUpdatePending}>
          {isUpdatePending && (
            <ReloadIcon
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Cập nhật
        </Button>
      </form>
      {/* <pre className="mt-5 block">
        <FormDescription>
          <code>{JSON.stringify(defaultValues, null, 2)}</code>
        </FormDescription>
      </pre> */}
    </Form>
  );
}
