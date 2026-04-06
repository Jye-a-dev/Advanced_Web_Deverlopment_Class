const express = require("express");
const bodyParser = require("body-parser");
const disableCSP = require("./utils/disableCSP");
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3000;

console.log("DB_SERVER:", process.env.DB_SERVER);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(disableCSP);

app.use("/api/admin", require("./api/admin"));
app.use("/api/customer", require("./api/customer.js"));

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(
  '/admin',
  express.static(path.resolve(__dirname, '../client-admin/build'))
);

app.get('/admin/*', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, '../client-admin/build', 'index.html')
  );
});

// '/' serve the files at client-customer/build/* as static files
app.use(
  '/',
  express.static(path.resolve(__dirname, '../client-customer/build'))
);

app.get('*', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, '../client-customer/build', 'index.html')
  );
});