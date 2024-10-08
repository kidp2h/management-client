import React from 'react';

import { Navbar } from '@/components/common/navbar';

type ContentLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export const ContentLayout = React.memo(
  ({ title, children }: ContentLayoutProps) => {
    return (
      <div>
        <Navbar title={title} isAuth />
        <div className="px-4 py-8 sm:px-8">{children}</div>
      </div>
    );
  },
);
