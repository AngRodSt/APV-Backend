import express from "express";
import { register, perfile, confirm, authenticate, resetPassword, authToken, newPassword, updateProfile, updatePassword } from "../controllers/veterinarianController.js";
import chechAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/', register)
router.get("/confirm/:token", confirm)
router.post("/login", authenticate)
router.post("/reset-password", resetPassword)
router.route("/reset-password/:token").get(authToken).post(newPassword)

router.get("/perfile", chechAuth, perfile)
router.put("/perfile/:id", chechAuth, updateProfile)
router.put("/update-password", chechAuth, updatePassword)

export default router;