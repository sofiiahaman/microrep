const express = require("express");

const app = express();
const PORT = Number(process.env.PORT) || 5001;

app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("Hello, MicroRep server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
