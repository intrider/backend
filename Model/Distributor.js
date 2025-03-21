const mongoose = require('mongoose');

const distributorSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, unique:true, required:true},
    password:{type:String, required:true},
    phone:{type:String, required:true},
    AadharNo:{type:String, required:true, unique:true},
    companyName:{type:String, required:true},
    companyLocation:{type:String, required:true},
    DistributionArea:{type:String, required:true},
    state: { type: String, required: true },
    district: { type: String, required: true },
    role:{type:String,default:'distributor'},
})

module.exports =mongoose.model('Distributor',distributorSchema);