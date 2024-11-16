'use client';
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
import {
  enumBloodType,
  enumDegree,
  enumEnglishCertification,
  enumGender,
  enumHealthStatus,
  enumMilitaryRank,
  enumPoliticalTheory,
  enumReligions,
  enumTechnologyCertification,
} from '@/db/schema';
import { updateInformationRecordSchema } from '@/lib/zod/schemas/record-schema';
import { useGlobalStore } from '@/providers/global-store-provider';
import { ReloadIcon } from '@radix-ui/react-icons';
import {
  Activity,
  BriefcaseBusiness,
  ChartNoAxesGantt,
  Cpu,
  Dna,
  FileBadge2,
  GraduationCap,
  HandCoins,
  Hash,
  HeartPulse,
  Hospital,
  IdCard,
  Languages,
  LocateFixed,
  MapPin,
  MapPinHouse,
  MapPinned,
  Navigation,
  Percent,
  Ruler,
  ShieldEllipsis,
  TypeOutline,
  University,
  Weight,
} from 'lucide-react';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export interface UpdateInformationFormProps {
  defaultValues: any;
}

export default function UpdateInformationForm({
  defaultValues,
}: UpdateInformationFormProps) {
  const { fetchProvinces, provinces, fetchClassifications, classifications } =
    useGlobalStore(state => state);
  const [isUpdatePending, startUpdateTransition] = useTransition();

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
      province: defaultValues.birthPlace?.split('|')[3] || '',
      district: defaultValues.birthPlace?.split('|')[2] || '',
      ward: defaultValues.birthPlace?.split('|')[1] || '',
    });
  }, [fetchProvinces, fetchClassifications]);
  console.log(defaultValues);
  const form = useForm<z.infer<typeof updateInformationRecordSchema>>({
    defaultValues: {
      ...defaultValues,
      hometownAddress: defaultValues.hometown?.split('|')[0] || '',
      hometownWard: defaultValues.hometown?.split('|')[1] || '',
      hometownDistrict: defaultValues.hometown?.split('|')[2] || '',
      hometownProvince: defaultValues.hometown?.split('|')[3] || '',
      address: defaultValues.birthPlace?.split('|')[0] || '',
      ward: defaultValues.birthPlace?.split('|')[1] || '',
      district: defaultValues.birthPlace?.split('|')[2] || '',
      province: defaultValues.birthPlace?.split('|')[3] || '',
    },
  });
  const onSubmit = (values: z.infer<typeof updateInformationRecordSchema>) => {
    startUpdateTransition(async () => {
      const { error } = await updateInformationRecord({
        id: defaultValues.id,
        ...values,
        rankId: defaultValues.rankId,
      });
      if (error) {
        toast.error('Cập nhật hồ sơ thất bại');
        return;
      }
      toast.success('Hồ sơ đã được cập nhật');
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-3 gap-5 mb-5">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
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
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <FormControl>
                  <Combobox
                    startIcon={Dna}
                    type="form"
                    form={form}
                    field={field}
                    placeholder="Chọn giới tính"
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
            name="birthday"
            render={({ field }) => (
              <FormItem className="pb-3 md:col-span-full lg:col-span-1">
                <FormLabel>Ngày sinh</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Ngày sinh"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="healthStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tình trạng sức khoẻ</FormLabel>
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
          <FormField
            control={form.control}
            name="bloodType"
            render={({ field }) => (
              <FormItem>
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
          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tôn giáo</FormLabel>
                <FormControl>
                  <Combobox
                    startIcon={University}
                    type="form"
                    form={form}
                    field={field}
                    placeholder="Chọn tôn giáo"
                    dataset={enumReligions.map(religion => ({
                      label: religion,
                      value: religion,
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trình độ</FormLabel>
                <FormControl>
                  <Combobox
                    startIcon={GraduationCap}
                    type="form"
                    form={form}
                    field={field}
                    placeholder="Chọn trình độ"
                    dataset={enumDegree.map(degree => ({
                      label: degree,
                      value: degree,
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="identityCard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số CCCD/CMT</FormLabel>
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
          <FormField
            control={form.control}
            name="dateOfIssue"
            render={({ field }) => (
              <FormItem>
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
              <FormItem className="pb-3 ">
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

          <span className="col-span-3 font-bold text-xl">Quê quán</span>
          <Separator className="col-span-3" />
          <FormField
            control={form.control}
            name="hometownProvince"
            render={({ field }) => (
              <FormItem className="pb-3">
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
              <FormItem className="pb-3">
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
              <FormItem className="pb-3">
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
          <Separator className="col-span-3" />
          <span className="col-span-3 font-bold text-xl">Nơi sinh</span>
          <Separator className="col-span-3" />
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem className="pb-3">
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
              <FormItem className="pb-3">
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
              <FormItem className="pb-3">
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
          <Separator className="col-span-3" />
          <FormField
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
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
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
          <FormField
            control={form.control}
            name="dateOfEnlistment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày nhập ngũ</FormLabel>
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
              <FormItem>
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
              <FormItem>
                <FormLabel>Quân hàm cao nhất</FormLabel>
                <FormControl>
                  <Combobox
                    startIcon={FileBadge2}
                    type="form"
                    form={form}
                    placeholder="Chọn quân hàm cao nhất"
                    field={field}
                    dataset={enumMilitaryRank.map(rank => ({
                      label: rank,
                      value: rank,
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
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
          />
          <div className="col-span-1 flex flex-row gap-5">
            <FormField
              control={form.control}
              name="isPartyMember"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Là đảng viên</FormLabel>
                  <div className="">
                    <FormControl className="bg-red-500 mt-5">
                      <Switch
                        className="flex "
                        onCheckedChange={field.onChange}
                        id="isPartyMember"
                        checked={field.value}
                        color="#233fd2"
                      />
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateJoiningParty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày vào Đảng</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      placeholder="Ngày vào Đảng"
                      disabled={!form.getValues().isPartyMember}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="politicalTheory"
            render={({ field }) => (
              <FormItem>
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
          <FormField
            control={form.control}
            name="salaryGrade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bậc lương</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    startIcon={ChartNoAxesGantt}
                    pattern="[0-9]*"
                    placeholder="Bậc lương"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salaryFactor"
            render={({ field }) => (
              <FormItem>
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
          />
          <FormField
            control={form.control}
            name="classificationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngạch công chức</FormLabel>
                <FormControl>
                  <Combobox
                    type="form"
                    startIcon={BriefcaseBusiness}
                    form={form}
                    lazy={false}
                    placeholder="Chọn ngạch công chức"
                    field={field}
                    dataset={classificationsMapped}
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
    </Form>
  );
}
