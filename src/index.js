import express from "express";
import "dotenv/config";

const app = express();

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(app.get("port"), (error) => {
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } else {
    // eslint-disable-next-line no-console
    console.info(`Listening on port ${app.get("port")}`);
  }
});
