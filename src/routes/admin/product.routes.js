import express from 'express'

//to serve static files 

const productrouter = express.Router()

import { authorization } from '../../middlewares/roleAuth.js'

import { createProduct } from '../../controllers/admin/product.controllers.js'
import { upload } from '../../middlewares/multer.middlewares.js'
productrouter.route('/admin/createproduct').post(
    upload.fields([
        {
            name: "image",
            maxCount: 1,
            minCount: 1
        },
        {
            name: "images",
            maxCount: 10,
            minCount: 1
        }
    ]),
    createProduct)
// authorization('admin'),
export default productrouter