require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./route/index"); // import our settings url for Router
const errorMiddleWare = require("./middleware/error-middleware");

const PORT = process.env.PORT || 8000; // default port , if the variable is empty
const app = express(); // start our app
const expressStaticGzip = require("express-static-gzip");
//Middleware
app.use(express.json()); // parse our json
app.use(cookieParser()); // Middleware for cookie
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use("/api/auth", router); // listen our request
app.use(errorMiddleWare);
app.use(
  expressStaticGzip("dist", {
    enableBrotli: true,
  })
);
const start = async () => {
  try {
    await mongoose.connect(process.env.BD_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => console.log(`our server started on ${PORT} port `));
  } catch (e) {
    console.log(e);
  }
};

start();
