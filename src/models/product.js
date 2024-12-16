import mongoose, { Mongoose, Schema } from "mongoose";
import { Category } from "./category.js";

const productSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true
        },
        description: {
            type: String,
            require: true,
        },
        Category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            require: true
        },
        image: {
            type: String
        },
        images: [{
            type: String
        }],
        price: {
            type: Number,
            require: true,
            min: 0
        },
        countInStock: {
            type: Number,
            require: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
)

const product = mongoose.model("product", productSchema)

export { product }