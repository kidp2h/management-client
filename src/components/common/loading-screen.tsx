'use client';
import { useTheme } from 'next-themes';
import React from 'react';
import PropagateLoader from 'react-spinners/PropagateLoader';

export const LoadingScreen = ({ isLoading }: { isLoading: boolean }) => {
  const { theme } = useTheme();
  const [color] = React.useState(theme === 'dark' ? 'white' : 'black');
  return (
    isLoading && (
      <div className="fixed z-50 flex size-full items-center  justify-center overflow-hidden bg-white bg-opacity-40 backdrop-blur-sm dark:bg-black dark:bg-opacity-80">
        <PropagateLoader color={color} />
      </div>
    )
  );
};
