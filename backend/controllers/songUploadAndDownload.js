const AWS = require("aws-sdk");
const asyncHandler = require("express-async-handler");
const fs = require("fs");

// Add you own accessKeyId and secretAccessKey
AWS.config.update({
  accessKeyId: "YOUR_ACCESS_KEY",
  secretAccessKey: "YOUR_SECRET_KEY",
  region: "YOUR_REGION",
});

const s3 = new AWS.S3();

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

// download song from S3

const downloadSong = asyncHandler(async (req, res) => {
  const fileName = req.params.fileName;

  const params = {
    Bucket: "project-gramophone",
    Key: fileName,
  };

  try {
    const response = await s3.getObject(params).promise();

    fs.writeFileSync(`./download/${fileName}`, response.Body);

    res.status(200).json({ message: "File downloaded successfully" });
  } catch (err) {
    res.status(500).json({ message: "Download Error!" });
  }
});

// stream an audio whithout download

const streamSong = asyncHandler(async (req, res) => {
  try {
    const fileName = req.params.fileName;
    const params = { Bucket: "project-gramophone", Key: fileName };
    const headObjectResponse = await s3.headObject(params).promise();

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", headObjectResponse.ContentLength);

    s3.getObject(params)
      .createReadStream()
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
