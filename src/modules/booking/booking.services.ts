import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleResult = await pool.query(
    `
    SELECT vehicle_name, daily_rent_price FROM vehicles 
    WHERE id=$1
        `,
    [vehicle_id],
  );

  if (vehicleResult.rows.length === 0) {
    return null;
  }

  const vehicle = vehicleResult.rows[0];

  //  booking number of days
  const stateDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);

  const difference = endDate.getTime() - stateDate.getTime();

  const numberOfDays = difference / (1000 * 60 * 60 * 24);

  const totalPrice = Number(vehicle.daily_rent_price) * numberOfDays;

  const result = await pool.query(
    `
    INSERT INTO bookings (
    customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price
    )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, customer_id, vehicle_id,
              rent_start_date, rent_end_date,
              total_price, status
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice],
  );

  return {
    ...result.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: Number(vehicle.daily_rent_price),
    },
  };
};

const getAllBooking = async (user_id: number, role: string) => {
  let result;

  if (role === "admin") {
    result = await pool.query(`
      SELECT b.id, b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,

        json_build_object(
        'name', u.name,
        'email', u.email
        ) AS customer,

        json_build_object(
          'vehicle_name', v.vehicle_name,
          'registration_number', v.registration_number
        ) AS vehicle

        FROM bookings b
        JOIN users u
        ON b.customer_id = u.id
        JOIN vehicles v
        ON b.vehicle_id = v.id
      `);
  } else {
    result = await pool.query(
      `
      SELECT b.id,
       b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,

          json_build_object(
          'vehicle_name', v.vehicle_name,
          'registration_number', v.registration_number,
          'type', v.type
        ) AS vehicle

        FROM bookings b
        JOIN vehicles v
        ON b.vehicle_id = v.id

        WHERE b.customer_id = $1

      ` , [user_id]
    );
  }

  return result
};

export const bookingServices = {
  createBooking,
  getAllBooking
};
