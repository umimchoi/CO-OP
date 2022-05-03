const mongoose = require("mongoose");
//name, address, and telephone number, and open-close time.
const CoworkingSpaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxLength: [50, "Name can not be more than 50 characters"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    district: {
      type: String,
      required: [true, "Please add a district"],
    },
    province: {
      type: String,
      required: [true, "Please add a province"],
    },
    postalcode: {
      type: String,
      required: [true, "Please add a postalcode"],
      maxLength: [5, "Postal code can not be more than 5 digits"],
    },
    tel: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: [true, "Please add a telephone number"],
    },
    openTime: {
      type: String,
      required: [true, "Please add an open time"],
    },
    closeTime: {
      type: String,
      required: [true, "Please add a close time"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CoworkingSpaceSchema.virtual("reservations", {
  ref: "Reservation",
  localField: "_id",
  foreignField: "coworkingSpace",
  justOne: false,
});

CoworkingSpaceSchema.pre("remove", async function (next) {
  console.log(
    `Reservations are being removed from co-working space ${this._id}`
  );
  await this.model("Reservation").deleteMany({ coworkingSpace: this._id });
  next();
});

module.exports = mongoose.model("CoworkingSpace", CoworkingSpaceSchema);
