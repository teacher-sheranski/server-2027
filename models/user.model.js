import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import { env } from "../config/env.js";

const userSchema = new Schema({
    username:  { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    address: String,
    phone: String,
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

// כל הפונקציות על הסכמה לא יכולות להיות חץ
// this כי הן משתמשות

// פונקציה שקורית לפני שמירה/עדכון
userSchema.pre(['save', /update/], async function () {
    // this - האוביקט שהולך להישמר בדטהבייס

    // אם לא שיניתי סיסמא - צא מהפונקציה
    if (!this.isModified('password')) return;

    // מספר הסיבובים של ההצפנה
    const saltRounds = env.JWT_SECRET;
    const salt = await bcrypt.genSalt(saltRounds);

    // הצפנה
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;

    // this נשמר בדטהבייס
});

userSchema.methods.comparePassword = async function (password) {
    console.log(this);
    
    // אם הסיסמא ששלחנו זהה לסיסמא המוצפנת שבדטהבייס
    return await bcrypt.compare(password, this.password);
};

// הגדרות על האוסף
const User = model('users', userSchema);

export default User;