import express from 'express'

const categoryrouter = express.Router();
//to serve static files 
import path from 'path';
import { fileURLToPath } from 'url';


// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

categoryrouter.use(express.static(path.join(__dirname, '../../../public/admin')));


import { authorization } from "../../middlewares/roleAuth.js"
categoryrouter.get('/admin/category', async (req, res) => {
    res.send('admin category')
})
import { upload } from '../../middlewares/multer.middlewares.js'

import {
    createCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory, searchCategory, createSubCategory
} from '../../controllers/admin/category.controllers.js';

categoryrouter.route('/dashboard/createcategory').post(authorization('admin'),
    // upload.fields([
    //     {
    //         name: "image",
    //         maxCount: 1,
    //         minCount: 1
    //     }
    // ]),
    upload.single('image'),
    createCategory
);

categoryrouter.get(['/dashboard/category-lists', '/dashboard/category-edit', '/dashboard/category-create'], (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/admin/admin.html'))
    // res.sendFile(path.join(__dirname, '../../../public/user/home/header.html'));
    // res.send('dashboard category')
})
// get all category
categoryrouter.route('/dashboard/getallcategory').get(authorization('admin'), getAllCategory)

//create sub category
categoryrouter.route('/dashboard/createsubcategory').post(authorization('admin'), createSubCategory)

categoryrouter.route('/admin/getsinglecategory/:catId').post(authorization('admin'), getSingleCategory)

categoryrouter.route('/admin/updatecategory/:catId').patch(authorization('admin'), updateCategory)

categoryrouter.route('/admin/deletecategory').delete(authorization('admin'), deleteCategory)

categoryrouter.route('/admin/searchcategory').get(authorization('admin'), searchCategory)

export default categoryrouter;
