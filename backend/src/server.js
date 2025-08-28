import express from 'express';
import dotenv from "dotenv";
import cors from "cors";

import notesRoutes from "./routes/notesRoutes.js";
import {connectDB} from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001;

//What is endpoint?
// An endpoint is a combination of a URL + HTTP method that lets the client interact with a specific resource.

//middleware i.e: auth check 
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }));
app.use(express.json());//this middleware will parse the json bodies
app.use(rateLimiter);

//our simple custom middleware
// app.use((req, res, next) => {
//     console.log(`Request method is ${req.method} & request URL is ${req.url}`);
//     next();
// })

app.use("/api/notes", notesRoutes);


connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log("Server started on port:", PORT);
    });
})