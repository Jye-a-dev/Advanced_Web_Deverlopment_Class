const express = require("express");
const router = express.Router();
const CryptoUtil = require("../utils/CryptoUtil");
const EmailUtil = require("../utils/EmailUtil");
const JwtUtil = require("../utils/JwtUtil");
const CategoryDAO = require("../models/CategoryDAO");
const ProductDAO = require("../models/ProductDAO");
const CustomerDAO = require("../models/CustomerDAO");
const OrderDAO = require("../models/OrderDAO");

router.get("/categories", async function (req, res) {
  try {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/products/new", async function (req, res) {
  try {
    const products = await ProductDAO.selectTopNew(3);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/signup", async function (req, res) {
  try {
    const { username, password, name, phone, email } = req.body;

    const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);

    if (dbCust) {
      return res.json({ success: false, message: "Exists username or email" });
    }

    const now = new Date().getTime();
    const token = CryptoUtil.md5(now.toString());

    const newCust = {
      username,
      password,
      name,
      phone,
      email,
      active: 1,
      token
    };

    const result = await CustomerDAO.insert(newCust);

    if (!result) {
      return res.json({ success: false, message: "Insert failure" });
    }

    res.json({ success: true, message: "Signup successful", customer: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/products/hot", async function (req, res) {
  try {
    const products = await ProductDAO.selectTopHot(3);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/products/category/:cid", async function (req, res) {
  try {
    const _cid = req.params.cid;
    const products = await ProductDAO.selectByCatID(_cid);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/products/search/:keyword", async function (req, res) {
  try {
    const keyword = req.params.keyword;
    const products = await ProductDAO.selectByKeyword(keyword);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/products/:id", async function (req, res) {
  try {
    const _id = req.params.id;
    const product = await ProductDAO.selectByID(_id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async function (req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
      const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);

      if (customer) {
        const token = JwtUtil.genToken();

        res.json({
          success: true,
          message: "Authentication successful",
          token: token,
          customer: customer
        });
      } else {
        res.json({
          success: false,
          message: "Incorrect username or password"
        });
      }
    } else {
      res.json({
        success: false,
        message: "Please input username and password"
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/token", JwtUtil.checkToken, function (req, res) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  res.json({
    success: true,
    message: "Token is valid",
    token: token
  });
});

router.put("/customers/:id", JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;

    const customer = {
      _id,
      username,
      password,
      name,
      phone,
      email
    };

    const result = await CustomerDAO.update(customer);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/checkout", JwtUtil.checkToken, async function (req, res) {
  try {
    const now = new Date().getTime();
    const total = req.body.total;
    const items = req.body.items;
    const customer = req.body.customer;

    const order = {
      cdate: now,
      total: total,
      status: "PENDING",
      customer: customer,
      items: items
    };

    const result = await OrderDAO.insert(order);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/orders/customer/:cid", JwtUtil.checkToken, async function (req, res) {
  try {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(_cid);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;