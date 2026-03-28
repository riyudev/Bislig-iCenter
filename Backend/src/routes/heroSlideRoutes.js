import express from "express";
import { getPublicSlides } from "../controllers/heroSlideController.js";

const router = express.Router();

router.get("/", getPublicSlides);

export default router;
