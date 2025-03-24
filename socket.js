import { Server } from "socket.io";
import Products from "../routers/products/products-entity.js";

export class SocketHandler {
    iosocket;
    /**
     *
     * 1 evento que emite el frontend para actualizar el stock y lo escucha el backend
     * 1 evento que emite el backend para devolver el stock actualizado y que escucha el frontend
     * El backend escucha update-stock
     * El backend emite el stock-updated
     */

    constructor(serverHttp) {
        this.iosocket = new Server(serverHttp);
        this.initEvents();
    }

    initEvents() {
        this.iosocket.on("connection", (socket) => {
            console.log ("Cliente conectado", socket.id);
        
            // Aqui el susario enviaá el mensaje
            socket.on("Enviar mensaje ", (Mensaje) => {
                console.log ("Mensaje recibido:", Mensaje);
            
                //aqui se reenvía el mensaje a todos los usuarios conectados
                this.iosocket.emit ("NUevo mensaje:", Mensaje);
               
            });
        

            socket.on("disconnect", () => {
                console.log("usuario desconectado");
            });
        });
    };
};

    /*async updateClienteStock(ClienteId) {
        const exists = await Cliente.findOne({ where: { id: ClienteId } });

        if (!exists) {
            return null;
        }
        const updateCliente = { ...exists, stock: exists.stock - 1 };
        // const updateProduct = exists;
        // updateProduct.stock = updateProduct.stock - 1;
        await Cliente.update(updateCliente, {
            where: {
                id: ClienteId,
            },
        });
        const newPersona = await cliente.findOne({ where: { id: ClienteId } });

        this.iosocket.emit("stock-updated", newCliente);
    }
}*/