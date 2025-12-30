const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const Review = require('../models/review');
const Listing = require('../models/listing');
const { merge } = require('./listing');
const { isLoggedin, validateReview, isReviewAuthor } = require('../middleware');
const reviewsController = require('../controllers/review');



// Reviews Routes
router.post('/',
    isLoggedin, 
    validateReview, 
    wrapAsync(reviewsController.createReview));

// Delete Review Route
router.delete('/:reviewId', 
    isLoggedin,
    isReviewAuthor,
    wrapAsync(reviewsController.destroyReview));

module.exports = router;