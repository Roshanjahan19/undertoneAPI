import express from "express";
import { ensureUser, checkUser} from "../controllers/usersController.js";

const router = express.Router();

router.post("/ensure", ensureUser);
router.get("/check", checkUser);

export default router;
