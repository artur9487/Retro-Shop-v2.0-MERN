/** @format */

const router = require('express').Router();
let Products = require('../models/productModels');
let Order = require('../models/orderModels');
let OrderNotyfication = require('../models/orderNotyficationModel');
let CommentNotyfication = require('../models/commentNotyficationModel');
const multer = require('multer');

const {
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
	onAuthStateChanged
} = require('firebase/auth');
const {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL
} = require('firebase/storage');

exports.postNewProductImage = (req, res) => {
	const storage = getStorage();
	const file = req.file;

	const timestamp = Date.now();
	const name = file.originalname.split('.')[0];
	const type = file.originalname.split('.')[1];
	const fileName = `${name}_${timestamp}.${type}`;
	const storageRef = ref(storage, `productImages/${fileName}`);
	uploadBytes(storageRef, file.buffer)
		.then((snapshot) => {
			console.log('Uploaded a blob or file!');
		})
		.then(() => {
			getDownloadURL(storageRef).then((url) => {
				return res.json(url);
			});
		})
		.catch((err) => res.status(400).json('Error:' + err));
};

exports.postYourProduct = (req, res) => {
	const newProductBody = req.body;
	const newProduct = new Products(newProductBody);
	newProduct
		.save()
		.then(() => {
			return res.json('product Added');
		})
		.catch((err) => res.status(400).json('Error:' + err));
};

exports.updateyourProduct = (req, res) => {
	const newProductBody = req.body.product;
	const productID = req.body.id;
	console.log(newProductBody);
	Products.replaceOne({ _id: productID }, newProductBody)
		.then(() => res.json('product Updated'))
		.catch((err) => res.status(400).json('Error:' + err));
};

exports.getStartPage = (req, res) => {
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
};

exports.getMainPage = (req, res) => {
	const user = req.params.user;
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
				CommentNotyfication.find({ receiver: user })
					.sort({ date: -1 })
					.limit(10)
					.then((comments) => {
						OrderNotyfication.find({ receiver: user })
							.sort({ date: -1 })
							.limit(10)
							.then((orders) => {
								let notyfications = comments.concat(orders);
								notyfications.sort((a, b) => b.date - a.date);
								const notyfication10 = notyfications.slice(0, 10);

								return res.json({
									products: products,
									allProducts: allProducts,
									notyfications: notyfication10
								});
							});
					});
			})
		)
		.catch((err) => res.status(400).json('Error:' + err));
};

exports.deleteProduct = (req, res) => {
	Products.deleteOne({
		_id: req.query.id
	})
		.then(() => {
			return res.json('product delted');
		})
		.catch((err) => res.status(400).json('Error:' + err));
};

exports.getProducts = (req, res) => {
	Products.find({ email: req.params.user })
		.sort({ date: -1 })
		.then((products) => {
			return res.json(products);
		})
		.catch((err) => res.status(400).json('Error:' + err));
};

exports.postOrder = (req, res) => {
	const newOrder = new Order(req.body.order);
	const arr = req.body.newArr;

	newOrder
		.save()
		.then(() => {
			OrderNotyfication.bulkWrite(
				arr.map((item) => {
					return {
						insertOne: {
							document: item
						}
					};
				})
			);
		})
		.catch((err) => res.status(400).json('Error:' + err));
};

exports.deleteProductsAfterOrdering = (req, res) => {
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
};

exports.updateProductsAfterOrdering = (req, res) => {
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
};

exports.getPersonalData = (req, res) => {
	const { user } = req.params;

	Order.find({ email: user })
		.sort({ date: -1 })
		.limit(10)
		.then((orders) =>
			OrderNotyfication.find({ receiver: user })
				.sort({ date: -1 })
				.limit(10)
				.then((notyfications) => {
					return res.json({ orders, notyfications });
				})
		)
		.catch((err) => res.status(400).json('Error:' + err));
};

exports.postComment = (req, res) => {
	const newNotyfication = new CommentNotyfication(req.body);
	const value = req.body.value;
	const productID = req.params.productID;

	newNotyfication
		.save()
		.then(() =>
			Products.find({ _id: productID }).then((product) => {
				const count = product[0].ratingCount;
				const value2 = product[0].ratingValue;
				Products.updateOne(
					{ _id: productID },
					{
						$set: {
							ratingCount: count + 1,
							ratingValue: (value2 * count + value) / (count + 1)
						}
					}
				).then(() => {
					return res.json('some products updated');
				});
			})
		)
		.catch((err) => res.status(400).json('Error:' + err));
};

exports.getComments = (req, res) => {
	const id = req.params.productID;

	CommentNotyfication.find({ productID: id })
		.sort({ date: -1 })
		.then((comments) => {
			return res.json(comments);
		})
		.catch((err) => res.status(400).json('Error:' + err));
};

//----------------------------------------
const markingFunction = (notIdsOrders, notIdsComments, user) => {
	CommentNotyfication.bulkWrite(
		notIdsComments.map((id) => {
			return {
				updateOne: {
					filter: { _id: id },
					update: { $set: { marked: true } }
				}
			};
		})
	);

	OrderNotyfication.bulkWrite(
		notIdsOrders.map((id) => {
			return {
				updateOne: {
					filter: { _id: id },
					update: { $set: { marked: true } }
				}
			};
		})
	);

	CommentNotyfication.find({ receiver: user })
		.sort({ date: -1 })
		.limit(10)
		.then((comments) => {
			OrderNotyfication.find({ receiver: user })
				.sort({ date: -1 })
				.limit(10)
				.then((orders) => {
					let notyfications = comments.concat(orders);
					notyfications.sort((a, b) => b.date - a.date);
					const notyfication10 = notyfications.slice(0, 10);

					return res.json({
						notyfications: notyfication10
					});
				});
		});
};

exports.markNotyfications = (req, res) => {
	const { user } = req.params;
	const { notIdsOrders, notIdsComments } = req.body;
	console.log(notIdsOrders, notIdsComments);
	CommentNotyfication.bulkWrite(
		notIdsComments.map((id) => {
			return {
				updateOne: {
					filter: { _id: id },
					update: { $set: { marked: true } }
				}
			};
		})
	);

	OrderNotyfication.bulkWrite(
		notIdsOrders.map((id) => {
			return {
				updateOne: {
					filter: { _id: id },
					update: { $set: { marked: true } }
				}
			};
		})
	);

	CommentNotyfication.find({ receiver: user })
		.sort({ date: -1 })
		.limit(10)
		.then((comments) => {
			OrderNotyfication.find({ receiver: user })
				.sort({ date: -1 })
				.limit(10)
				.then((orders) => {
					let notyfications = comments.concat(orders);
					notyfications.sort((a, b) => b.date - a.date);
					const notyfication10 = notyfications.slice(0, 10);
					console.log(notyfication10);
					return res.json({
						notyfications: notyfication10
					});
				});
		});
};

exports.register = (req, res) => {
	const auth = getAuth();
	const { email, password } = req.body;

	createUserWithEmailAndPassword(auth, email, password)
		.then((data) => {
			return data.user.getIdToken();
		})
		.then((token) => {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					return res.json({ user, token });
				} else {
					return res.json(null);
				}
			});
		});
};

exports.login = (req, res) => {
	const auth = getAuth();
	const { email, password } = req.body;

	signInWithEmailAndPassword(auth, email, password)
		.then((data) => {
			return data.user.getIdToken();
		})
		.then((token) => {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					return res.json({ user, token });
				} else {
					return res.json(null);
				}
			});
		});
};
