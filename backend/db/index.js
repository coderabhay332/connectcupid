import mongoose, { model, Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    });

const userSchema = new Schema({
    email: {
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    likedTo: [
        { type: Schema.Types.ObjectId, ref: "User" }, 
      ],
      likedBy: [
        { type: Schema.Types.ObjectId, ref: "User" },
      ],

})

export const User = mongoose.model("User", userSchema)

const profileSchema = new Schema({
    age: { type: Number, required: true },
    height: { type: Number, required: true },
    phoneNo: { type: Number, required: true },
    location: { type: String, required: true },
    avatar: {type: String, required: false},
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true } // Reference to the User
  });
export const Profile = mongoose.model("Profile", profileSchema);

// const likeSchema = new Schema({
//     likedTo: [
//         { type: Schema.Types.ObjectId, ref: "User" }, // Users this user liked
//       ],
//       likedBy: [
//         { type: Schema.Types.ObjectId, ref: "User" }, // Users who liked this user
//       ],
// })

// export const Like = mongoose.model("Like", likeSchema)