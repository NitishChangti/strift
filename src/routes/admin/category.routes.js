import express from 'express'

//to serve static files 


const categoryrouter = express.Router();
import { authorization } from "../../middlewares/roleAuth.js"
categoryrouter.get('/admin/category', async (req, res) => {
    res.send('admin category')
})

import { createCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory, searchCategory } from '../../controllers/admin/category.controllers.js';
categoryrouter.route('/admin/category').post(authorization('admin'), createCategory);

categoryrouter.route('/admin/getallcategory').get(authorization('admin'), getAllCategory)

categoryrouter.route('/admin/getsinglecategory/:catId').post(authorization('admin'), getSingleCategory)

categoryrouter.route('/admin/updatecategory/:catId').patch(authorization('admin'), updateCategory)

categoryrouter.route('/admin/deletecategory').delete(authorization('admin'), deleteCategory)

categoryrouter.route('/admin/searchcategory').get(authorization('admin'), searchCategory)

export default categoryrouter;
