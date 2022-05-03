const express = require("express");
const {
  getCoworkingSpaces,
  getCoworkingSpace,
  createCoworkingSpace,
  updateCoworkingSpace,
  deleteCoworkingSpace,
} = require("../controllers/coworkingSpaces");

const reservationRouter = require("./reservations");
const router = express.Router();

const { protect, authorize } = require("../middleware/auth");
router.use("/:coworkingSpaceId/reservations/", reservationRouter);

router
  .route("/")
  .get(getCoworkingSpaces)
  .post(protect, authorize("admin"), createCoworkingSpace);
router
  .route("/:id")
  .get(getCoworkingSpace)
  .put(protect, authorize("admin"), updateCoworkingSpace)
  .delete(protect, authorize("admin"), deleteCoworkingSpace);

module.exports = router;
