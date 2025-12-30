const Listing = require('../models/listing');

module.exports.index = async(req, res) => {
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing =  async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
                    .populate({path : 'reviews',
                        populate: {
                            path : 'author'
                        }
                    })
                    .populate('owner');
    if(!listing) {
        req.flash("error", "Listing not found or doesn't exist!");
        return res.redirect('/listings');
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async(req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    console.log(newListing);
    res.redirect(`/listings`);
}

module.exports.renderEditForm = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id)
     if(!listing) {
        req.flash("error", "Listing not found or doesn't exist!");
        return res.redirect('/listings');
    }
    let origionalImageUrl = listing.image.url;
    origionalImageUrl = origionalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, origionalImageUrl});
}

module.exports.updateListing = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success", "Successfully updated a listing!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req, res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing!");
    console.log(deletedListing);
    res.redirect('/listings');
}

module.exports.renderDestinations = async (req, res) => {
  let findByCountry = req.query.q;

  // ✅ If search box empty
  if (!findByCountry || findByCountry.trim() === "") {
    req.flash("error", "Please enter a destination to search");
    return res.redirect("/listings");
  }

  // ✅ Safe regex
  let listing = await Listing.find({
    country: { $regex: new RegExp(findByCountry, "i") }
  });

  if (listing.length === 0) {
    req.flash("error", "No listings found for the specified destination!");
    return res.redirect("/listings");
  }

  res.render("listings/destination.ejs", {
    listing,
    findByCountry
  });
};


