"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiFileUpload = void 0;
const cloudinary_1 = __importDefault(require("./cloudinary"));
const multiFileUpload = async (req, reply) => {
    try {
        const files = await req.files();
        console.log(files);
        if (!files) {
            reply.status(400).send({ success: false, message: "No files uploaded" });
            return;
        }
        // Upload each file to Cloudinary
        const uploadedFiles = [];
        for await (const file of files) {
            // Optional: Validate file type
            if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
                reply.status(400).send({ success: false, message: "Invalid file type" });
                return;
            }
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({ folder: "fastify_uploads" }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result);
                });
                file.file.pipe(uploadStream);
            });
            uploadedFiles.push(uploadResult);
        }
        reply.status(200).send({
            success: true,
            files: uploadedFiles,
        });
    }
    catch (err) {
        req.log.error({ err }, "Multi-file upload failed");
        reply.status(500).send({
            success: false,
            message: "Failed to upload files. Please try again later.",
        });
    }
};
exports.multiFileUpload = multiFileUpload;
