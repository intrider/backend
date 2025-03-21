const mongoose=require('mongoose');

const categorySchema=new mongoose.Schema({
    name:{ type: String , required:true} ,
    image:{type:String, required:true},
    distributor: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor', required: true }
}, { timestamps: true });

const Category =mongoose.model('Category',categorySchema);

module.exports=Category;