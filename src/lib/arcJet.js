import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["userId"], 
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 30, // 10 collections
      interval: 3600, // per hour
      capacity: 30, // maximum burst capacity
    }),
  ],
});

export default aj;