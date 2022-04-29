const express = require("express");
const router = express.Router();
const {
  getCoworkingSpaces,
  getCoworkingSpace,
  createCoworkingSpace,
  updateCoworkingSpace,
  deleteCoworkingSpace,
} = require("../controllers/coworkingSpaces");
//const { protect, authorize } = require("../middleware/auth");
//const reservationRouter = require("./reservations");

router
  .route("/")
  .get(getCoworkingSpaces)
  .post(createCoworkingSpace);
router
  .route("/:id")
  .get(getCoworkingSpace)
  .put(updateCoworkingSpace)
  .delete(deleteCoworkingSpace);

module.exports = router;
