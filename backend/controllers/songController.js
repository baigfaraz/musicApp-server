const asyncHandler = require("express-async-handler");
const Song = require("../models/songsModel");

// @desc get songs
// @routes GET /api/songs
//@access private
const getSongs = asyncHandler(async (req, res) => {
  const songs = await Song.find();
  res.status(200).json(songs);
});

// @desc set songs
// @routes POST /api/songs
//@access private
const setSongs = asyncHandler(async (req, res) => {
  if (!req.body.song_title) {
    res.status(400);
    throw new Error("Please add some text. Thankyou!");
  }
  const songs = await Song.create({
    song_title: req.body.song_title,
    song_artist: req.body.song_artist,
    song_album: req.body.song_album,
    song_artwork: req.body.song_artwork,
    song_duration: req.body.song_duration,
    song_year: req.body.song_year,
    song_file: req.body.song_file,
    song_lyrics: req.body.song_lyrics,
  });
  res.status(201).json(songs);
});

module.exports = { getSongs, setSongs };
