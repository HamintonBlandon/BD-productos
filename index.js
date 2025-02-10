import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import usersRouter from "./routers/users/users-router.js";
import productosRouter from "./routers/productos/productos-router.js";

const app = express();

app.use(cors());
app.use(morgan());
app.use(bodyParser());

app.use("/users", usersRouter);
app.use("/productos", productosRouter)

app.listen(8000, () => {
    console.log("App running on port 8000");
});
