import express from "express";
import category from "./category.js";
import product from "./product.js";
import user from "./user.js";
const router = express.Router();

router.use("/category", category);
router.use("/product", product);
router.use("/", user);
export default router;
