import z from 'zod';

import { searchParamsSchema } from '.';

export const partyCommitteeSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type PartyCommitteesSchema = z.infer<typeof partyCommitteeSchema>;
export const getPartyCommitteesSchema = z.object({
  ...searchParamsSchema.shape,
  ...partyCommitteeSchema.shape,
});
export type GetPartyCommitteesSchema = z.infer<typeof getPartyCommitteesSchema>;

export const createPartyCommitteeSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên cấp uỷ'),
});

export const updatePartyCommitteeSchema = createPartyCommitteeSchema;
export type CreatePartyCommitteeSchema = z.infer<
  typeof createPartyCommitteeSchema
>;
export type UpdatePartyCommitteeSchema = z.infer<
  typeof createPartyCommitteeSchema
>;
