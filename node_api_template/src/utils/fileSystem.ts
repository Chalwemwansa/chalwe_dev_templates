import fs from "fs";
import path from "path";

// Define the type for a picture object
interface Picture {
  name: string; // File name, including extension
  mv: (destination: string) => Promise<void>; // Method to move the file, returns a promise
}

const fileSystem = {
  /**
   * Uploads one or more pictures and returns their filenames.
   *
   * @param pictures - An array of pictures or a single picture to be uploaded
   * @returns A promise that resolves to an array of uploaded filenames
   */
  upload: async (
    pictures: Picture | Picture[]
  ): Promise<string[] | { error: string }> => {
    try {
      const pics: string[] = [];
      let filename: string;
      let name: string;
      let filePath: string;

      // Handle multiple pictures if uploaded
      if (Array.isArray(pictures)) {
        for (const picture of pictures) {
          name = `${picture.name.split(".")[0]}.jpeg`; // Convert to JPEG format
          filename = `${Date.now()}-${name}`;
          filePath = path.join("uploads", filename);
          await picture.mv(filePath); // Await the move operation
          pics.push(filename);
        }
      } else {
        // Handle single picture if uploaded
        name = pictures.name;
        if (pictures.name.split(".")[1] === "jfif") {
          name = `${pictures.name.split(".")[0]}.jpeg`; // Convert jfif to jpeg
        }
        filename = `${Date.now()}_${name}`;
        filePath = path.join("uploads", filename);
        await pictures.mv(filePath);
        pics.push(filename);
      }
      return pics;
    } catch (e: any) {
      console.error(e);
      return { error: e.message }; // Return the error as an object
    }
  },

  /**
   * Deletes one or more pictures from the file system.
   *
   * @param pictures - An array of picture filenames to delete
   * @returns A promise that resolves when deletion is complete
   */
  delete: async (pictures: string[]): Promise<{ error?: string }> => {
    try {
      const root = path.join(__dirname, "..", "uploads");
      for (const picture of pictures) {
        const filePath = path.join(root, picture);
        try {
          await fs.promises.unlink(filePath); // Use promises API to delete file
        } catch (e: any) {
          console.warn(`Failed to delete ${picture}: ${e.message}`);
        }
      }
      return {};
    } catch (e: any) {
      console.error(e);
      return { error: e.message };
    }
  },
};

export default fileSystem;
