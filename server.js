import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

import usersRoute from "./src/routes/users.js";
import routineRoutes from "./src/routes/routine.js";
import recommendationsRoute from "./src/routes/recommendations.js";
import wishlistRoutes from "./src/routes/wishlist.js";


app.use("/wishlist", wishlistRoutes);
app.use("/recommendations", recommendationsRoute);
app.use("/users", usersRoute);
app.use("/routine", routineRoutes);

const PORT = process.env.PORT || 5051;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
