const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
 };

 module.exports.renderNewForm = (req,res)=>{
    console.log("Render new form called");
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    console.log("Request ID:", req.params.id);
//   const listing = await Listing.findById(id).populate("reviews");}).
const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
if(!listing){
    req.flash("error","Listing you requested for does not exist!")
    res.redirect("/listings");
}
res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async(req,res)=>{
    let url = req.path.file;
    let filename= req.path.filename;
    const newListing=  new Listing(req.body.listing);
     newListing.owner = req.user._id;
     newListing.image= {url,filename};
        await newListing.save();
        req.flash("success","New Listing created!");
        res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
     const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you requested for dees not exist!");
        res.redirect("/listings");
     }

     let originalImageUrl = listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");
     res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
  let listing =   await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file!== "undefined"){
  let url = req.path.file;
  let filename= req.path.filename;
  listing.image = {url,filename};
  await listing.save();
  }
    req.flash("success","Listing Updated!");
    return  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("failure","Listing Deleted!");
   res.redirect("/listings");
}

