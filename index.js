const express = require("express");
const config = require('./config/config');
const systemRoutes = require("./routes/systemRoutes");

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", "./views");

// Static files
app.use(express.static("public"));

// Routes
app.use("/", systemRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: 'Something broke!' });
});

app.listen(config.app.port, () => {
    console.log(`Server is running on port ${config.app.port}`);
});