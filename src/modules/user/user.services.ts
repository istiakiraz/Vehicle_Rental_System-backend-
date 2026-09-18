import { pool } from "../../config/db";

const getUser = async () => {
  const result = await pool.query(`
        SELECT id, name, email, phone, role FROM users
        `);

  return result;
};

const updateUser = async (
  name: string,
  email: string,
  phone: string,
  role: string,
  id: string,
  isAdmin: boolean,
) => {
  let result;

  if (isAdmin) {
    result = await pool.query(
      `
            UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING * 
            `,
      [name, email, phone, role, id],
    );
  } else {
    result = await pool.query(
      `
    UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING id, name, email, phone, role
    `,
      [name, email, phone, id],
    );
  }

  return result;
};

export const userServices = {
  getUser,
  updateUser,
};
