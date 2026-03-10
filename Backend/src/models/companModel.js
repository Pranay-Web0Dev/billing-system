import mongoose from 'mongoose'

const CompanySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    logo: {
        type: String
    }
})

const companyModel = mongoose.model("company", CompanySchema)
export default companyModel;
