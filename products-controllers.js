import Products from "../products/products-entity.js";
import { configDotenv } from "dotenv";
import Valkey from "iovalkey";


//obtener
configDotenv();

const cachep = new Valkey();
export const GetAllProducts = async (req, res) => {
    try {
        let products = await cachep.get("products");
        products = JSON.parse(products);
        if (products) {
            return res.status(200).json({
                data: products,
            });
        }

        products = await Products.findAll();
        await cachep.set("products", JSON.stringify(products), "EX", 10);

        return res.status(200).json({
            data: products,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(503)
            .json({ data: "No fue posible obtener los productos " });
    }
};

//crear
export const CreateProducts = async (req, res) => {
    try {
        const { name, price, description, unity} = req.body;

        const product = await Products.findOne({ where: { name: name } });
        if (product) {
            return res.status(400).json({ data: "El producto ingresado ya existe" });
        }

        await Products.create({ name, price, description, unity });

        return res.status(201).json({ data: "El producto fue creado con exito" });
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            data: "No se creo el producto",
        });
    }
};

//Actualizar
export const UpdateProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, unity } = req.body;


        await Products.update(
            { name, price, description, unity },
            {
                where: {
                    id: id,
                },
            }
        );


        return res.status(202).json({ data: "Producto actualizado con exito" });
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            data: "No se pudo actualizar el producto",
        });
    }
};

//Eliminar
export const DeleteProducts = async (req, res) => {
    const { id } = req.params;
    try {
        await Products.destroy({
            where: {
                id: id,
            },
        });

        res.status(200).json({ data: "Producto Eliminado" });
    } catch (error) {
        console.log(error);
        res.status(503).json({ data: "No se pudo eliminar" });
    }
};


export const Inventory = async (req, res) => {
    try {
        const { name, price, description, unity } = req.body;

        const product = await Products.findOne({ where: { name: name } });
        if (!product) {
            return res.status(404).json({ data: "No fue posible encontar el producto" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ data: "Ocurrio un error" });
    }
};