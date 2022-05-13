const express = require("express");
const app = express();
const fastText = require("fasttext");
const cors = require("cors");

let config = {
    dim: 100,
    input: "train.txt",
    output: "model",
    bucket: 2000000,
    loss: "softmax",
};
let classifier = new fastText.Classifier();
classifier.train("supervised", config).then((res) => {
    console.log(res);
});

app.use(cors());

app.get("/", (req, res) => {
    res.sendfile("index.html");
});
app.get("/fasttext/", async function (req, res) {
    var statement = req.param("statement");
    res.send(await getFastTextResults(statement));
});

async function getFastTextResults(statement) {
    //predict returns an array with the input and predictions for best cateogires
    return await classifier.predict(statement, 3);
}

app.listen(8000, () => {
    console.log("Listening on port 8000!");
});
