import express from "express"
import { engine } from "express-handlebars"
import { PORT } from "./config.js"
import { webRouter } from "./routers/webRouter.js"
import { Server as IOServer } from "socket.io"
import { ProductManager as PM } from "./ProductManager.js";

export const pm = new PM 

const app = express() 
app.engine('handlebars', engine()) 

app.set('views', './views')
app.set('view engine', 'handlebars')

app.use('/static', express.static('./static'))

app.use('/', webRouter) 

const server = app.listen(PORT, () => { console.log(`Conectado al Puerto: ${PORT}`) })
const ioServer = new IOServer(server)
// Evento que escucha la conexion de un cliente
ioServer.on('connection', (socket) => {
    console.log('cliente conectado', socket.id);
    socket.emit('actualizacion', { productos: pm.getProducts() }); // Actualiza la lista de productos al cliente

    // Evento cuando un cliente agrega un producto
    socket.on('agregarProducto', async (producto, callback) => {
        const respuesta = await pm.addProduct(producto);
        callback({ status: respuesta }); // Define un callback de respuesta para notificar al cliente el resultado de la petición
        ioServer.sockets.emit('actualizacion', { productos: pm.getProducts() }); // actualiza en TODOS los clientes la lista de productos
    });
});