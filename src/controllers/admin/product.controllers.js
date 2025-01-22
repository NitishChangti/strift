import { asyncHandler } from "../../utils/asyncHandler.js";
// import { product } from "../../models/product.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiRes.js";
import mongoose from "mongoose";
import { uploadOnCloudinary, singleUploadOnCloudinary, deleteSingleImageFromCloudinary } from '../../utils/cloudinary.js'
import { product } from '../../models/product.js'
import { Category } from "../../models/category.js";
import { query } from "express";


const createProduct = asyncHandler(async (req, res) => {
    const { name,
        Categories,
        description,
        price,
        countInStock,
        variant,
        ...productDetails // Use the rest of the fields dynamically
    } = req.body;

    // Check if the 'variant' data exists before processing it
    // const variants = Object.keys(req.body)
    //     .filter(key => key.startsWith('variant'))  // Check for variant keys
    //     .map(key => {
    //         const indexMatch = key.match(/\d+/);  // Extract index number from key (e.g. 0, 1)
    //         if (indexMatch) {
    //             const index = indexMatch[0];  // If there's no match, `indexMatch` will be null
    //             const variant = {
    //                 size: req.body[`variant[${index}][size]`],
    //                 color: req.body[`variant[${index}][color]`],
    //                 stock: req.body[`variant[${index}][stock]`],
    //             };
    //             return variant;
    //         }
    //         return null;
    //     })
    //     .filter(variant => variant !== null);  // Filter out any null variants if the keys were malformed

    console.log('before variants', variant.length)
    // Manually capture variants from the request body
    const variants = [];
    for (let i = 0; i < variant.length; i++) {
        let size = req.body.variant[i].size;
        let color = req.body.variant[i].color;
        let stock = req.body.variant[i].stock;
        console.log("size", size)

        if (!size || !color || !stock) {
            break;  // Stop when there are no more valid variants
        }
        console.log("size", color)

        variants.push({ size, color, stock });
    }
    if (!Array.isArray(variants)) {
        console.log('variants is not valid')
        return res.status(400).json({ message: "Invalid variant data format" });
    }
    const validateProductDetails = (productDetails) => {
        const rules = {
            StyleCode: 'string',
            PackOf: 'string',
            Closure: 'string',
            Fit: 'string',
            Collar: 'string',
            Fabric: 'string',
            Sleeve: 'string',
            Pattern: 'string',
            Reversible: 'string',
            FabricCare: 'string',
            SuitableFor: 'string',
            Hem: 'string',
            NetQuantity: 'string', // Change to 'number' if needed
        };

        for (const key in rules) {
            if (!productDetails[key] || typeof productDetails[key] !== rules[key]) {
                return `${key} is either empty or not a ${rules[key]}.`;
            }
        }

        return null;
    };

    // Example usage:
    const validationError = validateProductDetails(productDetails);
    if (validationError) {
        console.log('Validation Failed:', validationError);
    } else {
        console.log('Product details are valid');
    }
    console.log(productDetails, variants)

    const image = req.files.image ? req.files.image[0] : null;
    const images = req.files.images ? req.files.images.map(file => file.path) : [];
    console.log(` product name ${name}`);

    const numericCountInStock = Number(countInStock);
    if (isNaN(numericCountInStock)) {
        return res.status(400).json({ message: "Invalid countInStock value" });
    }

    // const numericCountInStock = Number(countInStock);
    console.log(countInStock, numericCountInStock)
    if (name.length > 0 && typeof name === 'string'
        && Categories.length > 0 && typeof Categories === 'string'
        && description.length > 0 && typeof description === 'string'
        && price.length > 0
        && typeof price === "string"
        && typeof numericCountInStock === 'number'
    ) {
        console.log('validation is successful in create product')
    }
    else {
        console.log('validation is failed in create product')
    }

    const findProduct = await product.findOne({ name });
    if (findProduct) {
        return res.status(404).json({ message: 'product already exists in db' })
    }

    // const productImage = await uploadOnCloudinary(image);
    const productImage = await singleUploadOnCloudinary(image);
    console.log("productImage after saved in cloudinary", productImage)
    const productImages = await Promise.all(
        images.map((localFilePath) => uploadOnCloudinary(localFilePath))
    );
    console.log('productImages', productImages[0])
    if (!productImage) {
        return res.status(400).json({ message: 'Single image is required.' });
    }

    if (productImages.length === 0) {
        return res.status(400).json({ message: 'At least one additional image is required.' });
    }
    let categoryId = null;
    let findCat = await Category.findOne({ name: Categories });
    let findSubCat;
    if (findCat) {
        console.log("Main Category found:", findCat);
        categoryId = findCat._id;
    } else {
        findSubCat = await Category.findOne({ "subCategories.name": Categories })
        console.log("Main Category not found:", findSubCat);
        findSubCat = findSubCat.subCategories.find((subCat) => subCat.name === Categories)
        categoryId = findSubCat._id;
        console.log(categoryId)
    }

    // Filter out any null or undefined URLs in case some uploads failed
    const validProductImages = productImages.filter((url) => url !== null);
    let mulImages = validProductImages.map(val => val.url)
    console.log('mulImages', mulImages)
    const Product = new product({
        name: name,
        Category: categoryId,
        description: description,
        price: price,
        countInStock: numericCountInStock,
        image: productImage.url,
        images: mulImages,
        variants: variants,
        productDetails: productDetails
    });
    await Product.save()
    if (!product) {
        return res.status(404).json(404, 'product already exists in db')
    }
    return res.status(200).json(new ApiResponse(
        200,
        { product },
        "product created successfully",
    ))
})

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        console.log(typeof req.query.skip)
        console.log(typeof req.query.limit)
        const skip = req.query.skip
        const limit = req.query.limit
        if (typeof skip === 'string'
            && typeof limit === 'string'
        ) {
            // skip = parseInt(skip)
            // limit = parseInt(limit)
            console.log('validation is done')
        }
        else {
            console.log('validation failed')
            return res.status(400).json(new ApiResponse(
                400,
                { error: 'Invalid query parameters' },
                "Invalid query parameters",
            ))
        }
        const products = await product.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__V')
        if (!products.length > 0) {
            return res.status(404).json(new ApiResponse(
                404,
                { error: 'No products found' },
                "No products found",
            ))
        }
        console.log('products', products)
        const totalProducts = await product.countDocuments()
        console.log('totalProducts', totalProducts)

        const hasMore = skip + limit < totalProducts
        console.log('has more', hasMore)

        return res.status(200).json(new ApiResponse(
            200,
            { products, hasMore },
            "products retrieved successfully",
            'true'
        ))
    } catch (error) {
        return res.status(500).json(new ApiResponse(
            500,
            { error },
            "internal server error",
            'false'
        ))
    }
})

