import express from 'express';
import { body } from 'express-validator';
import { 
  getCats, 
  getCatById, 
  getCatsByUser,
  postCat, 
  putCat, 
  deleteCat 
} from '../controllers/cat-controller.js';
import { 
  authenticateToken, 
  upload,
  createThumbnail,
  validationErrors
} from '../../middlewares.js';

const catRouter = express.Router();

catRouter.route('/')
  .get(getCats)
  .post(
    authenticateToken,
    upload.single('file'),
    createThumbnail,
    body('cat_name').trim().isLength({ min: 3, max: 50 }),
    body('weight').isNumeric(),
    body('birthdate').isDate(),
    validationErrors,
    postCat
  );

catRouter.route('/user/:id')
  .get(getCatsByUser);

catRouter.route('/:id')
  .get(getCatById)
  .put(
    authenticateToken,
    body('cat_name').optional().trim().isLength({ min: 3, max: 50 }),
    body('weight').optional().isNumeric(),
    body('birthdate').optional().isDate(),
    validationErrors,
    putCat
  )
  .delete(authenticateToken, deleteCat);

export default catRouter;
