import express from "express";
import {
  getRoutine,
  addRoutineStep,
  deleteRoutineStep
} from "../controllers/routineController.js";

const router = express.Router();

router.get("/:user_id", getRoutine);
router.post("/", addRoutineStep);
router.delete("/:id", deleteRoutineStep);

export default router;
