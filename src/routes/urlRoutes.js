const express = require("express");
const router = express.Router();

const { createShortUrl, redirectUrl, getMyUrls, deleteUrl } = require("../controllers/urlController");


const protect = require("../middleware/authMiddleware");

// protected route
router.post("/shorten", protect, createShortUrl);
router.get("/myurls", protect, getMyUrls);
router.delete("/:id", protect, deleteUrl);



// redirect
router.get("/:shortId", redirectUrl);

module.exports = router;
