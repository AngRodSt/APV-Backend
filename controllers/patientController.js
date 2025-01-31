import Patient from "../models/Patient.js"
import mongoose from "mongoose"

const addPatient = async (req, res) => {
    const patient = new Patient(req.body)
    patient.veterinarian = req.veterinarian._id
    try {
        const savedPatient = await patient.save()
        res.json(savedPatient)
    } catch (error) {
        console.log(error)
    }

    console.log(patient)
}

const getPatients = async(req, res) => {
    const patients = await Patient.find()
        .where("veterinarian")
        .equals(req.veterinarian)

    res.json(patients)
}

const getPatient = async (req, res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    const patient = await Patient.findById(id);

    if(!patient){
        return res.status(400).json({ msg: "Non-existent Patient"})
        
    }
    if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()){
        return res.status(400).json({ msg: "Invalid Action" })
    }

    res.json(patient)
    
}

const updatePatient = async (req, res) => {
    const {id} = req.params;
 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    const patient = await Patient.findById(id);

    if(!patient){
        return res.status(400).json({ msg: "Non-existent Patient"})
        
    }
    if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()){
        return res.status(400).json({ msg: "Invalid Action" })
    }

    patient.name = req.body.name || patient.name;
    patient.owner = req.body.owner || patient.owner;
    patient.email = req.body.email || patient.email;
    patient.date = req.body.date || patient.date;
    patient.symptoms = req.body.symptoms || patient.symptoms;

    try {
        const updatedPatient = await patient.save();
        res.json(updatedPatient)
    } catch (error) {
        console.log(error)
    }


}

const deletePatient = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid ID' });
    }
    const patient = await Patient.findById(id);

    if(!patient){
        return res.status(400).json({ msg: "Non-existent Patient"})
        
    }
    if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()){
        return res.status(400).json({ msg: "Invalid Action" })
    }

    try {
        await patient.deleteOne();
        res.json({msg: "Patient Deleted"})
    } catch (error) {
        console.log(error)
    }
}

export {
    addPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient
}
