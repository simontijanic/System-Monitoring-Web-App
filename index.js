const express = require("express");
const app = express();

const userRoute = require("./routes/userRoute")

app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", "./views");

app.use(userRoute)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});