const Category = require('../Model/Category');
const Product = require('../Model/Product');
const Order = require('../Model/Order');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Distributor = require('../Model/Distributor');

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the destination directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Specify the file name
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const distributorSignupController = async (req, res) => {
    console.log("Received distributor signup data:", req.body);

    const { name, email, password, phone, AadharNo, companyName, companyLocation, DistributionArea, state, district } = req.body;

    if (!name || !email || !password || !phone || !AadharNo || !companyName || !companyLocation || !DistributionArea || !state || !district) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingDistributor = await Distributor.findOne({ email });
        if (existingDistributor) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newDistributor = new Distributor({
            name,
            email,
            password: hashedPassword,
            phone,
            AadharNo,
            companyName,
            companyLocation,
            DistributionArea,
            state,
            district,
            role: 'distributor',
        });

        await newDistributor.save();
        res.status(201).json({ message: 'Distributor created successfully', distributorId: newDistributor._id, role: 'distributor' });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Signup failed', error: error.message });
    }
};

const distributorLoginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const distributor = await Distributor.findOne({ email });
    if (!distributor) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, distributor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: distributor._id, role: 'distributor' }, process.env.JWT_KEY, { expiresIn: '1h' });
    res.status(200).json({ token, distributorId: distributor._id, role: 'distributor' });
  } catch (error) {
    console.log('Error logging in:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

const getDistributorById = async (req, res) => {
  try {
    const distributor = await Distributor.findById(req.params.id);
    if (!distributor) {
      return res.status(404).json({ message: 'Distributor not found' });
    }
    res.json(distributor);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!distributor) {
      return res.status(404).json({ message: 'Distributor not found' });
    }
    res.json({ message: 'Profile updated successfully', distributor });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// const getDistributorsByDistrict = async (req, res) => {
//   try {
//     const { district } = req.query;

//     if (!district) {
//       return res.status(400).json({ message: 'District is required' });
//     }

//     console.log(`Fetching distributors for district: ${district}`);

//     const distributors = await Distributor.find({ district: { $regex: new RegExp(`^${district.trim()}$`, "i") } });

//     if (!distributors || distributors.length === 0) {
//       console.warn(`No distributors found for district: ${district}`);
//       return res.status(404).json({ message: 'No distributors found' });
//     }

//     console.log(`Distributors found:`, distributors);
//     res.json(distributors);
//   } catch (error) {
//     console.error('Error fetching distributors:', error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };
const getDistributorsByDistrict = async (req, res) => {
  try {
    const { district } = req.query;

    if (!district) {
      console.error("❌ No district provided in request.");
      return res.status(400).json({ message: "District is required" });
    }

    console.log(`🔍 Fetching distributors for district: ${district}`);

    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB is not connected.");
      return res.status(500).json({ message: "Database connection error" });
    }

    const distributors = await Distributor.find({
      district: { $regex: new RegExp(`^${district.trim()}$`, "i") }
    });

    if (!distributors || distributors.length === 0) {
      console.warn(`⚠️ No distributors found for district: ${district}`);
      return res.status(404).json({ message: "No distributors found" });
    }

    console.log(`✅ Distributors found:`, distributors);
    res.json(distributors);
  } catch (error) {
    console.error("❌ Error fetching distributors:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



const GetCategory = async (req, res) => {
  try {
    const distributorId = req.query.distributorId;
    if (!distributorId) {
      return res.status(400).json({ message: 'Distributor ID is required' });
    }

    const categories = await Category.find({ distributor: distributorId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const AddCategory = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    const { name, distributorId } = req.body;

    if (!name || !distributorId || !req.file) {
      return res.status(400).json({ message: "All fields (name, image, distributorId) are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(distributorId)) {
      return res.status(400).json({ message: "Invalid distributor ID format" });
    }

    try {
      const category = new Category({
        name,
        image: req.file.path,
        distributor: distributorId 
      });

      const newCategory = await category.save();
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error adding category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};


const GetProducts = async (req, res) => {
  try {
    const distributorId = req.query.distributorId;
    if (!distributorId) {
      return res.status(400).json({ message: 'Distributor ID is required' });
    }
    const products = await Product.find({distributor:distributorId}).populate('category');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error  fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const productsWithCategory = await Product.find({ category: categoryId });

    if (productsWithCategory.length > 0) {
      await Product.updateMany({ category: categoryId }, { $unset: { category: "" } });
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const AddProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const { name, category, price, distributorId } = req.body;
    
    if (!name || !category || !price || !distributorId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const categoryObjectId = new mongoose.Types.ObjectId(req.body.category);

    const product = new Product({
      name,
      category: categoryObjectId,
      price,
      image: req.file.path,
      distributor: distributorId
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { name, category, price } = req.body;
    const productId = req.params.productId;
    
    let updatedFields = { name, category, price };

    if (req.file) {
      updatedFields.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedFields,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const deleteProduct = async (req,res)=>{
  const { productId } = req.params;

  try {
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const GetCategorywithProducts = async (req, res) => {
  try {
    const { distributorId } = req.query;

    if (!distributorId) {
      return res.status(400).json({ message: "Distributor ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(distributorId)) {
      return res.status(400).json({ message: "Invalid distributor ID format" });
    }

    console.log(`🔍 Fetching categories and products for distributor: ${distributorId}`);

    const categories = await Category.find({ distributor: distributorId }).select("name image");

    const products = await Product.find({ distributor: distributorId }).populate("category");

    if (!categories.length && !products.length) {
      return res.status(404).json({ message: "No categories or products found for this distributor" });
    }

    console.log(`✅ Categories: ${categories.length}, Products: ${products.length}`);
    res.json({ categories, products });
  } catch (error) {
    console.error("❌ Error fetching categories and products:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



const GetProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID format" });
    }

    const products = await Product.find({ category: categoryId });

    if (!products.length) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const GetProductsByDistributor = async(req,res)=>{
  try {
        const { distributorId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(distributorId)) {
            return res.status(400).json({ message: "Invalid distributor ID format" });
        }
        const products = await Product.find({ distributor: distributorId });
        res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products by distributor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const placeOrder = async (req, res) => {
  try {
    const { userId, distributorId, products, totalAmount, paymentMethod } = req.body;

    if (!userId || !distributorId || !products || !totalAmount || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newOrder = new Order({
      userId,
      distributorId,
      products,
      totalAmount,
      paymentMethod,
      status: "Pending",
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getDistributorOrders = async (req, res) => {
  try {
    const { distributorId } = req.params;
    const orders = await Order.find({ distributorId }).populate("userId").populate("products.productId");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: "Completed" }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order marked as completed", updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { AddCategory, AddProduct,deleteProduct,updateProduct, GetProducts,GetProductsByCategory, GetProductsByDistributor,getDistributorsByDistrict,GetCategory,GetCategorywithProducts,deleteCategory, distributorSignupController, distributorLoginController,getDistributorById,updateDistributor,placeOrder,getDistributorOrders,updateOrderStatus };