import pool from "../db/index.js";

export const ensureUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email required" });
    }

    const result = await pool.query(
      `
      INSERT INTO users (email)
      VALUES ($1)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
      `,
      [email.toLowerCase()]
    );

    let userId;

    if (result.rows.length > 0) {
      userId = result.rows[0].id;
    } else {
      const existing = await pool.query(
        `SELECT id FROM users WHERE email=$1`,
        [email.toLowerCase()]
      );
      userId = existing.rows[0].id;
    }

    res.json({ user_id: userId, email });

  } catch (err) {
    console.error("ensureUser error", err);
    res.status(500).json({ error: "Server error" });
  }
};
