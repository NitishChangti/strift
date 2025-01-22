import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiRes.js";
import { Category } from "../../models/category.js";
import mongoose from "mongoose";
import { uploadOnCloudinaryForCategory } from '../../utils/cloudinary.js';

const createCategory = asyncHandler(async (req, res) => {
    try {
        console.log('req body of category create', req.body)
        const { categoryName, createdBy, TagId, description } = req.body;
        console.log('categoryName', categoryName)
        console.log('createdBy', createdBy)
        console.log('TagId', TagId)
        console.log('description', description)
        console.log('req of files', req.file)
        const cat = await Category.findOne(
            {
                $or: [
                    { name: req.body.categoryName },
                    { TagId: TagId }
                ]
            }
        );
        console.log('cat', cat)
        if (cat) {
            console.log("cat exists already")
            return res.status(200).json(
                new ApiResponse(
                    200,
                    { cat },
                    'Category Already exists in a Db.'
                )
            )
        }
        const image = req.file ? req.file : null;
        console.log('image before save in cloudinary', image)
        const categoryImage = await uploadOnCloudinaryForCategory(image);
        console.log("productImage after saved in cloudinary", categoryImage)
        console.log(categoryName, createdBy, TagId, description)
        const category = new Category({
            name: categoryName,
            createdBy: createdBy,
            TagId: TagId,
            CategoryThumbnail: categoryImage.url,
            description: description
        })

        const data = await category.save()
        console.log(data, 'category', category)

        return res.status(200).json(new ApiResponse(
            200,
            { category },
            "category created successfully",
            true
        ))
    }
    catch (err) {
        res.status(400).json(new ApiError(
            400,
            'category could not bes created',
            err
        ))
    }
})

const getAllCategory = asyncHandler(async (req, res) => {
    try {
        console.log('retrive all categories')
        // res.send('retrive all categories')

        const category = await Category.find()
        if (category.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No categories available'
            });
        }
        return res.status(200).json({
            status: 200,
            message: 'Categories retrieved successfully',
            data: category
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while retrieving categories',
            error: error.message
        });
    }
})


const getSingleCategory = asyncHandler(async (req, res) => {
    try {
        console.log('retrieve single category')
        // console.log(req.params.catId)
        if (!mongoose.Types.ObjectId.isValid(req.params.catId)) {
            return res.status(400).json(new ApiResponse(
                400,
                null,
                "Invalid category ID format",
                false
            ));
        }

        const category = await Category.findById(req.params.catId)
        if (!category) {
            return res.status(404).json(new ApiResponse(
                404,
                null,
                "Category not found",
                false
            ))
        }
        return res.status(200).json(new ApiResponse(
            200,
            category,
            "Category retrieved or found successfully",
            true
        ))
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while retrieving categories',
            error: error.message
        });
    }
})

const updateCategory = asyncHandler(async (req, res) => {
    try {
        let name = req.body.name;
        let description = req.body.description;
        let subCategory = req.body.subCategory;
        if (!mongoose.Types.ObjectId.isValid(req.params.catId)) {
            return res.status(404).json(new ApiResponse(
                404,
                null,
                "Invalid Category Id format"
            ))
        }
        const category = await Category.findById(req.params.catId)
        if (!category) {
            return res.status(404).json(new ApiResponse(
                404,
                null,
                'Category not found'
            ))
        }
        if (name) category.name = name
        if (description) category.description = description
        if (subCategory) {
            console.log('not array sub category')
            const existingSubCat = category.subCategories.some(
                (sc) => sc.name === subCategory
            );
            if (!existingSubCat) {
                console.log('sub category is added')
                category.subCategories.push({ name: subCategory }); // Add new subcategory
            }
            else {
                console.log('sub category is exists already')

            }
            console.log('sub category is pushed')
        }
        const updatedCategory = await category.save();
        return res.status(200).json({
            status: 200,
            message: 'Category updated successfully',
            data: updatedCategory,
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while retrieving categories',
            error: error.message
        });
    }
})

const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const cat = req.body.category
        const subCat = req.body.subCategory

        const category = await Category.findOne(cat);
        if (!category) {
            return res.status(404).json(new ApiResponse(
                404,
                null,
                "Category not found"
            ));
        }
        if (subCat) {
            const subCategoryIndex = category.subCategories.findIndex(
                (sc) => sc.name === subCat
            );

            // If the subcategory doesn't exist, return an error
            if (subCategoryIndex === -1) {
                return res.status(404).json(new ApiResponse(
                    404,
                    null,
                    "Subcategory not found"
                ));
            }
            // Remove the subcategory from the subCategories array
            category.subCategories.splice(subCategoryIndex, 1);

            // Save the updated category with the subcategory removed
            await category.save();

            return res.status(200).json(new ApiResponse(
                200,
                category,
                `Subcategory '${subCat}' deleted successfully`
            ));
        }
        if (cat) {
            await category.deleteOne();

            return res.status(200).json(new ApiResponse(
                200,
                null,
                "Category deleted successfully"
            ));
        }
        // If no subCategory or removeCategory is provided, return a message
        return res.status(400).json(new ApiResponse(
            400,
            null,
            "No valid request to delete category or subcategory"
        ));

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while retrieving categories',
            error: error.message
        });
    }
})

const searchCategory = asyncHandler(async (req, res) => {
    try {
        // console.log(req.query.search)
        const query = `${req.query.search}`
        // console.log("query", query)
        if (!query || query === '') {
            return res.status(400).json(new ApiResponse(
                400,
                null,
                "search query is required"
            ))
        }
        const category = await Category.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { "subCategoriesname": { $regex: query, $options: "i" } }
            ]
        })
        if (category.length === 0) {
            return res.status(400).json(new ApiError(
                400,
                null,
                "No Matching Category or subCategory not found"
            ))
        }
        return res.status(200).json(new ApiResponse(
            200,
            category,
            "matching category found successfully "
        ))

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while retrieving categories',
            error: error.message
        });
    }
})


const createSubCategory = asyncHandler(async (req, res) => {
    try {
        console.log('sub category')
        const { categoryTagId, subCategoryName, description, TagId } = req.body;
        console.log(typeof categoryTagId)
        const category = await Category.findOne({
            TagId: categoryTagId,
        });
        console.log('category', category)
        if (!category) {
            return res.status(400).json(new ApiError(
                400,
                null,
                "Category not found"
            ))
        }
        const subCategory = category.subCategories.find(subCat => subCat.name === subCategoryName && subCat.TagId === TagId);
        if (subCategory) {
            return res.status(400).json(new ApiError(
                400,
                null,
                "Subcategory already exists"
            ));
        }

        category.subCategories.push({
            name: subCategoryName,
            TagId: TagId,
            description: description
        });

        await category.save();

        return res.status(200).json(new ApiResponse(
            200,
            category,
            "Subcategory created successfully"
        ));
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(
            500,
            null,
            "An error occurred while creating sub category"
        ))
    }
});
export {
    createCategory,
    getAllCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory,
    searchCategory,
    createSubCategory
}