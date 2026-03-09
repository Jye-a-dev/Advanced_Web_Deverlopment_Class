const express = require("express");
const router = express.Router();
const CryptoUtil = require("../utils/CryptoUtil");
const EmailUtil = require("../utils/EmailUtil");
const JwtUtil = require("../utils/JwtUtil");
const CategoryDAO = require("../models/CategoryDAO");
const ProductDAO = require("../models/ProductDAO");
const CustomerDAO = require("../models/CustomerDAO");

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
			active: 0,
			token,
		};

		const result = await CustomerDAO.insert(newCust);

		if (!result) {
			return res.json({ success: false, message: "Insert failure" });
		}

		const send = await EmailUtil.send(email, result._id, token);

		if (!send) {
			return res.json({ success: false, message: "Email failure" });
		}

		res.json({ success: true, message: "Please check email" });
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
router.post("/active", async function (req, res) {
	const _id = req.body.id;
	const token = req.body.token;

	const result = await CustomerDAO.active(_id, token, 1);

	res.json(result);
});

router.post("/login", async function (req, res) {
	const username = req.body.username;
	const password = req.body.password;

	if (username && password) {
		const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);

		if (customer) {
			if (customer.active === 1) {
				const token = JwtUtil.genToken();

				res.json({
					success: true,
					message: "Authentication successful",
					token: token,
					customer: customer,
				});
			} else {
				res.json({
					success: false,
					message: "Account is deactive",
				});
			}
		} else {
			res.json({
				success: false,
				message: "Incorrect username or password",
			});
		}
	} else {
		res.json({
			success: false,
			message: "Please input username and password",
		});
	}
});

router.get("/token", JwtUtil.checkToken, function (req, res) {
	const token = req.headers["x-access-token"] || req.headers["authorization"];

	res.json({
		success: true,
		message: "Token is valid",
		token: token,
	});
});

router.put("/customers/:id", JwtUtil.checkToken, async function (req, res) {
	const _id = req.params.id;
	const username = req.body.username;
	const password = req.body.password;
	const name = req.body.name;
	const phone = req.body.phone;
	const email = req.body.email;

	const customer = {
		_id: _id,
		username: username,
		password: password,
		name: name,
		phone: phone,
		email: email,
	};

	const result = await CustomerDAO.update(customer);
	res.json(result);
});

module.exports = router;
