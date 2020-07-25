import express from "express";
import "dotenv/config";
import MapServices from "./map-services";

const SAP = "525 W Santa Clara St, San Jose, CA";

const app = express();
app.use(express.json());

app.set("port", process.env.PORT || 3000);

app.get("/", async (req, res) => {
  try {
    const data = await MapServices.addressLookup(SAP);
    console.log(data.data.results[0]);
    res.json(data.data.results[0]);
  } catch (err) {
    console.log(e);
    res.send("error", e);
  }
});

app.listen(app.get("port"), (error) => {
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } else {
    // eslint-disable-next-line no-console
    console.info(`Listening on port ${app.get("port")}`);
  }
});
