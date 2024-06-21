const cloudinary = require("../config/cloudinary.config.js");

const uploadImage = async (file, folder) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: folder }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

const deleteImage = async (public_id) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = { uploadImage, deleteImage };