const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const config = require('./config/config');
const systemRoutes = require("./routes/systemRoutes");
const logger = require('./services/loggerService');

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Static files
app.use(express.static("public"));

// Routes
app.use("/", systemRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('pages/error', { 
        error: 'Something broke!',
        layout: false // Disable layout for error page
    });
});

app.listen(config.app.port, () => {
    console.log(`Server is running on port ${config.app.port}`);
});