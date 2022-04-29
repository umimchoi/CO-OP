const Reservation = require("../models/Reservation");
const CoworkingSpace = require("../models/CoworkingSpace");
const mongoose = require("mongoose");

exports.getReservations = async (req, res, next) => {
  let query;
  if (req.user.role !== "admin") {
    query = Reservation.find({ user: req.user.id }).populate({
      path: "coworkingSpace",
      select: "name province tel",
    });
  } else {
    if (req.params.coworkingSpaceId) {
      query = Reservation.find({
        coworkingSpace: req.params.coworkingSpaceId,
      }).populate({
        path: "coworkingSpace",
        select: "name province tel",
      });
    } else {
      query = Reservation.find().populate({
        path: "coworkingSpace",
        select: "name province tel",
      });
    }
  }
  try {
    const reservations = await query;
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Reservation" });
  }
};

exports.getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate({
      path: "coworkingSpace",
      select: "name description tel",
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Reservation" });
  }
};

//@desc Add reservation
//@route /coworkingSpaces/:coworkingSpaceId/reservation
//@access Private
exports.addReservation = async (req, res, next) => {
  try {
    req.body.coworkingSpace = req.params.coworkingSpaceId;

    const coworkingSpace = await CoworkingSpace.findById(
      req.params.coworkingSpaceId
    );

    if (!coworkingSpace) {
      return res.status(404).json({
        success: false,
        message: `No coworkingSpace with the id of ${req.params.coworkingSpaceId}`,
      });
    }

    req.body.user = req.user.id;
    const existedReservations = await Reservation.find({ user: req.user.id });
    if (existedReservations.length >= 3 && req.user.role != "admin") {
      return res.status(400).json({
        success: true,
        message: `The user with ID ${req.user.id} has already made 3 reservations.`,
      });
    }

    const reservation = await Reservation.create(req.body);

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot create reservation",
    });
  }
};

//@desc Update a reservation
//@route PUT /reservations/:id
//@access Private
exports.updateReservation = async (req, res, next) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with id ${req.params.id}`,
      });
    }

    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this reservation.`,
      });
    }

    reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    console.log(error.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update reservation" });
  }
};

//@desc Delete a reservation
//@route DELETE /reservations/:id
//@access Private
exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: true,
        message: `No reservation with id ${req.params.id}`,
      });
    }

    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this reservation.`,
      });
    }

    await reservation.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete reservation" });
  }
};
