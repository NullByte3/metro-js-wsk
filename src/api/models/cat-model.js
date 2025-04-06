import promisePool from '../../utils/database.js';

const listAllCats = async () => {
  const [rows] = await promisePool.query(`
    SELECT c.*, u.name as owner_name 
    FROM wsk_cats c 
    JOIN wsk_users u ON c.owner = u.user_id
    ORDER BY c.cat_id DESC
  `);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(`
    SELECT c.*, u.name as owner_name 
    FROM wsk_cats c 
    JOIN wsk_users u ON c.owner = u.user_id
    WHERE c.cat_id = ?
  `, [id]);
  
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};

const findCatsByOwner = async (ownerId) => {
  const [rows] = await promisePool.execute(`
    SELECT c.*, u.name as owner_name 
    FROM wsk_cats c 
    JOIN wsk_users u ON c.owner = u.user_id
    WHERE c.owner = ?
    ORDER BY c.cat_id DESC
  `, [ownerId]);
  
  return rows;
};

const addCat = async (cat) => {
  const { cat_name, weight, owner, filename, birthdate } = cat;
  
  const [result] = await promisePool.execute(
    'INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate) VALUES (?, ?, ?, ?, ?)',
    [cat_name, weight, owner, filename, birthdate]
  );
  
  return { cat_id: result.insertId };
};

const modifyCat = async (cat, id) => {
  let sql = 'UPDATE wsk_cats SET ';
  const params = [];
  const keys = Object.keys(cat);
  
  keys.forEach((key, index) => {
    sql += `${key} = ?`;
    params.push(cat[key]);
    if (index < keys.length - 1) {
      sql += ', ';
    }
  });
  
  sql += ' WHERE cat_id = ?';
  params.push(id);
  
  const [result] = await promisePool.execute(sql, params);
  
  if (result.affectedRows === 0) {
    return null;
  }
  
  return { message: 'success' };
};

const removeCat = async (id) => {
  const [result] = await promisePool.execute(
    'DELETE FROM wsk_cats WHERE cat_id = ?',
    [id]
  );
  
  if (result.affectedRows === 0) {
    return null;
  }
  
  return { message: 'success' };
};

export { listAllCats, findCatById, findCatsByOwner, addCat, modifyCat, removeCat };
