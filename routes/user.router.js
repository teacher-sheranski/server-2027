import { Router } from 'express';
import { validateBody } from '../middlewares/validateJoi.middleware.js';
import { registerSchema, signInSchema, updatePasswordSchema } from '../validations/user.validation.js';
import { login, register, updatePassword } from '../controllers/user.controller.js';

const router = Router();

// http://localhost:5000/users
// http://localhost:5000/users/
router.post('/', validateBody(registerSchema), register);

// http://localhost:5000/users/login
router.post('/login', validateBody(signInSchema), login);

// http://localhost:5000/users/password
router.patch('/password', validateBody(updatePasswordSchema), updatePassword);

export default router;