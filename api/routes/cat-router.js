import express from 'express';
import { getCats, getCatById, postCat, putCat, deleteCat } from '../controllers/cat-controller.js';

const catRouter = express.Router();

catRouter.route('/').get(getCats).post(postCat);
catRouter.route('/:id').get(getCatById).put(putCat).delete(deleteCat);

export default catRouter;
