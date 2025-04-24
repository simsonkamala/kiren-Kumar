const mongoose = require("mongoose")

const goodsSchema = new mongoose.Schema({
    description: { type: String, required: false },
    hsn: { type: String, required: false },
    quantity: { type: String, required: false },
    units: { type: String, required: false },
    rate: { type: String, required: false },
    amount: { type: String, required: false },
}, {_id : false})

const forms = new  mongoose.Schema({
    addcgst: { type: String, required: false },
    addcgstinpersentage: { type: String, required: false },
    addsgst: { type: String, required: false },
    addsgstinpersentage: { type: String, required: false },
    amountwords: { type: String, required: false },
    billadress: { type: String, required: false },
    billgstin: { type: String, required: false },
    companyname: { type: String, required: false },
    dateno: { type: String, required: false },
    gstin: { type: String, required: false },
    invoiceno: { type: String, required: false },
    placesupply: { type: String, required: false },
    roundoff: { type: String, required: false },
    supplyadddress: { type: String, required: false },
    supplygstin: { type: String, required: false },
    taxablevalue: { type: String, required: false },
    total: { type: String, required: false },
    finelamount: { type: String, required : false},
    goods: [goodsSchema]
})

module.exports = mongoose.model("forms", forms)