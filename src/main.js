require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;

// --------- For DataBase Connection -----------
db.on("error", () => console.log("🗄️  DataBase Connection 🔗 Error ⚠️ ...."));
db.on("open", () =>
  console.log("🗄️  DataBase Connection 🔗 Successfull ✅ ✅.... ")
);
// ------- CRED Operation logic -------------
const mainlogics = require("./dataSchemaAndLogics/mainlogic");
app.use("/mainlogics", mainlogics);
// -------- Download ---------
const downloadData = require("./downloads/download");
app.use("/download", downloadData);
// -------- Listening Port -----------
app.listen(port, () => {
  console.log(`💽 Server is Running......🏃🏼‍♂️`);
});
