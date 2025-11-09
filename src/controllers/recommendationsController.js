import pool from "../db/index.js";
import { formatProducts } from "../utils/formatResponse.js";

export const getRecommendations = async (req, res) => {
  try {
    const { tone, undertone, category } = req.query;

    if (!undertone) {
      return res.status(400).json({ error: "undertone is required." });
    }

    let query = `
      SELECT 
        p.id, 
        p.brand, 
        p.name, 
        p.image_url, 
        p.product_url, 
        p.shade_note,
        p.price_tier,
        p.category
      FROM recommendations r
      JOIN products p ON p.id = r.product_id
      WHERE LOWER(r.undertone) = LOWER($1)
    `;

    let params = [undertone];
    let paramIndex = 2;

    if (tone) {
      query += ` AND LOWER(r.tone_label) = LOWER($${paramIndex})`;
      params.push(tone);
      paramIndex++;
    }

    if (category) {
      query += ` AND LOWER(p.category) = LOWER($${paramIndex})`;
      params.push(category);
      paramIndex++;
    }

    const results = await pool.query(query, params);

    return res.json({
      products: formatProducts(results.rows),
    });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
