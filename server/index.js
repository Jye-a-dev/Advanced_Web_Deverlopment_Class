const express = require("express");
const bodyParser = require("body-parser");
const disableCSP = require("./utils/disableCSP");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(disableCSP);

app.use("/api/admin", require("./api/admin"));

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
