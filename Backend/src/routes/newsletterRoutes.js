import express from "express";
import { subscribe, getSubscribers, sendNewsletter } from "../controllers/newsletterController.js";

const router = express.Router();

router.post("/subscribe", subscribe);
router.get("/subscribers", getSubscribers); // maybe protected later
router.post("/send", sendNewsletter); // maybe protected later

export default router;
