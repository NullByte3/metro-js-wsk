import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
  const [rows] = await promisePool.query(`
    SELECT user_id, name, username, email, role 
    FROM wsk_users
    ORDER BY user_id DESC
  `);
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(`
    SELECT user_id, name, username, email, role 
    FROM wsk_users 
    WHERE user_id = ?
  `, [id]);
  
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};

const findUserByUsername = async (username) => {
  const [rows] = await promisePool.execute(`
    SELECT * FROM wsk_users WHERE username = ?
  `, [username]);
  
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};

const addUser = async (user) => {
  const { name, username, email, password, role } = user;
  
  const [result] = await promisePool.execute(
    'INSERT INTO wsk_users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [name, username, email, password, role]
  );
  
  return { user_id: result.insertId };
};

const modifyUser = async (user, id) => {
  let sql = 'UPDATE wsk_users SET ';
  const params = [];
  const keys = Object.keys(user);
  
  keys.forEach((key, index) => {
    sql += `${key} = ?`;
    params.push(user[key]);
    if (index < keys.length - 1) {
      sql += ', ';
    }
  });
  
  sql += ' WHERE user_id = ?';
  params.push(id);
  
  const [result] = await promisePool.execute(sql, params);
  
  if (result.affectedRows === 0) {
    return null;
  }
  
  return { message: 'success' };
};

const removeUser = async (id) => {
  const connection = await promisePool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    await connection.execute(
      'DELETE FROM wsk_cats WHERE owner = ?',
      [id]
    );
    
    const [result] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ?',
      [id]
    );
    
    await connection.commit();
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return { message: 'success' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export { 
  listAllUsers, 
  findUserById, 
  findUserByUsername, 
  addUser, 
  modifyUser, 
  removeUser 
};
