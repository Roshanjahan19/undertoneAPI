import pool from "../db/index.js";

export const ensureUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email required" });
    }

    const normalizedEmail = email.toLowerCase();

    const insertResult = await pool.query(
      `
      INSERT INTO users (email)
      VALUES ($1)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
      `,
      [normalizedEmail]
    );

    let userId;
    let existed = false;

    if (insertResult.rows.length > 0) {
      userId = insertResult.rows[0].id;
      existed = false;
    } 
    
    else {
      const existing = await pool.query(
        `SELECT id FROM users WHERE email = $1`,
        [normalizedEmail]
      );

      userId = existing.rows[0].id;
      existed = true;
    }

    return res.json({
      user_id: userId,
      email: normalizedEmail,
      existed
    });

  } catch (err) {
    console.error("ensureUser error", err);
    return res.status(500).json({ error: "Server error" });
  }
};
export const checkUser = async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const result = await pool.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email.toLowerCase()]
    );

    if (result.rows.length > 0) {
      return res.json({ exists: true });
    }

    return res.json({ exists: false });
  } catch (err) {
    console.error("checkUser error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
