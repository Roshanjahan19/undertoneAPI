import pool from "../db/index.js";

export const addWishlistItem = async (req, res) => {
  try {
    const { user_id, product_name } = req.body;

    if (!user_id || !product_name) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await pool.query(
      `
      INSERT INTO wishlist (user_id, product_name)
      VALUES ($1, $2)
      RETURNING *
      `,
      [user_id, product_name]
    );

    return res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error("addWishlistItem error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      `SELECT * FROM wishlist WHERE user_id = $1 ORDER BY id DESC`,
      [user_id]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("getWishlist error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteWishlistItem = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`DELETE FROM wishlist WHERE id = $1`, [id]);
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteWishlistItem error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
