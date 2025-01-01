import fs from "fs";
import path from "path";

// Define the type for a file object
export interface MediaFile {
  name: string; // File name, including extension
  type: string;
  mv: (destination: string) => Promise<void>; // Method to move the file, returns a promise
}

export interface UploadedFile {
  url: string;
  type: "image" | "video";
}

const homeUrl = `http://127.0.0.1:${process.env.PORT || 4000}`;

const fileSystem = {
  async upload(
    mediaFiles: MediaFile | MediaFile[],
    folder: string = "uploads"
  ): Promise<UploadedFile[] | { error: string }> {
    try {
      const uploadedFiles: UploadedFile[] = [];
      const handleFileUpload = async (file: MediaFile) => {
        const extension = file.name.split(".").pop()?.toLowerCase();
        let name = file.name;

        if (extension === "jfif") {
          name = `${file.name.split(".")[0]}.jpeg`;
        }

        const filename = `${Date.now()}-${name}`;
        const filePath = path.join(folder, filename);
        await file.mv(filePath);
        const mediaType = file.type.startsWith("image") ? "image" : "video";
        uploadedFiles.push({ url: `${homeUrl}/${filename}`, type: mediaType });
      };

      if (Array.isArray(mediaFiles)) {
        await Promise.all(mediaFiles.map(handleFileUpload));
      } else {
        await handleFileUpload(mediaFiles);
      }

      return uploadedFiles;
    } catch (e: any) {
      console.error(e);
      return { error: `Upload failed: ${e.message}` };
    }
  },

  async delete(
    files: UploadedFile[],
    folder: string = "uploads"
  ): Promise<{ error?: string }> {
    try {
      const root = path.join(__dirname, "..", folder);
      await Promise.all(
        files.map(async (file) => {
          const filename = file.url.replace(homeUrl, "");
          const filePath = path.join(root, filename);
          try {
            await fs.promises.unlink(filePath);
          } catch (e: any) {
            console.warn(`Failed to delete ${filename}: ${e.message}`);
          }
        })
      );
      return {};
    } catch (e: any) {
      console.error(e);
      return { error: `Delete failed: ${e.message}` };
    }
  },
};

export default fileSystem;
