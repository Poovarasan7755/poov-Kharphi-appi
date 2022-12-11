import { Storage } from "@google-cloud/storage";
import { rejects } from "assert";
import { resolve } from "path";
import util from "util";

const { format } = util;

export function uploadBase64FileToGcp(base64, newPath, callback) {
  //const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");

  const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");

  let projectId = "relisafe-api"; // Get this from Google Cloud
  let keyFilename = "./googlekey.json";

  // Get this from Google Cloud -> Credentials -> Service Accounts
  const storage = new Storage({
    projectId,
    keyFilename,
  });

  const bucket = storage.bucket("aviartech"); // Get this from Google Cloud -> Storage

  const blob = bucket.file(newPath);
  const blobStream = blob.createWriteStream();

  let baseUrl = blob.storage.apiEndpoint;
  const publicUrl = `${baseUrl}/aviartech/${blob.name}`;

  // const blobStream = blob.createWriteStream();

  blobStream
    .on("finish", () => {
      const publicUrl = format(`${blob.storage.apiEndpoint}/${blob.name}`);
      resolve(publicUrl);
    })
    .on("error", () => {
       rejects(`Unable to upload image, something went wrong`);
    })
    .end(buffer);

  blobStream.on("finish", () => {
    // res.status(200).send("Success");
    // console.log("Success");
  });
  return callback(null, publicUrl);
}
