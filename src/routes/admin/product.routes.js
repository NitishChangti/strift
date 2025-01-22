import express from 'express'

const productrouter = express.Router()
//to serve static files 
import path from 'path';
import { fileURLToPath } from 'url';


// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

productrouter.use(express.static(path.join(__dirname, '../../../public/admin')));


import { authorization } from '../../middlewares/roleAuth.js'
import { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, searchProducts } from '../../controllers/admin/product.controllers.js'
import { upload } from '../../middlewares/multer.middlewares.js'

productrouter.route('/admin/createproduct').post(authorization('admin'),
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

productrouter.route('/admin/getAllProducts').get(authorization('admin'), getAllProducts)

productrouter.route('/admin/getSingleProduct').get(authorization('admin'), getSingleProduct)

productrouter.route('/admin/updateProduct').put(authorization('admin'),
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
    updateProduct)

productrouter.route('/admin/deleteProduct').delete(authorization('admin'), deleteProduct)

productrouter.route('/admin/searchProducts').get(authorization('admin'), searchProducts)
export default productrouter