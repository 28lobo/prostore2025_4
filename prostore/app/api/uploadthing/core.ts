// app/api/uploadthing/core.ts
import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

// define your endpoints:
export const ourFileRouter = {
  imageUploader: f({
    // you must specify a file‐type key (e.g. `image`) mapping to its config:
    image: {
      maxFileSize: "4MB",   // valid FileRouteInputConfig property :contentReference[oaicite:0]{index=0}
      maxFileCount: 1,      // how many files allowed :contentReference[oaicite:1]{index=1}
    },
  }).onUploadComplete(({ file }) => {
    console.log("Uploaded:", file.url);
  }),
  // …add more routes here if you need them
};

// export its type for your React helpers
export type OurFileRouter = typeof ourFileRouter;
