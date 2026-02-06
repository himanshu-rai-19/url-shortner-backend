const redis = require("redis");

const client = redis.createClient({
  url: "redis://127.0.0.1:6379"
});

client.on("error", (err) => console.log("Redis Error:", err));

async function connectRedis() {
  try {
    await client.connect();
    console.log("Redis connected ⚡");
  } catch (err) {
    console.log(err);
  }
}

connectRedis();

module.exports = client;
