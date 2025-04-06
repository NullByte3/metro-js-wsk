import express from 'express';
import { body } from 'express-validator';
import { 
  getUsers, 
  getUserById, 
  postUser, 
  putUser, 
  deleteUser 
} from '../controllers/user-controller.js';
import { 
  authenticateToken, 
  validationErrors 
} from '../../middlewares.js';

const userRouter = express.Router();

userRouter.route('/')
  .get(getUsers)
  .post(
    body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body('email').trim().isEmail(),
    body('password').trim().isLength({ min: 8 }),
    body('name').trim().isLength({ min: 3, max: 100 }),
    validationErrors,
    postUser
  );

userRouter.route('/:id')
  .get(getUserById)
  .put(
    authenticateToken,
    body('username').optional().trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body('email').optional().trim().isEmail(),
    body('password').optional().trim().isLength({ min: 8 }),
    body('name').optional().trim().isLength({ min: 3, max: 100 }),
    validationErrors,
    putUser
  )
  .delete(authenticateToken, deleteUser);

export default userRouter;
