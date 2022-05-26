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
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
const result = [];
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);

app.get("/", (req, res) => {
  res.render("index",{result});
});

app.get("/fasttext/", function (req, res) {
  var statement = req.param("statement");
  getFastTextResults(statement);
  res.redirect('/');
});

function getFastTextResults(statement) {
  //predict returns an array with the input and predictions for best cateogires
  classifier
    .predict(statement, 3)
    .then((res) => {
      console.log(res);
      const label_name = res[0].label.split("__")[2];
      result.push({value:statement, label:label_name});
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  return "success!";
}

app.listen(8000, () => {
  console.log("Listening on port 8000!");
});
