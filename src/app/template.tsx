'use client';
import 'dayjs/locale/vi';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  dayjs.locale('vi');
  dayjs.extend(isBetween);
  return <div>{children}</div>;
}
