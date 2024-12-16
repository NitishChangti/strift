import { asyncHandler } from "../../utils/asyncHandler.js";
import { product } from "../../models/product.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/ApiRes.js";
import mongoose from "mongoose";

const createProduct = asyncHandler(async (req, res) => {
    const { name, categories, description, price, countInStock } = req.body;

    const image = req.files
    console.log(`product list image ${image} and product name ${name}`);
})

export {
    createProduct
}