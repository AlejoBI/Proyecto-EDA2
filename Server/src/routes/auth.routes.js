import { Router } from 'express';
import { register, login, logout, profile, checkAuth, updateProfile } from '../controllers/auth.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/register', validateSchema(registerSchema), register);

router.post('/login', validateSchema(loginSchema), login);

router.post('/logout', logout);

router.get('/profile', profile);

router.put('/update-profile', updateProfile);

router.get('/check-auth', checkAuth);

export default router;