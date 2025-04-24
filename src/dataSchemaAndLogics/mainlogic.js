const express = require('express');
const router = express.Router();

module.exports = router

const forms = require("./mainSchema")

// ---------- for Storing the Data/ Inserting Data------------
router.post("/insertdata", async (req, res) => {

    try{
        const inserterData = new forms({
            addcgst: req.body.addcgst,
            addcgstinpersentage: req.body.addcgstinpersentage,
            addsgst: req.body.addsgst,
            addsgstinpersentage: req.body.addsgstinpersentage,
            amountwords: req.body.amountwords,
            billadress: req.body.billadress,
            billgstin: req.body.billgstin,
            companyname: req.body.companyname,
            dateno: req.body.dateno,
            gstin: req.body.gstin,
            invoiceno: req.body.invoiceno,
            placesupply: req.body.placesupply,
            roundoff: req.body.roundoff,
            supplyadddress: req.body.supplyadddress,
            supplygstin: req.body.supplygstin,
            taxablevalue: req.body.taxablevalue,
            total: req.body.total,
            finelamount: req.body.finelamount,
            goods: req.body.goods // ✅ Pass the goods array directly
        });

        const savedata = await inserterData.save();
        res.status(201).json({ message: "Data is saved ✅", savedata });

    }catch(error){
        console.log("Insert Error", error)
        res.status(500).json({'message' : 'Server Error ❌', error})
    }
})

// ------- Data is Displaying --------------
router.get("/displaying", async (req, res) => {
    let displayData = await forms.find();
    res.status(201).json(displayData)
})

// ----------- Data of The Perticular Form -----------
router.get("/open/:id", async(req, res) => {
    let id = req.params.id 
    let data = await forms.findById(id)
    res.status(200).json(data)
})

// -------- Edit data ------------------
router.get("/geteditdata/:formeditid",async (req, res) => {
    let dataID = req.params.formeditid
    let datas = await forms.findById(dataID)
    res.status(200).json(datas)
})

// -------- Edit data in DB ------------
router.put("/update", async( req, res ) => {
    try{

        let {formeditids} = req.body
        let data = await forms.findById(formeditids)
        
        if (!data) {
            return res.status(404).json({ message: "Form not found" });
        }

        // Update all fields
        data.addcgst = req.body.GoodsDatas.addcgst;
        data.addcgstinpersentage = req.body.GoodsDatas.addcgstinpersentage;
        data.addsgst = req.body.GoodsDatas.addsgst;
        data.addsgstinpersentage = req.body.GoodsDatas.addsgstinpersentage;
        data.amountwords = req.body.GoodsDatas.amountwords;
        data.billadress = req.body.GoodsDatas.billadress;
        data.billgstin = req.body.GoodsDatas.billgstin;
        data.companyname = req.body.GoodsDatas.companyname;
        data.dateno = req.body.GoodsDatas.dateno;
        data.gstin = req.body.GoodsDatas.gstin;
        data.invoiceno = req.body.GoodsDatas.invoiceno;
        data.placesupply = req.body.GoodsDatas.placesupply;
        data.roundoff = req.body.GoodsDatas.roundoff;
        data.supplyadddress = req.body.GoodsDatas.supplyadddress;
        data.supplygstin = req.body.GoodsDatas.supplygstin;
        data.taxablevalue = req.body.GoodsDatas.taxablevalue;
        data.total = req.body.GoodsDatas.total;
        data.finelamount = req.body.GoodsDatas.finelamount;
        // Replace goods array with new one
        data.goods = req.body.GoodsDatas.goods;

        const saveupdate = await data.save()
        res.status(201).json({'message' : "Data Updated Successfully.....👨‍💻"})

    }catch(error){
        console.log("The Update error", error)
        res.status(500).json({'message' : 'Internal Server Error'})
    }
})

// ----------- Delete Data -------------

router.delete("/deleteData", async (req, res) => {
    try{
        let {id} = req.body
        let datatodelete = await forms.findByIdAndDelete(id)
        res.status(201).json({'message' : 'Data is Deleted'})
    }catch(error){
        console.error(" Data Is Not Deleted ", error)
    }
})