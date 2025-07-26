import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from './config/Database.js'
import SequelizeStore from "connect-session-sequelize";
// import UserRoute from "./routes/UserRoute.js";
// import ProductRoute from "./routes/ProductRoute.js";
// // import AuthRoute from "./routes/AuthRoute.js";
// import OrderRoute from "./routes/OrderRoute.js"
import AdminRoutes from './routes/AdminRoute.js';  // Adjust path as needed
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

// (async()=>{
//     await db.sync();
// })();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:4000'
}));
app.use(express.json());
// app.use("/users",UserRoute);
// app.use("/products",ProductRoute);
app.use("/admins",AdminRoutes);
// app.use("/orders",OrderRoute);
// app.use(AuthRoute);

// Start the server (usually on port 5000 or whatever you choose)
// app.listen(5000, () => console.log('Server is running on port 5000'));

// Debugging: Print out environment variables (only for local development, not for production)
console.log("Environment variables:");
console.log("SESSION_SECRET:", process.env.SESS_SECRET);
console.log("App Port:", process.env.APP_PORT);
// console.log("Database URL:", process.env.DATABASE_URL);  // Make sure this is set in your .env file


app.listen(process.env.APP_PORT || 4000, () => {
    console.log(`Server is running at http://localhost:${process.env.APP_PORT || 4000}`);
});


// 10.1.14.197