/** @format */

const router = require('express').Router();
let Products = require('../models/productModels');
let Order = require('../models/orderModels');

router.route('/yourProduct').post((req, res) => {
	const newProductBody = req.body;
	const newProduct = new Products(newProductBody);
	newProduct
		.save()
		.then(() => res.json('product Added'))
		.catch((err) => res.status(400).json('Error:' + err));
});

router.route('/').get((req, res) => {
	Products.find()
		.sort({ date: -1 })
		.skip(
			req.query.pageNumber > 0
				? (req.query.pageNumber - 1) * req.query.nPerPage
				: 0
		)
		.limit(req.query.nPerPage)
		.then((products) =>
			Products.find().then((allProducts) => {
				return res.json({
					products: products,
					allProducts: allProducts
				});
			})
		)
		.catch((err) => res.status(400).json('Error:' + err));
});

router.route('/yourProduct').delete((req, res) => {
	Products.deleteOne({
		_id: req.query.id
	})
		.then(() => {
			return res.json('product delted');
		})
		.catch((err) => res.status(400).json('Error:' + err));
});

router.route('/yourProduct').get((req, res) => {
	Products.find({ email: req.query.email })
		.sort({ date: -1 })
		.then((products) => {
			return res.json(products);
		})
		.catch((err) => res.status(400).json('Error:' + err));
});

router.route('/order').post((req, res) => {
	const newOrder = new Order(req.body);
	newOrder
		.save()
		.then(() => {
			return res.json('updated');
		})
		.catch((err) => res.status(400).json('Error:' + err));
});

router.route('/order').delete((req, res) => {
	const ids = req.query.deleteDocuments;

	Products.bulkWrite(
		ids.map((item) => {
			return {
				deleteOne: {
					filter: { _id: item }
				}
			};
		})
	)
		.then(() => {
			return res.json('some products deleted');
		})
		.catch((err) => res.status(400).json('Error:' + err));
});

router.route('/order').put((req, res) => {
	const updateDocuments = req.body;

	Products.bulkWrite(
		updateDocuments.map((item) => {
			return {
				updateOne: {
					filter: { _id: item._id },
					update: { $set: { productQuantity: item.productQuantity } }
				}
			};
		})
	)
		.then(() => {
			return res.json('some products updated');
		})
		.catch((err) => res.status(400).json('Error:' + err));
});

router.route('/personalData').get((req, res) => {
	const { user } = req.query;

	Order.find({ email: user })
		.sort({ date: -1 })
		.limit(10)
		.then((orders) => res.json(orders))
		.catch((err) => res.status(400).json('Error:' + err));
});

module.exports = router;