const express = require("express");
const router = express.Router();
const {
  uploadSong,
  downloadSong,
  streamSong
} = require("../controllers/songUploadAndDownload");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/download/:fileName", downloadSong);
router.post("/upload", upload.single("mp3File"), uploadSong);
router.get("/audioStream/:fileName" , streamSong)

module.exports = router;
