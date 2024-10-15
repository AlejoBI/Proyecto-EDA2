import z from 'zod';

export const jobSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  salary: z.string().min(1, "El salario es requerido"),
  postedDate: z.date().default(() => new Date())
});
