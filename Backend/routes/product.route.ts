// <-- Imports -->
import express, { Router } from "express";
import * as controller from "../controllers/product.controller";

const router: Router = express.Router();

// <-- Configure Routes -->
router.get("", controller.getAll);
router.get("/get/:id", controller.getById);

export default router;