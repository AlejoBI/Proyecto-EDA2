import { z } from 'zod';

export const createUserSchema = z.object({
    username: z.string({
        required_error: 'Username is required'
    }), 
    email: z.string({
        required_error: 'Email is required'
    }).email({
        message: 'Invalid email'
    }),
    password: z.string({
        required_error: 'Password is required'
    }).min(8, {
        message: 'Password must be at least 8 characters long'
    })
});