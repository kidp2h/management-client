'use server';
import provinces from '@/provinces.json';
import classifications from '@/classifications.json';

export const getProvinces = async () => {
  return Promise.resolve(provinces);
};

export const getClassifications = async () => {
  return Promise.resolve(classifications);
};
