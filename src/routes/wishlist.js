import express from "express";
import {
  addWishlistItem,
  getWishlist,
  deleteWishlistItem
} from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/add", addWishlistItem);
router.get("/:user_id", getWishlist);
router.delete("/:id", deleteWishlistItem);

export default router;
