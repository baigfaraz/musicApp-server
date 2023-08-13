const express = require("express");

const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/songs' , require('./routes/songRoute'));
app.use('/' , require('./routes/songUploadAndDownload'));

app.listen(port, () => console.log(`Server started at Port ${port}.`));
