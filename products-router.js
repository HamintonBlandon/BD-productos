import { Router } from "express";
import validate from "../../middlewares/validate.js";
import { authMiddleware } from "../../middlewares/aut.js";
import {
    CreateProducts,
    DeleteProducts,
    GetAllProducts,
    UpdateProducts,
} from "./products-controllers.js";
import { body, param } from "express-validator";
import { middlewareCustom } from "../../middlewares/middlewareCustom.js";


const productsRouter = Router();
productsRouter.get("/", [authMiddleware], GetAllProducts);
productsRouter.post(
    "/",
    [
        authMiddleware,
        body("name").exists().isString(),
        body("price").exists().isNumeric(),
        body("description").exists().isString(),
        body("unity").exists().isNumeric(),
        validate,
    ],
    CreateProducts
);


//  [Patch] localhost:8000/products/2
productsRouter.patch(
    "/:id",
    [
        authMiddleware,
        param("id").exists().isNumeric(),
        body("id").not().exists(),
        body("name").exists().isString(),
        body("price").exists().isNumeric(),
        body("description").exists().isString(),
        body("unity").exists().isNumeric(),
        validate,
    ],
    UpdateProducts
);


//  [DELETE] localhost:8000/products/2
productsRouter.delete(
    "/:id",
    [authMiddleware, param("id").exists().isNumeric(), validate],
    DeleteProducts
);
export default productsRouter;