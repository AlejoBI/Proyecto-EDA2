import { Router } from 'express';
<<<<<<< Updated upstream
import { register, login, logout, profile, getAllUsers, checkAuth } from '../controllers/auth.controller.js';
=======
import { register, login, logout, profile, checkAuth, updateProfile } from '../controllers/auth.controller.js';
>>>>>>> Stashed changes
import { validateSchema } from '../middlewares/validator.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/register', validateSchema(registerSchema), register);

router.post('/login', validateSchema(loginSchema), login);

router.post('/logout', logout);

router.get('/profile', profile);

<<<<<<< Updated upstream
router.get('/all', getAllUsers);
=======
router.put('/update-profile', updateProfile);
>>>>>>> Stashed changes

router.get('/check-auth', checkAuth);

export default router;