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
    name: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    height: { type: Number, required: true },
    phoneNo: { type: Number, required: true },
    location: { type: String, required: true },
    avatar: {type: String, required: false, default: "https://res.cloudinary.com/dkpnrehhn/image/upload/v1739706902/avatar-3814049_1280_ifyeuu.png"},
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true } // Reference to the User
  });
export const Profile = mongoose.model("Profile", profileSchema);



const tagSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
  });
  
  export const Tag = mongoose.model("Tag", tagSchema);


  const userTags = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    interests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    
  });
  
  export const UserTag =  mongoose.model("UserTag", userTags);



const questionSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
})
export const Question =  mongoose.model("Question", questionSchema);


const userQuestionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
      answer: { type: String, required: true },
    },
  ],
});
export const UserQuestion =  mongoose.model("UserQuestion", userQuestionSchema);


























// const likeSchema = new Schema({
//     likedTo: [
//         { type: Schema.Types.ObjectId, ref: "User" }, // Users this user liked
//       ],
//       likedBy: [
//         { type: Schema.Types.ObjectId, ref: "User" }, // Users who liked this user
//       ],
// })

// export const Like = mongoose.model("Like", likeSchema)