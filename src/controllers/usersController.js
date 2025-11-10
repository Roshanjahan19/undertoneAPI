import pool from "../db/index.js";

export const ensureUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email required" });
    }

    const normalizedEmail = email.toLowerCase();

    // Try to insert user — if inserted, RETURNING gives us new row
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

    // ✅ If result has a row → new user created
    if (insertResult.rows.length > 0) {
      userId = insertResult.rows[0].id;
      existed = false;
    } 
    
    // ✅ Otherwise: user already existed → fetch ID
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
