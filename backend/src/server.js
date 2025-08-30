import express from 'express';
import dotenv from "dotenv";
import cors from "cors";

import notesRoutes from "./routes/notesRoutes.js";
import {connectDB} from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import path from "path";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

//What is endpoint?
// An endpoint is a combination of a URL + HTTP method that lets the client interact with a specific resource.

//middleware i.e: auth check 
if(process.env.NODE_ENV !== "production"){
    app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }));
}
app.use(express.json());//this middleware will parse the json bodies
app.use(rateLimiter);

//our simple custom middleware
// app.use((req, res, next) => {
//     console.log(`Request method is ${req.method} & request URL is ${req.url}`);
//     next();
// })

app.use("/api/notes", notesRoutes);

//just used in production
if(process.env.NODE_ENV === "production"){
        app.use(express.static(path.join(__dirname,"../frontend/vite-project/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/vite-project/dist/index.html"));
    })
}


connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log("Server started on port:", PORT);
    });
})