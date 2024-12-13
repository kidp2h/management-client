import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ClerkCode } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat('vi-VN', {
    month: opts.month ?? 'long',
    day: opts.day ?? 'numeric',
    year: opts.year ?? 'numeric',
    ...opts,
  }).format(new Date(date));
}

/**
 * Stole this from the @radix-ui/primitive
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

export function handleClerkException(err: any, callback: () => void) {
  if (isClerkAPIResponseError(err)) {
    switch (err.errors[0].code) {
      case ClerkCode.NOT_FOUND:
        callback();
        break;
      case ClerkCode.INVALID_PASSWORD:
        callback();
        break;
      default:
        callback();
    }
  }
}

export function toSlug(str: string) {
  // Chuyển hết sang chữ thường
  str = str.toLowerCase();

  // xóa dấu
  str = str
    .normalize('NFD') // chuyển chuỗi sang unicode tổ hợp
    // eslint-disable-next-line unicorn/escape-case
    .replace(/[\u0300-\u036f]/g, ''); // xóa các ký tự dấu sau khi tách tổ hợp

  // Thay ký tự đĐ
  // eslint-disable-next-line regexp/no-dupe-characters-character-class
  str = str.replace(/[đĐ]/i, 'd');

  // Xóa ký tự đặc biệt
  str = str.replace(/([^0-9a-z-\s])/g, '');

  // Xóa khoảng trắng thay bằng ký tự -
  str = str.replace(/(\s+)/g, '-');

  // Xóa ký tự - liên tiếp
  str = str.replace(/-+/g, '-');

  // xóa phần dư - ở đầu & cuối
  str = str.replace(/^-+|-+$/g, '');

  // return
  return str;
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {},
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}

export function getFileExt(filename: string) {
  return filename.split('.').pop();
}

export function isImage(filename: string) {
  const ext = getFileExt(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext ?? '');
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function flat(a, keyChildren = 'children') {
  return a.reduce((flattened, { children, ...rest }) => {
    return flattened
      .concat([{ ...rest }])
      .concat(children ? flat(children) : []);
  }, []);
}

export function extractDateParts(date: Date | null) {
  if (!date) return null;
  return {
    day: date.getDate(),
    month: date.getMonth() + 1, // Months are 0-indexed
    year: date.getFullYear(),
  };
}
