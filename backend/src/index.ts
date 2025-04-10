import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import accountRouter from "./routes/account.route";
import mole_metadata_router from "./routes/mole_metadata.route"
import { errorHandler } from "./middlewares/error.middleware";
// Loads .env variables into process.env
dotenv.config();

const app = express();

// Prevents web applications running on one domain from making request to another domain
// Unless explicitly allowed. Cross-Origin Resource Sharing
app.use(cors()); 

// Parsing incoming JSON
app.use(express.json({ limit: '10mb' })); // Increase the limit to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

//app.use('/api');

app.use(accountRouter);
app.use(mole_metadata_router);

app.get("/test", (req, res) => {
    res.send("Backend is running!");
});

// Using a global middleware error handler that will apply to all the routes
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});