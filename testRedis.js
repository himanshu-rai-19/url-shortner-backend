const redis = require("redis");

async function test() {
  const client = redis.createClient({
    url: "redis://127.0.0.1:6379"
  });

  client.on("error", (err) => console.log("Redis error:", err));

  await client.connect();
  console.log("Redis connected successfully");

  const pong = await client.ping();
  console.log("Ping response:", pong);

  await client.disconnect();
}

test();
