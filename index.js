const express = require("express");
const app = express();
const faceApiService = require("./faceApiServices");

const port = 3000;

app.get("/", async (req, res) => {
  const result = await faceApiService.detect();
  res.json({
    detectedFaces: result?.length || null,
    match: result?.match,
  });
});

app.listen(port, () => {
  console.log("Server started on port" + port);
});
