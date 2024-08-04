import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"First Name Must contain atlast 3 characters"]
    },
    lastName:{
        type:String,
        required:true,
        minLength:[3,"Last Name Must contain atlast 3 characters"]
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,"Last Name Must contain atlast 3 characters"]
    },
    phone:{
        type:String,
        required:true,
        unique:true,
        minLength:[10,"Phone must contain exact 10 digits"],
        maxLength:[10,"Phone must contain exact 10 digits"]
    },
    nic:{
        type:String,
        required:true,
        unique:true,
        minLength:[10,"Phone must contain exact 10 digits"],
        maxLength:[10,"Phone must contain exact 10 digits"]
    },
    dob: {
        type: Date,
        required: [true, 'DOB is required']
    },
    gender:{
        type:String,
        required:true,
        enum:["Male","Female"]
    },
    password:{
        type:String,
        minLength:[4,"Min 4 letters/digits"],
        select:false//will not appeear when called upon
    },
    role:{
        type:String,
        required:true,
        enum:["Admin","Patient","Doctor"]

    },
    doctorDepartment:{
        type:String,
    },
    docAvatar:{ 
        public_id:String,
        url:String
    }


})


userSchema.pre("save",async function(next){
    if(!this.isModified("password"))
        {
            next()
        }
    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.comparePassword=async function(enteredPassword)
{
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.generateJsonWebToken=function()
{
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY)
}

export const User=mongoose.model("User",userSchema)