const getSingleProduct = asyncHandler(async (req, res) => {
    const { name, cat, description } = req.query;
    console.log(name, cat, description)
    if ((name && name.length !== 0 && typeof name === 'string')
        || (cat && cat.length !== 0 && typeof cat === 'string')
        || (description && description.length !== 0 && typeof description === 'string')) {
        console.log('validation is done')
    }
    else {
        console.log('validation failed')
    }

    let categoryIds = []; // Array to store matching category IDs
    if (cat && typeof cat === 'string' && cat.length > 0) {
        // Search for categories where `name` matches the query or `subCategories.name` matches
        const matchingCategories = await Category.find({
            $or: [
                { name: { $regex: `\\b${cat}\\b`, $options: 'i' } }, // Main category name
                { "subCategories.name": { $regex: `\\b${cat}\\b`, $options: 'i' } } // Subcategory name
            ]
        });

        // Extract all matching category IDs
        if (matchingCategories.length > 0) {
            matchingCategories.forEach(category => {
                categoryIds.push(category._id); // Add main category ID
                if (category.subCategories && category.subCategories.length > 0) {
                    // Add subcategory IDs that match
                    const matchingSubCategories = category.subCategories.filter(subCat =>
                        new RegExp(`\\b${cat}\\b`, 'i').test(subCat.name)
                    );
                    matchingSubCategories.forEach(subCat => {
                        categoryIds.push(subCat._id); // Add subcategory ID
                    });
                }
            });
        }
    }

    if (categoryIds.length > 0) {
        console.log('Matching category IDs:', categoryIds);
    } else {
        console.log('No matching categories found for the given query.');
    }

    //////////////////////////////////////////////
    let query = { $or: [] }; // Initialize the query object

    // Helper function to generate regex-based conditions for multiple keywords
    const generateRegexQuery = (field, keywords) => {
        return keywords.map(keyword => ({
            [field]: { $regex: `\\b${keyword}\\b`, $options: 'i' } // Case-insensitive match                from this place keyword is replaced with `\\b${keyword}\\b`
        }));
    };

    // Process 'name' if it exists in the request
    if (name && typeof name === 'string' && name.length > 0) {
        const nameKeywords = name.split(' '); // Split the name into keywords
        query.$or.push({ $and: generateRegexQuery('name', nameKeywords) });
    }

    // Process 'description' if it exists in the request
    if (description && typeof description === 'string' && description.length > 0) {
        const descriptionKeywords = description.split(' '); // Split the description into keywords
        query.$or.push({ $and: generateRegexQuery('description', descriptionKeywords) });
    }

    // Add category-based condition to the query if matching categories are found
    if (categoryIds.length > 0) {
        query.$or.push({ Category: { $in: categoryIds } }); // Match any of the category IDs
    }

    // Validate if there are any conditions in the query
    if (query.$or.length === 0) {
        return res.status(400).json(new ApiResponse(
            400,
            { error: "No valid query parameters provided" },
            "Bad request",
            'false'
        ));
    }

    // Perform the query
    const Product = await product.find(query);

    if (!Product) {
        return res.status(404).json(new ApiResponse(
            404,
            { error: "product not found" },
            "product not found",
            'false'
        ))
    }
    console.log("product", Product)
    return res.status(200).json(new ApiResponse(
        200,
        Product,
        "product found",
        'true'
    ));
})


