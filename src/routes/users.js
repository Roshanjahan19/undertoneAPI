import express from "express";
import { ensureUser } from "../controllers/usersController.js";

const router = express.Router();

router.post("/ensure", ensureUser);

export default router;
