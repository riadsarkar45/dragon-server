import { FastifyReply, FastifyRequest } from "fastify";
import cloudinary from "./cloudinary";

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
}

export const multiFileUpload = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
        const files = await req.files();
        console.log(files);
        if (!files) {
            reply.status(400).send({ success: false, message: "No files uploaded" });
            return;
        }

        // Upload each file to Cloudinary
        const uploadedFiles: CloudinaryUploadResult[] = [];

        for await (const file of files) {
            // Optional: Validate file type
            if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
                reply.status(400).send({ success: false, message: "Invalid file type" });
                return;
            }

            const uploadResult: CloudinaryUploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "fastify_uploads" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result as CloudinaryUploadResult);
                    }
                );
                file.file.pipe(uploadStream);
            });

            uploadedFiles.push(uploadResult);
        }

        reply.status(200).send({
            success: true,
            files: uploadedFiles,
        });
    } catch (err: unknown) {
        req.log.error({ err }, "Multi-file upload failed");
        reply.status(500).send({
            success: false,
            message: "Failed to upload files. Please try again later.",
        });
    }
};
