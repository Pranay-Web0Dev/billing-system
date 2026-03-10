import mongoose from 'mongoose'

const ConnectDB = async() =>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/BillingDB").then(()=>{
            console.log("COnnected To The Database SuccessFully")
        })
    } catch (error) {
        console.log(error)
    }
}

export default ConnectDB;