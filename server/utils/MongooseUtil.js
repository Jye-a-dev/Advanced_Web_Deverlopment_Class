const mongoose = require("mongoose");
const MyConstants = require("./MyConstants");

const uri =
  "mongodb+srv://" +
  MyConstants.DB_USER +
  ":" +
  MyConstants.DB_PASS +
  "@shoppingonline.bmgskin.mongodb.net/" +
  MyConstants.DB_DATABASE;

mongoose
  .connect(uri)
  .then(() => {
    console.log(
      "Connected to " +
        "shoppingonline.bmgskin.mongodb.net/" +
        MyConstants.DB_DATABASE
    );
  })
  .catch((err) => {
    console.error(err);
  });
