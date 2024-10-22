import z from 'zod';

import { searchParamsSchema } from '.';

export const languageSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type LanguagesSchema = z.infer<typeof languageSchema>;
export const getLanguagesSchema = z.object({
  ...searchParamsSchema.shape,
  ...languageSchema.shape,
});
export type GetLanguagesSchema = z.infer<typeof getLanguagesSchema>;

export const createLanguageSchema = z.object({
  name: z
    .string({
      required_error: 'Ngôn ngữ không được để trống',
    })
    .describe('Ngôn ngữ'),
});

export const updateLanguageSchema = createLanguageSchema;
export type CreateLanguageSchema = z.infer<typeof createLanguageSchema>;
export type UpdateLanguageSchema = z.infer<typeof createLanguageSchema>;
