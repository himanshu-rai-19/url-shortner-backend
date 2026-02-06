const Url = require("../models/url.model");
const { nanoid } = require("nanoid");
const client = require("../config/redis");


exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl)
      return res.status(400).json({ msg: "URL required" });

    const shortId = nanoid(6);

    const url = await Url.create({
      user: req.user._id,
      originalUrl,
      shortId
    });
  


    res.json({
      shortUrl: `${process.env.BASE_URL}${shortId}`
    });

  } catch (err) {
  console.log(err);   // ADD THIS
  res.status(500).json({ msg: "Server error" });
 }

};

exports.redirectUrl = async (req, res) => {
  try {
    const { shortId } = req.params;

    // check Redis cache first
    const cachedUrl = await client.get(shortId);

    if (cachedUrl) {
      console.log("From Redis ⚡");
      return res.redirect(cachedUrl);
    }

    // fallback to MongoDB
    const url = await Url.findOne({ shortId });

    if (!url)
      return res.status(404).send("URL not found");

    // store in Redis
    await client.set(shortId, url.originalUrl, {
      EX: 3600
    });

    url.clicks++;
    await url.save();

    console.log("From MongoDB 🐢");

    res.redirect(url.originalUrl);

  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};


exports.getMyUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await Url.findById(id);

    if (!url)
      return res.status(404).json({ msg: "URL not found" });

    // check ownership
    if (url.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await url.deleteOne();

    res.json({ msg: "URL deleted" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};



