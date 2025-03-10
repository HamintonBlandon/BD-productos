import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import usersRouter from "./routers/users/users-router.js";
import productsRouter from "./routers/products/products-router.js";
import { Database } from "./database/db.js";
import {rateLimitMiddleware} from "./middlewares/rateLimit.js"
import http from "http";
import { SocketHandler } from "./sockets/socket.js";

const app = express();
const database = new Database();
const server = http.createServer(app);

const socketIo = new SocketHandler(server);
app.set("socketio", socketIo.iosocket);


database.setup();

app.use(express.json());  // Para manejar JSON
app.use(express.urlencoded({ extended: true }));  // Para manejar datos en formularios

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser());
app.use(rateLimitMiddleware);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

new SocketHandler(server);

server.listen(8080, () => {
    console.log("App running on port 8080");
});

//este error es porque no tengo bien configurado valkey en el docker, debo encender docker para que me conecte y funcione; si no lo enciendo no pasara nada

