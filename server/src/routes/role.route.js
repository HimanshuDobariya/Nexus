import express from "express";
import Role from "../models/roles-permission.model.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const roles = await Role.find({}).select("-permissions");
    res.status(200).json({ roles });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error", error: error.message });
  }
});

export default router;