const updateProduct = asyncHandler(async (req, res) => {
    try {
        const { name, Categories, description, price, countInStock } = req.body;
        const id = req.query.id
        const image = req.files.image ? req.files.image[0] : null;
        const images = req.files.images ? req.files.images.map(file => file.path) : [];
        // console.log('image is', image)
        // console.log("countInStock", countInStock)
        // console.log(name, Categories, description, price, countInStock, id, image, images)
        let query = {}
        if (name && typeof name === 'string' && name.length > 0) query.name = name

        if (Categories && typeof Categories === 'string' && Categories.length > 0) query.category = Categories

        if (description && typeof description === 'string' && description.length > 0) query.description = description

        if (price && typeof price === 'string' && price.length > 0) query.price = price

        if (countInStock) query.countInStock = countInStock

        if (!id) return res.status(400).json({ message: "Product ID is required" });

        const findProduct = await product.findById(id)
        if (!findProduct) return res.status(404).json({ message: "Product not found" })

        console.log(`findProduct ${findProduct}`)

        if (findProduct.image && image) {
            console.log('findProduct.image and image both available')
            const publicId = findProduct.image?.split('upload/')[1]?.replace(/^[^/]+\//, "").split(".")[0];
            console.log('public id', publicId)
            await deleteSingleImageFromCloudinary(publicId)
            console.log('destroyed image from cloudinary')
            const productImage = await singleUploadOnCloudinary(image);
            console.log("productImage after saved in cloudinary", productImage)
            query.image = productImage.url
            console.log('image work is done')
        }

        if (findProduct.images && images && images.length > 0) {
            // console.log(findProduct.images?.length)
            for (let i = 0; i < findProduct.images?.length; i++) {
                var publicId = findProduct.images[i].split('/upload/')[1].split('/')
                publicId = `${publicId[1]}/${publicId[2]}/${publicId[3]}`.split('.')[0]
                // console.log('public id multi images', publicId)
                deleteSingleImageFromCloudinary(publicId)
                // console.log(`destroyed image from cloudinary ${i}`)
            }
            const productImages = await Promise.all(
                images.map((localFilePath) => uploadOnCloudinary(localFilePath))
            );
            query.images = productImages.map((img) => img.url);
            console.log('images uploaded', query.images)
        }
        console.log('product query started', findProduct._id)
        const updateProduct = await product.findByIdAndUpdate(
            id,   // Filter based on product id
            { $set: query },  // Update the fields dynamically
            { new: true }
        )
        console.log("query is ended", query)
        await updateProduct.save()
        if (!updateProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updateProduct
        });

    } catch (error) {
        return res.status(400).json(new ApiResponse(
            400,
            { error: "Invalid request" },
            "Invalid request",
            'false'
        ));
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id
        console.log(id)
        const Product = await product.findById(id)
        if (!Product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (Product.image) {
            console.log('findProduct.image  available')
            const publicId = Product.image?.split('upload/')[1]?.replace(/^[^/]+\//, "").split(".")[0];
            console.log('public id', publicId)
            await deleteSingleImageFromCloudinary(publicId)
            console.log('destroyed image from cloudinary')
            console.log('image work is done')
        }

        if (Product.images) {
            for (let i = 0; i < Product.images?.length; i++) {
                var publicId = Product.images[i].split('/upload/')[1].split('/')
                publicId = `${publicId[1]}/${publicId[2]}/${publicId[3]}`.split('.')[0]
                // console.log('public id multi images', publicId)
                deleteSingleImageFromCloudinary(publicId)
                // console.log(`destroyed image from cloudinary ${i}`)
            }
            console.log('images work is done')
        }

        await Product.deleteOne()
        console.log('done')
        return res.status(200).json(
            new ApiResponse(
                200,
                { message: "Product deleted successfully" },
                "Product deleted successfully",
                'true'
            )
        )
    } catch (error) {
        return res.status(400).json(new ApiResponse(
            400,
            { error: "Invalid request" },
            "Invalid request",
            'false'
        ));
    }
})

const searchProducts = asyncHandler(async (req, res) => {
    try {
        const { name, cat, description } = req.query;
        console.log(name, cat, description)
        if ((name && name.length !== 0 && typeof name === 'string')
            || (cat && cat.length !== 0 && typeof cat === 'string')
            || (description && description.length !== 0 && typeof description === 'string')) {
            console.log('validation is done')
        }
        else {
            console.log('validation failed')
        }

        let categoryIds = []; // Array to store matching category IDs
        if (cat && typeof cat === 'string' && cat.length > 0) {
            // Search for categories where `name` matches the query or `subCategories.name` matches
            const matchingCategories = await Category.find({
                $or: [
                    { name: { $regex: `\\b${cat}\\b`, $options: 'i' } }, // Main category name
                    { "subCategories.name": { $regex: `\\b${cat}\\b`, $options: 'i' } } // Subcategory name
                ]
            });

            // Extract all matching category IDs
            if (matchingCategories.length > 0) {
                matchingCategories.forEach(category => {
                    categoryIds.push(category._id); // Add main category ID
                    if (category.subCategories && category.subCategories.length > 0) {
                        // Add subcategory IDs that match
                        const matchingSubCategories = category.subCategories.filter(subCat =>
                            new RegExp(`\\b${cat}\\b`, 'i').test(subCat.name)
                        );
                        matchingSubCategories.forEach(subCat => {
                            categoryIds.push(subCat._id); // Add subcategory ID
                        });
                    }
                });
            }
        }

        if (categoryIds.length > 0) {
            console.log('Matching category IDs:', categoryIds);
        } else {
            console.log('No matching categories found for the given query.');
        }

        //////////////////////////////////////////////
        let query = { $or: [] }; // Initialize the query object

        // Helper function to generate regex-based conditions for multiple keywords
        const generateRegexQuery = (field, keywords) => {
            return keywords.map(keyword => ({
                [field]: { $regex: `\\b${keyword}\\b`, $options: 'i' } // Case-insensitive match                from this place keyword is replaced with `\\b${keyword}\\b`
            }));
        };

        // Process 'name' if it exists in the request
        if (name && typeof name === 'string' && name.length > 0) {
            const nameKeywords = name.split(' '); // Split the name into keywords
            query.$or.push({ $and: generateRegexQuery('name', nameKeywords) });
        }

        // Process 'description' if it exists in the request
        if (description && typeof description === 'string' && description.length > 0) {
            const descriptionKeywords = description.split(' '); // Split the description into keywords
            query.$or.push({ $and: generateRegexQuery('description', descriptionKeywords) });
        }

        // Add category-based condition to the query if matching categories are found
        if (categoryIds.length > 0) {
            query.$or.push({ Category: { $in: categoryIds } }); // Match any of the category IDs
        }

        // Validate if there are any conditions in the query
        if (query.$or.length === 0) {
            return res.status(400).json(new ApiResponse(
                400,
                { error: "No valid query parameters provided" },
                "Bad request",
                'false'
            ));
        }

        // Perform the query
        const Product = await product.find(query);

        if (!Product) {
            return res.status(404).json(new ApiResponse(
                404,
                { error: "product not found" },
                "product not found",
                'false'
            ))
        }
        console.log("product", Product)
        return res.status(200).json(new ApiResponse(
            200,
            Product,
            "product found",
            'true'
        ));
    } catch (error) {
        return res.status(400).json(new ApiResponse(
            400,
            { error: "Invalid request" },
            "Invalid request",
            'false'
        ));
    }
})

export {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
}