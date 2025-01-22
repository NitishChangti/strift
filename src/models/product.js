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
            type: String,
            require: true,
            min: 0
        },
        countInStock: {
            type: Number,
            require: true,
            min: 0
        },
        ratings: {
            type: Number,
            require: true,
        },
        reviews: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                comment: {
                    type: String,
                    require: true
                },
                ratings: {
                    type: Number,
                    require: true
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        variants: [
            {
                size: {
                    type: String,
                    require: true
                },
                color: {
                    type: String,
                    require: true
                },
                stock: {
                    type: Number,
                    require: true
                }
            }
        ],
        productDetails: {
            type: Schema.Types.Mixed, // Allows dynamic key-value pairs (flexible structure)
        }
    },
    {
        timestamps: true
    }
)



const product = mongoose.model("product", productSchema)

export { product }