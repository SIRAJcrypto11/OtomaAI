import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Cloudinary configuration is automatically picked up from CLOUDINARY_URL in .env if present.
// Alternatively, we can configure it explicitly if env vars are split.
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

export class CloudinaryIntegration {
    /**
     * Upload an image or video to Cloudinary.
     * @param fileBase64 Base64 string of the file or URL
     * @param folder Name of the folder to store in Cloudinary (e.g. workspace_id)
     */
    public static async uploadMedia(fileBase64: string, folder: string = "nexus_uploads"): Promise<UploadApiResponse | null> {
        try {
            const result = await cloudinary.uploader.upload(fileBase64, {
                folder: folder,
                resource_type: "auto", // Automatically detect image vs video
            });
            return result;
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            return null;
        }
    }

    /**
     * Delete an asset from Cloudinary
     * @param publicId The public ID of the asset
     */
    public static async deleteMedia(publicId: string): Promise<boolean> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === "ok";
        } catch (error) {
            console.error("Cloudinary Delete Error:", error);
            return false;
        }
    }

    /**
     * Get an optimized URL for an image
     */
    public static getOptimizedUrl(publicId: string, width: number = 800): string {
        return cloudinary.url(publicId, {
            fetch_format: 'auto',
            quality: 'auto',
            width: width,
            crop: 'scale'
        });
    }
}
