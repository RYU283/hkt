CREATE OR REPLACE FUNCTION upsert_customer_points(
  p_phone_number TEXT,
  p_points_to_add NUMERIC
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO customers (phone_number, points)
  VALUES (p_phone_number, p_points_to_add)
  ON CONFLICT (phone_number) DO UPDATE
  SET points = customers.points + p_points_to_add;
END;
$$ LANGUAGE plpgsql;