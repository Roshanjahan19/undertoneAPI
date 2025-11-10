import pool from "../db/index.js";

export const addWishlistItem = async (req, res) => {
  try {
    const { user_id, product_id, product_name, brand, shade } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    
    if (product_id) {
      const result = await pool.query(
        `INSERT INTO wishlist (user_id, product_id)
         VALUES ($1, $2)
         RETURNING *`,
        [user_id, product_id]
      );
      return res.json({ success: true, item: result.rows[0] });
    }

    
    if (product_name) {
      const result = await pool.query(
        `INSERT INTO wishlist (user_id, product_name, brand, shade)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          user_id,
          product_name,
          brand || null,   
          shade || null    
        ]
      );
      return res.json({ success: true, item: result.rows[0] });
    }

    return res.status(400).json({ error: "Missing product_id or product_name" });

  } catch (err) {
    console.error("addWishlistItem error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getWishlist = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      `
    SELECT 
  w.id,
  w.user_id,
  w.product_name,
  w.brand AS custom_brand,
  w.shade AS custom_shade,
  p.name AS db_product_name,
  p.brand AS db_brand,
  p.shade_note AS db_shade,
  p.image_url,
  p.product_url
FROM wishlist w
LEFT JOIN products p ON p.id = w.product_id
WHERE w.user_id = $1
ORDER BY w.id DESC;

      `,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getWishlist error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteWishlistItem = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`DELETE FROM wishlist WHERE id = $1`, [id]);

    res.json({ success: true });
  } catch (err) {
    console.error("deleteWishlistItem error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
