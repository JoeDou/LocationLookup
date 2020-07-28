import express from "express";
import "dotenv/config";
import MapServices from "./map-services";
import AddressHandler from "./addressHandler";
import { validationRules, validate } from "./validator";
import { ErrorHandler, handleError, wrapAsync } from "./utils";

const app = express();
app.use(express.json());
app.set("port", process.env.PORT || 3001);

// create instance of AddressHandler, takes a map service instance
const addressHandler = new AddressHandler(new MapServices());

// - Main API endpoint to verify address
// - Used express-validator to validate the message body
// - wrapAsync wrapper is used to catch error and pass it to the middleware that handles error message
// - addressHandler is the controller which handles all the verification and create logic
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

// handles Error
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
