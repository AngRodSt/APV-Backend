import express from "express";
import { addPatient, getPatients, getPatient, deletePatient, updatePatient } from "../controllers/patientController.js";
import chechAuth from "../middleware/authMiddleware.js";

const router = express.Router();


router.route('/').post(chechAuth, addPatient).get(chechAuth, getPatients)
router.route('/:id')
    .get(chechAuth, getPatient)
    .put(chechAuth, updatePatient)
    .delete(chechAuth, deletePatient)
export default router;