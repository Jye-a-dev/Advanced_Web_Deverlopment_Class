const express = require("express");
const router = express.Router();
const CategoryDAO = require("../models/CategoryDAO");
const JwtUtil = require("../utils/JwtUtil");
const AdminDAO = require("../models/AdminDAO");
const ProductDAO = require("../models/ProductDAO");
// LOGIN
router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.json({
			success: false,
			message: "Please input username and password",
		});
	}

	const admin = await AdminDAO.selectByUsernameAndPassword(username, password);

	if (!admin) {
		return res.json({
			success: false,
			message: "Incorrect username or password",
		});
	}

	const token = JwtUtil.genToken(admin.username);

	res.json({
		success: true,
		message: "Authentication successful",
		token,
	});
});

// CHECK TOKEN
router.get("/token", JwtUtil.checkToken, (req, res) => {
	res.json({
		success: true,
		message: "Token is valid",
		decoded: req.decoded,
	});
});

router.post("/categories", JwtUtil.checkToken, async function (req, res) {
	const name = req.body.name;
	const category = { name };
	const result = await CategoryDAO.insert(category);
	res.json(result);
});
router.get("/categories", JwtUtil.checkToken, async function (req, res) {
	const result = await CategoryDAO.selectAll();
	res.json(result);
});
router.delete("/categories/:id", JwtUtil.checkToken, async function (req, res) {
	const _id = req.params.id;
	const result = await CategoryDAO.delete(_id);
	res.json(result);
});
router.put("/categories/:id", JwtUtil.checkToken, async function (req, res) {
	const _id = req.params.id;
	const name = req.body.name;
	const category = { _id, name };
	const result = await CategoryDAO.update(category);
	res.json(result);
});
router.get("/products", JwtUtil.checkToken, async function (req, res) {
	// get data
	let products = await ProductDAO.selectAll();

	// pagination
	const sizePage = 4;
	const noPages = Math.ceil(products.length / sizePage);

	let curPage = 1;
	if (req.query.page) {
		curPage = parseInt(req.query.page);
	}

	// /products?page=xxx
	const offset = (curPage - 1) * sizePage;
	products = products.slice(offset, offset + sizePage);

	// return
	const result = {
		products,
		noPages,
		curPage,
	};

	res.json(result);
});
router.post("/products", JwtUtil.checkToken, async function (req, res) {
	const name = req.body.name;
	const price = req.body.price;
	const cid = req.body.category;
	const image = req.body.image;
	const now = new Date().getTime(); // milliseconds

	const category = await CategoryDAO.selectByID(cid);

	const product = {
		name,
		price,
		image,
		cdate: now,
		category,
	};

	const result = await ProductDAO.insert(product);
	res.json(result);
});
router.put("/products/:id", JwtUtil.checkToken, async function (req, res) {
	const _id = req.params.id;
	const name = req.body.name;
	const price = req.body.price;
	const cid = req.body.category;
	const image = req.body.image;

	const category = await CategoryDAO.selectByID(cid);

	const product = {
		_id,
		name,
		price,
		image,
		category,
	};

	const result = await ProductDAO.update(product);
	res.json(result);
});

router.delete("/products/:id", JwtUtil.checkToken, async function (req, res) {
	const _id = req.params.id;
	const result = await ProductDAO.delete(_id);
	res.json(result);
});

module.exports = router;
