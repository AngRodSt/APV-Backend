import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectDB from './config/db.js'
import veterinarianRoutes from './routes/veterinarianRoutes.js';
import patientRoutes from './routes/patientRoutes.js';

const app = express();

app.use(express.json());

dotenv.config();

conectDB();

const domainsAllowed = [process.env.FRONTEND_URL]

const corsConfig = {
    origin: function (origin, callback) {
        if(domainsAllowed.indexOf(origin) !== -1) {
            callback(null, true)
        }
        else{
            callback(new Error("Access Blocked"))
        }
    }
}

app.use(cors(corsConfig));

app.use('/api/veterinarian', veterinarianRoutes )
app.use('/api/patient', patientRoutes )

const PORT = process.env.PORT || 4000

app.listen(4000, ()=>{
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})