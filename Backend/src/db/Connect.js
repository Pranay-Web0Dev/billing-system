import mongoose from 'mongoose'

const ConnectDB = async() =>{
    try {
        await mongoose.connect("mongodb+srv://TradeX:cOUYxgkJmgflEkp9@tradexcluster.j5vbglc.mongodb.net/billingdb?appName=TradeXCluster").then(()=>{
            console.log("COnnected To The Database SuccessFully")
        })
    } catch (error) {
        console.log(error)
    }
}

export default ConnectDB;
