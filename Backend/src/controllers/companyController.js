import companyModel from "../models/companModel.js"
import cloudinary from '../helper/CloudinaryConfig.js'
import moment from 'moment'


export const addCompanyDetails = async (req, res) => {
    try {

        const upload = await cloudinary.uploader.upload(req.file.path);

        const { companyName, email, phone, Address, logo } = req.body

        const addDetails = new companyModel({
            companyName: companyName,
            email: email,
            Address: Address,
            phone: phone,
            logo: upload.secure_url
        })
        const result = await addDetails.save()
        res.status(200).json({ success: "true", message: "Company details added", result: result })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: "flase", message: "Error occrued:" })
    }
}


export const UpdateByid = async (req, res) => {
    try {
        const { id } = req.params;
        let updatedData = { ...req.body };

        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path);
            updatedData.logo = upload.secure_url;
        }

        const getDetails = await companyModel.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(getDetails);
    } catch (error) {
        console.error("Error updating company details:", error);
        res.status(500).json({ success: "false", message: "An error occurred while updating company details" });
    }
};


export const showDetails = async (req, res) => {
    try {
        const showAll = await companyModel.find()
        res.status(200).json(showAll)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: "flase", message: "Error occrued: " })
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const response = await companyModel.findById(req.params.id)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)

    }
}