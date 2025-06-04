import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['INTERN', 'ENGINEER', 'ADMIN']),
});

export type User = z.infer<typeof userSchema>;
