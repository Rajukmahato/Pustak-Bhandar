const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const sequelize = require("./config/db");
const bodyParser = require("body-parser");
const categoryRoutes = require("./routes/categoryRoutes");

// Import models
require('./models/contact');

dotenv.config();

const app = express();

// Configure CORS options
const corsOptions = {
  origin: 'http://localhost:5173', // Allow only this origin
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());

app.use(categoryRoutes);
app.use("/api", userRoutes);
app.use(bookRoutes);
app.use(contactRoutes);

const PORT = process.env.PORT || 5005;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Error synchronizing the database:", err);
});