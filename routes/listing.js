const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing');
const { isLoggedin, isOwner, validateListing } = require('../middleware');
const listingsController = require('../controllers/listings');
const multer  = require('multer')
const { storage } = require('../cloudconfig');
const upload = multer({ storage })


router
  .route('/')
  .get( wrapAsync(listingsController.index))
  .post( 
      isLoggedin,
      validateListing, 
      upload.single('listing[image]'),
      wrapAsync(listingsController.createListing)
    );

router.get("/destination" , wrapAsync(listingsController.renderDestinations));


// New Routes - to show form to create new listing
router.get('/new', isLoggedin, listingsController.renderNewForm);  

router
   .route('/:id')
   .get(
      wrapAsync(listingsController.showListing))
    .put(
    isLoggedin, 
    isOwner,
    validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingsController.updateListing))
    .delete( 
    isLoggedin, 
    isOwner,
    wrapAsync(listingsController.deleteListing));


// Edit Route - to show form to edit a listing
router.get('/:id/edit', 
    isLoggedin,  
    isOwner, 
    wrapAsync(listingsController.renderEditForm));

module.exports = router;