import { Pool } from "pg";
import config from ".";

// DB
export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL CHECK (email = LOWER(email)),
        password TEXT NOT NULL CHECK (LENGTH(password) >=6),
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'customer'))
        )
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name TEXT NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number TEXT UNIQUE NOT NULL,
        daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN (	'available', 'booked') )
        )
    `);

  await pool.query(`
     CREATE TABLE IF NOT EXISTS bookings(
     id SERIAL PRIMARY KEY,
     customer_id INT REFERENCES users(id) ON DELETE CASCADE,
     vehicle_id INT REFERENCES vehicles(id),
     rent_start_date DATE NOT NULL,
     rent_end_date DATE NOT NULL,
      total_price NUMERIC(10,2) NOT NULL,
     CHECK (rent_end_date > rent_start_date),
     status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled','returned'))
    )
    
    `);
};

export default initDB;
