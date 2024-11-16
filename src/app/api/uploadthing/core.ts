import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

// Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: { maxFileSize: '4MB', maxFileCount: 4 },
    'application/msword': { maxFileSize: '16MB', maxFileCount: 4 },
    'application/pdf': { maxFileSize: '16MB', maxFileCount: 4 },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      maxFileSize: '16MB',
      maxFileCount: 4,
    },
  })
    .onUploadError(e => {
      console.error('upload error', e);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('metadata:', metadata);

      console.log('file url', file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      // return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
