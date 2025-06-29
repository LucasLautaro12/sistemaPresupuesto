import app from './app.js'
import { connectDB } from './db.js'
import "dotenv/config";
//import { getPersona } from './models/personaModel.js'

const main = async () => {
    //Conexion a la bd
    await connectDB();
    const BACK_PORT = process.env.BACK_PORT || 4000;
    app.listen(BACK_PORT,()=>{
        console.log(`Server en ${BACK_PORT}`)
    });

};

main();

