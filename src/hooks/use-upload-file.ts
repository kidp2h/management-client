import * as React from 'react';
import type { UploadedFile } from '@/types';
import { toast } from 'sonner';
import type {
  ClientUploadedFileData,
  UploadFilesOptions,
} from 'uploadthing/types';

import { getErrorMessage } from '@/lib/handle-error';
import { uploadFiles } from '@/lib/uploadthing';
import { type OurFileRouter } from '@/app/api/uploadthing/core';

interface UseUploadFileProps
  extends Pick<
    UploadFilesOptions<any>,
    'headers' | 'onUploadBegin' | 'onUploadProgress' | 'skipPolling'
  > {
  defaultUploadedFiles?: UploadedFile[];
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  { defaultUploadedFiles = [], ...props }: UseUploadFileProps = {},
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<UploadedFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {},
  );
  const [isUploading, setIsUploading] = React.useState(false);

  async function onUpload(
    files: File[] | undefined | null,
    callback: (res: ClientUploadedFileData<unknown>[]) => void,
  ) {
    setIsUploading(true);
    try {
      if (!files || files?.length === 0) {
        return callback([]);
      }
      const res = await uploadFiles(endpoint, {
        ...props,
        files,
        onUploadProgress: ({ file, progress }) => {
          setProgresses(prev => {
            return {
              ...prev,
              [file as any]: progress,
            };
          });
        },
      });
      console.log(res);
      await callback(res);
      setUploadedFiles(prev => (prev ? [...prev, ...res] : res));
    } catch (err) {
      console.log('erro ne', err);
      toast.error('File không hợp lệ');
      throw new Error("Can't upload file");
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  };
}
