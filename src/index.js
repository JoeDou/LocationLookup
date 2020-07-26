import express from "express";
import "dotenv/config";
import MapServices from "./map-services";
import AddressHandler from "./addressHandler";
import { validationRules, validate } from "./validator";

const app = express();
app.use(express.json());

app.set("port", process.env.PORT || 3001);

const addressHandler = new AddressHandler(MapServices);

app.post("/address/verify", validationRules, validate, async (req, res) => {
  console.log(req.body);
  const SAP = "525 W Santa Clara St, San Jose, California";
  const data = await addressHandler.addressLookup(SAP);
  res.json(data);
});

// 404
app.use((req, res, next) => {
  return res.status(404).send({ message: `Route ${req.url} Not found.` });
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
