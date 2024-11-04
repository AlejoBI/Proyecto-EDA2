import { Router } from 'express';
import { createUser, deleteUser } from '../controllers/admin.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createUserSchema } from '../schemas/admin.schema.js';

const router = Router();

router.post('/createUser', validateSchema(createUserSchema), createUser);
router.delete('/deleteUser', deleteUser);
export default router;
