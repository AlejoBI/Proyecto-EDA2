import { Router } from 'express';
import { createJob, getAllJobs, updateJob, deleteJob } from '../controllers/jobs.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { jobSchema } from '../schemas/jobs.schema.js';

const router = Router();

router.post('/createJob', validateSchema(jobSchema), createJob);

router.get('/allJobs', getAllJobs);

router.put('/updateJob', validateSchema(jobSchema), updateJob);

router.delete('/deleteJob', deleteJob);

export default router;