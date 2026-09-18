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

export const bookingServices= {
    createBooking,
}
