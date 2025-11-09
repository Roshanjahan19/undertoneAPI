import pool from "../db/index.js";

export const getRoutine = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      `SELECT * FROM routine_steps 
       WHERE user_id=$1 
       ORDER BY routine_type, position`,
      [user_id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("getRoutine error", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const addRoutineStep = async (req, res) => {
  try {
    const { user_id, routine_type, step_type, step_content, position } = req.body;

    const result = await pool.query(
      `INSERT INTO routine_steps (user_id, routine_type, step_type, step_content, position)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, routine_type, step_type, step_content, position]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("addRoutineStep error", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteRoutineStep = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`DELETE FROM routine_steps WHERE id = $1`, [id]);

    res.json({ success: true });

  } catch (err) {
    console.error("deleteRoutineStep error", err);
    res.status(500).json({ error: "Server error" });
  }
};
