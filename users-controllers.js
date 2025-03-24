import Users from "../users/users-entity.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { configDotenv  } from "dotenv";
import Valkey from "iovalkey"
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

configDotenv();
const cache = new Valkey();
export const GetAllUsers = async (req, res) => {

    try{
        let users = await cache.get("users");
        users = JSON.parse(users);
        if (user) {
            return res.status(200).json({
                data: users,
            });
        }
        
    } catch (error) {
        console.log(error)
        return res
        .status(503)
        .json({data: "No fue posible obtener la información de los usuarios"})
    }
    
};

function UsersComponent() {
    useEffect(() => {
        socket.on("usuario registrado", (userData) => {
            console.log(`Nuevo usuario registrado: ${userData.name} (${userData.email})`);
        });

        return () => {
            socket.off("user-registered");
        };
    });

    return ("usuario registrado satisfactoriamente");
}


export default UsersComponent;


export const CreateUsers = async (req, res) => {

try{
    const {email,password, name} = req.body

    const user = await Users.findOne({ where: {email: email } });
    if (user){
        return res.status(400).json({ data: "El usuario ya existe" });
    }

    const hashedPasword = await bcrypt.hash(password, 10);

    await Users.create({ email, password, hashedPasword, name});

    const socketIo = req.get ("socket"); //esto sirve para obtener la instancia de socket.io
    socketIo.emit ("Usuario registrado", {name, email});

    return res.status(201).json({ data: "Usuario creado con Exito" });    
} catch (error) {
console.log(error);
return res.status(503).json({
    data: "No se pudo crear el usuario"
})
}

};


export const UpdateUser = async(req, res) => {
   try{
    const { id } = req.params;
    const { email, password, name } = req.body;

    const hashedPasword = await bcrypt.hash(password, 10);

    await Users.update(
        {email, name, password: hashedPasword},
        {
            where: {
                id: id,
            },
        }
    ); 

    return res.status(202).json({ data: "Usuario actualizado exitosamente"});
   } catch (error) {
    console.log(error);
    return res.status(503).json({
        data: "No se puede actualizar la informacion",
    });
   }
};


export const DeleteUser = async(req, res) => {
    const { id } = req.params;
    try{
        await Users.destroy ( {
            where: {
                id:id,
            },
        });
        res.status(200).json({ data: "Usuario eliminado con exito"});
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            data: "No se puede Eliminar",
        });
    }
};


export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ where: {email: email}});
   
        if (!user) {
            return res.status(404).json({ data: "Usuario no encontrado" });
        }
        
        const isEqual = bcrypt.compareSync(password, user.password);

        if (!isEqual) {
            return res.status(400).json({ data: "La contraseña ingresada esta incorrecta" });
        }

        const userId = user.id;

        const token = jwt.sign({userId}, process.env.SECRET, {
            expireIn: "1h",
        });

        return res.status(200).json({data: {token}});


    } catch (error) {
        console.log(error);
        return res.status(500).json({data: "Error en el servidor, ocurrio un error en la ejecucion"});
    }
};
