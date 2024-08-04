import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middleware/errorMiddleware.js"
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, message } = req.body;
    
    // Check if any required fields are missing
    if (!firstName || !lastName || !email || !phone || !message) {
        // return res.status(400).json({
        //     message: "Please fill all the fields"
        // });
        return next(new ErrorHandler("Please Fill the form",400))
    }

    // Create a new message using Mongoose model
    await Message.create({ firstName, lastName, email, phone, message });

    // Respond with success message
    res.status(200).json({
       
        message: "Message sent successfully from backend"
    });
});


export const getAllMessage=catchAsyncErrors(async(req,res,next)=>
{
    const messages=await Message.find();
    res.status(200).json({success:"true",messages})
})