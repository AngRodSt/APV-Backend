import Veterinarian from "../models/Veterinarian.js"
import generateJwt from "../helpers/generateJwt.js"
import generateId from "../helpers/generateId.js"
import emailRegister from "../helpers/emailRegister.js"
import emailResetPassword from "../helpers/emailResetPassword.js"


const register = async (req, res) => {
    const { email, name } = req.body

    const existUser = await Veterinarian.findOne({ email })
    if (existUser) {
        const error = new Error("User already exist");
        return res.status(400).json({ msg: error.message })
    }

    try {
        const veterinarian = new Veterinarian(req.body);
        const veterinarianSaved = await veterinarian.save()

        //Send verification email
        emailRegister({
            email,
            name,
            token: veterinarianSaved.token
        })
        res.json(veterinarianSaved)

    } catch (error) {
        console.log(`error: ${error.messege}`)
        process.exit(1)
    }
}

const perfile = (req, res) => {
    const { veterinarian } = req

    res.json({ veterinarian })
}

const confirm = async (req, res) => {
    const { token } = req.params

    const confirmedUser = await Veterinarian.findOne({ token })
    if (!confirmedUser) {
        const error = new Error('Invalid Token');
        return res.status(404).json({ msg: error.message })
    }
    try {
        confirmedUser.token = null;
        confirmedUser.validated = true;
        await confirmedUser.save()
        res.json({ url: "User confirmed!" })

    } catch (error) {

        console.log(error)
    }

}

const authenticate = async (req, res) => {
    const { email, password } = req.body

    const existUser = await Veterinarian.findOne({ email })
    if (!existUser) {
        const error = new Error("Invalid User");
        return res.status(404).json({ msg: error.message })
    }

    if (!existUser.validated) {
        const error = new Error("Account need to be validated");
        return res.status(403).json({ msg: error.message })
    }

    if (await existUser.checkPassword(password)) {
        res.json({
            _id: existUser._id,
            name: existUser.name,
            web: existUser.web,
            telephone: existUser.telephone,
            email: existUser.email,
            token: generateJwt(existUser.id)
        })
    }
    else {
        const error = new Error("Password incorrect");
        return res.status(403).json({ msg: error.message })
    }

}

const resetPassword = async (req, res) => {
    const { email } = req.body

    const existVeterinarian = await Veterinarian.findOne({ email })
    if (!existVeterinarian) {
        const error = new Error("User doesn't exist");
        return res.status(400).json({ msg: error.message })
    }

    try {
        existVeterinarian.token = generateId();
        await  existVeterinarian.save();
        res.json({ msg: "We send an email with the instructions" })

        emailResetPassword({
            email,
            name: existVeterinarian.name,
            token: existVeterinarian.token
        })



    } catch (error) {
        console.log(error)
    }

}
const authToken = async (req, res) => {
    const { token } = req.params;

    const validToken = await Veterinarian.findOne({ token });
    if (validToken) {
        res.json({ msg: "Token validated successfuly" })
    }
    else {
        const error = new Error("Invalid Token");
        return res.status(400).json({ msg: error.message })
    }
}

const newPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body;

    const veterinarian = await Veterinarian.findOne({ token });
    if (!veterinarian) {
        const error = new Error("Invalid Token");
        return res.status(400).json({ msg: error.message })
    }
    try {
        veterinarian.token = null;
        veterinarian.password = password
        await veterinarian.save();
        res.json({ msg: "Password saved successfuly" })

    } catch (error) {
        console.log(error)
    }
}

const updateProfile = async (req, res) => {
    const existUser = await Veterinarian.findById(req.params.id)
    if (!existUser) {
        const error = new Error("User not found");
        return res.status(404).json({ msg: error.message });
    }
    const { email } = req.body
    if (existUser.email !== req.body.email) {
        const existEmail = await Veterinarian.findOne({ email })
        if (existEmail) {
            const error = new Error("Email already in use");
            return res.status(404).json({ msg: error.message });
        }
    }

    try {
        existUser.name = req.body.name
        existUser.email = req.body.email
        existUser.telephone = req.body.telephone
        existUser.web = req.body.web

        const updatedUser = await existUser.save();
        res.json(updatedUser);

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}

const updatePassword = async (req, res) => {
    const {id} = req.veterinarian
    const {pwd_current, pwd_new} = req.body

    const existUser = await Veterinarian.findById(id)
    if (!existUser) {
        const error = new Error("User not found");
        return res.status(404).json({ msg: error.message });
    }
    if(await existUser.checkPassword(pwd_current)){
       existUser.password = pwd_new;
       await existUser.save();
       res.json({msg: 'Password saved successfully'})
    }
    else{
        const error = new Error("Current password is incorrect");
        return res.status(404).json({ msg: error.message });
    }
    
}

export {
    register,
    perfile,
    confirm,
    authenticate,
    resetPassword,
    authToken,
    newPassword,
    updateProfile,
    updatePassword
}