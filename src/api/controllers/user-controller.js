import bcrypt from 'bcrypt';
import { 
  listAllUsers, 
  findUserById, 
  addUser, 
  modifyUser, 
  removeUser 
} from '../models/user-model.js';

const getUsers = async (req, res, next) => {
  try {
    const users = await listAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const postUser = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await addUser({
      name,
      username,
      email,
      password: hashedPassword,
      role: 'user'
    });
    
    res.status(201).json({
      message: 'User created successfully',
      user_id: result.user_id
    });
  } catch (error) {
    next(error);
  }
};

const putUser = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    if (parseInt(req.params.id) !== req.user.user_id && req.user.role !== 'admin') {
      const error = new Error('Unauthorized');
      error.status = 403;
      throw error;
    }
    
    const userData = { ...req.body };
    
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    await modifyUser(userData, req.params.id);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    if (parseInt(req.params.id) !== req.user.user_id && req.user.role !== 'admin') {
      const error = new Error('Unauthorized');
      error.status = 403;
      throw error;
    }
    
    await removeUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export { getUsers, getUserById, postUser, putUser, deleteUser };
