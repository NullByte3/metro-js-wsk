import { 
  listAllCats, 
  findCatById, 
  addCat, 
  modifyCat, 
  removeCat,
  findCatsByOwner
} from '../models/cat-model.js';

const getCats = async (req, res, next) => {
  try {
    const cats = await listAllCats();
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const getCatById = async (req, res, next) => {
  try {
    const cat = await findCatById(req.params.id);
    if (!cat) {
      const error = new Error('Cat not found');
      error.status = 404;
      throw error;
    }
    res.json(cat);
  } catch (error) {
    next(error);
  }
};

const getCatsByUser = async (req, res, next) => {
  try {
    const cats = await findCatsByOwner(req.params.id);
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const postCat = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('File is required');
      error.status = 400;
      throw error;
    }
    
    const { cat_name, weight, birthdate } = req.body;
    const owner = req.user.user_id;
    const filename = req.file.filename;
    
    const result = await addCat({
      cat_name,
      weight,
      owner,
      filename,
      birthdate
    });
    
    res.status(201).json({
      message: 'Cat created successfully',
      cat_id: result.cat_id
    });
  } catch (error) {
    next(error);
  }
};

const putCat = async (req, res, next) => {
  try {
    const cat = await findCatById(req.params.id);
    
    if (!cat) {
      const error = new Error('Cat not found');
      error.status = 404;
      throw error;
    }
    
    if (cat.owner !== req.user.user_id && req.user.role !== 'admin') {
      const error = new Error('Unauthorized');
      error.status = 403;
      throw error;
    }
    
    const result = await modifyCat(req.body, req.params.id);
    res.json({ message: 'Cat updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteCat = async (req, res, next) => {
  try {
    const cat = await findCatById(req.params.id);
    
    if (!cat) {
      const error = new Error('Cat not found');
      error.status = 404;
      throw error;
    }
    
    if (cat.owner !== req.user.user_id && req.user.role !== 'admin') {
      const error = new Error('Unauthorized');
      error.status = 403;
      throw error;
    }
    
    await removeCat(req.params.id);
    res.json({ message: 'Cat deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export { getCats, getCatById, getCatsByUser, postCat, putCat, deleteCat };
