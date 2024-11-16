import { z } from 'zod';

export const fileSchema = z.object({
  files: z.array(z.instanceof(File)).optional(),
});
export type FileSchema = z.infer<typeof fileSchema>;
