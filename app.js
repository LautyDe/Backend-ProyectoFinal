//libraries
import express from "express";
import session from "express-session";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import compression from "express-compression";
import swaggerUi from "swagger-ui-express";
//locals
import config from "./src/config.js";
import indexRouters from "./src/routers/index.routers.js";
import { __dirname } from "./src/utils.js";
import { productsService } from "./src/services/products.service.js";
import { chatService } from "./src/services/chat.service.js";
import { cartsService } from "./src/services/carts.service.js";
import { errorMiddleware } from "./src/services/errors/error.middleware.js";
import { swaggerSetup } from "./src/swaggerSpecs.js";
import { transporter } from "./src/utils/nodemailer.js";
//db
import "./src/DAL/mongoDb/dbConfig.js";
import mongoStore from "connect-mongo";
//passport
import passport from "passport";
import "./src/strategies/index.strategies.js";
import { logger } from "./src/utils/winston.js";
import { usersManager } from "./src/DAL/DAOs/mongoDAOs/usersManagerMongo.js";

const app = express();
const PORT = config.port;
const URI = config.mongo_uri;

/* middlewares */
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

/* cookies */
app.use(cookieParser(config.secret_cookie));

//mongo session
app.use(
  session({
    secret: config.secret_session,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 2 * 60 * 60 * 1000 },
    store: new mongoStore({
      mongoUrl: URI,
    }),
  })
);

//passport config
app.use(passport.initialize());
app.use(passport.session());

/* handlebars */
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "main.hbs",
    layoutsDir: __dirname + "/views/layouts",
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

//docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSetup));

/* routers */
app.use("/", indexRouters);

app.use(errorMiddleware);

/* server */
const httpServer = app.listen(PORT, () => {
  logger.info(`Servidor escuchando en el puerto ${httpServer.address().port}`);
  logger.http(`http://localhost:${PORT}`);
});
httpServer.on("error", error =>
  logger.error(`Error en servidor: ${error.message}`)
);

/* webSocket */
const socketServer = new Server(httpServer);
socketServer.on("connection", async socket => {
  const products = await productsService.findAll();
  const messages = await chatService.findAllMessages();

  socket.emit("products", products);

  socket.on("newProduct", async data => {
    await productsService.addProduct(data);
    const products = await productsService.findAll();
    socket.emit("products", products);
  });

  socket.on("deleteProduct", async ({ id, userEmail }) => {
    await productsService.deleteById(id);
    const user = await usersManager.findByEmail(userEmail);
    if (user.role === config.role_premium) {
      const mail = {
        from: "lauty.d.p@gmail.com",
        to: userEmail,
        subject: "Product deleted",
        text: `${user.name} your product with id: ${id} was succesfully removed from the home page`,
      };
      transporter.sendMail(mail, (error, info) => {
        if (error) {
          logger.error(error);
        }
      });
    }
    const products = await productsService.findAll();
    socket.emit("products", products);
  });

  socket.emit("messages", messages);

  socket.on("newMessage", async data => {
    await chatService.addMessage(data);
    const messages = await chatService.findAllMessages();
    socket.emit("messages", messages);
  });

  socket.on("addToCart", async ({ cid, pid }) => {
    await cartsService.addToCart(cid, pid);
    socket.emit("addedToCart", { message: "Producto agregado al carrito" });
  });

  socket.on("deleteFromCart", async ({ cid, pid }) => {
    await cartsService.deleteProduct(cid, pid);
    socket.emit("deletedFromCart", {
      message: "Producto eliminado del carrito",
    });
  });
});

export default app;
