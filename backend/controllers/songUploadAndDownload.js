const AWS = require("aws-sdk");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
require("dotenv").config();
const NodeCache = require("node-cache");

// Add you own accessKeyId and secretAccessKey
AWS.config.update({
  accessKeyId: process.env.ACCESSKEYID_S3,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: "us-east-1",
});

const s3 = new AWS.S3();

// Initialize the cache with a specific TTL (time-to-live) value
const cache = new NodeCache({ stdTTL: 3600 });

// upload song in S3

const uploadSong = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const mp3File = req.file;

    const params = {
      Bucket: "project-gramophone",
      Key: mp3File.originalname,
      Body: mp3File.buffer,
    };

    const result = await s3.upload(params).promise();

    res
      .status(200)
      .json({ message: "File uploaded successfully", url: result.Location });
  } catch (err) {
    res.status(500).json({ message: "Error uploading file" });
  }
});

// download song from S3 to server

// const downloadSong = asyncHandler(async (req, res) => {
//   const fileName = req.params.fileName;

//   const params = {
//     Bucket: "project-gramophone",
//     Key: fileName,
//   };

//   try {
//     const response = await s3.getObject(params).promise();

//     fs.writeFileSync(`./download/${fileName}`, response.Body);

//     res.status(200).json({ message: "File downloaded successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Download Error!" });
//   }
// });

// download song from s3 to local storage

const downloadSong = asyncHandler(async (req, res) => {
  const fileName = req.params.fileName;
  const cachedFileKey = `cached_${fileName}`; // Unique cache key
  // Check if the file is in cache
  const cachedFile = cache.get(cachedFileKey);
  if (cachedFile) {
    // Serve the cached file
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(cachedFile);
    return;
  }
  const params = {
    Bucket: "project-gramophone",
    Key: fileName,
  };
  try {
    const response = await s3.getObject(params).promise();
    // Cache the downloaded file
    cache.set(cachedFileKey, response.Body);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(response.Body);
  } catch (err) {
    res.status(500).json({ message: "Download Error!" });
  }
});

// stream an audio whithout download

const streamSong = asyncHandler(async (req, res) => {
  const fileName = req.params.fileName;

  const cachedStreamKey = `cached_${fileName}`; // Unique cache key
  // Check if the file is in cache
  const cachedStream = cache.get(cachedStreamKey);
  if (cachedStream) {
    // Serve the cached stream
    res.setHeader("Content-Type", "audio/mpeg");
    cachedStream.pipe(res);
    return;
  }

  const params = { Bucket: "project-gramophone", Key: fileName };

  try {
    const headObjectResponse = await s3.headObject(params).promise();

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", headObjectResponse.ContentLength);

    const fileStream = s3.getObject(params).createReadStream();

    // Cache the stream in chunks
    cache.set(cachedStreamKey, fileStream.body);

    fileStream
      .on("error", (error) => {
        console.error("Error streaming audio from S3:", error);
        res.status(500).send("Internal Server Error");
      })
      .pipe(res);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = { uploadSong, downloadSong, streamSong };
