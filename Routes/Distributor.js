const express=require('express');
const{AddCategory,AddProduct,GetProducts,getDistributorsByDistrict,GetProductsByDistributor,deleteProduct,updateProduct,GetCategory,GetProductsByCategory,GetCategorywithProducts,deleteCategory,distributorLoginController,distributorSignupController,getDistributorById,updateDistributor}=require('../Controller/Distributor');
const router=express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });



router.post('/login',distributorLoginController);
router.post('/signup',distributorSignupController);


router.post('/category',AddCategory);
router.get('/category',GetCategory);
router.get("/category-with-products",GetCategorywithProducts)
router.delete('/category/:categoryId',deleteCategory);
router.get("/products/:categoryId", GetProductsByCategory);


router.get('/by-location', getDistributorsByDistrict);

router.post('/product',upload.single('image'),AddProduct);
router.get('/product',GetProducts);
router.delete('/product/:productId',deleteProduct);
router.put('/product/:productId', upload.single('image'),updateProduct)
router.get('/products-by-distributor/:distributorId', GetProductsByDistributor);

router.get('/:id',getDistributorById)
router.put('/:id',updateDistributor)


module.exports=router;