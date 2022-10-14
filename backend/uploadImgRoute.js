/** @format */
const {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL
} = require('firebase/storage');

module.exports = (req, res, next) => {
	const BusBoy = require('busboy');
	const path = require('path');
	const os = require('os');
	const fs = require('fs');
	console.log(req.headers);

	const busboy = new BusBoy({ headers: req.headers });

	let imageToBeUploaded = {};
	let imageFileName;
	// String for image token
	let generatedToken = uuid();

	busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
		console.log(fieldname, file, filename, encoding, mimetype);
		if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
			return res.status(400).json({ error: 'Wrong file type submitted' });
		}
		// my.image.png => ['my', 'image', 'png']
		const imageExtension = filename.split('.')[filename.split('.').length - 1];
		// 32756238461724837.png
		imageFileName = `${Math.round(
			Math.random() * 1000000000000
		).toString()}.${imageExtension}`;
		const filepath = path.join(os.tmpdir(), imageFileName);
		imageToBeUploaded = { filepath, mimetype };
		file.pipe(fs.createWriteStream(filepath));
	});
	busboy.on('finish', () => {
		uploadBytes(storageRef, file)
			.then((snapshot) => {
				console.log('Uploaded a blob or file!');
			})
			.then(() => {
				getDownloadURL(storageRef).then((url) => {
					return url;
				});
			})
			.then((url) => {
				const newProductBody = { ...req.body, image: url };
				console.log(newProductBody);
			})
			/*admin
			.storage()
			.bucket()
			.upload(imageToBeUploaded.filepath, {
				resumable: false,
				metadata: {
					metadata: {
						contentType: imageToBeUploaded.mimetype,
						//Generate token to be appended to imageUrl
						firebaseStorageDownloadTokens: generatedToken
					}
				}
			})
			.then(() => {
				// Append token to url
				const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;
				return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
			})*/
			.then(() => {
				return res.json({ message: 'image uploaded successfully' });
			})
			.catch((err) => {
				console.error(err);
				return res.status(500).json({ error: 'something went wrong' });
			});
	});
	busboy.end(req.rawBody);
};
