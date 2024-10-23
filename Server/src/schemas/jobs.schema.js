import z from 'zod';

export const jobSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  company: z.string().min(1, "La compañía es requerida"),
  country: z.string().min(1, "El país es requerido"),
  city: z.string().min(1, "La ciudad es requerida"),
  salary: z.string().min(1, "El salario es requerido"),
  postedDate: z.date().default(() => new Date())
});
