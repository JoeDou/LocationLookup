import express from "express";
import "dotenv/config";
import MapServices from "./map-services";
import AddressHandler from "./addressHandler";
import { validationRules, validate } from "./validator";
import { ErrorHandler, handleError, wrapAsync } from "./utils";

const app = express();
app.use(express.json());
app.set("port", process.env.PORT || 3001);

const addressHandler = new AddressHandler(MapServices);

app.post(
  "/address/verify",
  validationRules,
  validate,
  wrapAsync(addressHandler.verifyAndCreateAll)
);

// 404
app.use((req, res, next) => {
  throw new ErrorHandler(404, `Route ${req.url} Not found.`);
});

app.use((err, req, res, next) => {
  handleError(err, res);
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
