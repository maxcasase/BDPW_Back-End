const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    let { album_id, rating, title, content } = req.body;
    let user_id = req.user.id; // viene del token, es 1,2,3...

    // Normalizar a número
    if (typeof user_id === 'string') user_id = parseInt(user_id, 10);
    if (typeof album_id === 'string') album_id = parseInt(album_id, 10);

    if (!user_id || Number.isNaN(user_id)) {
      return res.status(400).json({ success: false, message: 'user_id inválido' });
    }
    if (!album_id || Number.isNaN(album_id)) {
      return res.status(400).json({ success: false, message: 'album_id inválido' });
    }

    // Evitar reseña duplicada del mismo usuario para el mismo álbum
    const existingReview = await Review.findOne({ user_id, album_id });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Ya has reseñado este álbum',
      });
    }

    const review = new Review({ user_id, album_id, rating, title, content });
    await review.save();

    res.status(201).json({
      success: true,
      review: review.toObject(),
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, album_id } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const filter = {};

    if (album_id) {
      const albumIdNum = parseInt(album_id, 10);
      if (Number.isNaN(albumIdNum)) {
        return res.status(400).json({
          success: false,
          message: 'album_id inválido',
        });
      }
      filter.album_id = albumIdNum;
    }

    const reviews = await Review.find(filter)
      .sort({ created_at: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .exec();

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    let user_id = req.user.id;

    if (typeof user_id === 'string') user_id = parseInt(user_id, 10);

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const reviews = await Review.find({ user_id })
      .sort({ created_at: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .exec();

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error('Error getting user reviews:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    let user_id = req.user.id;

    if (typeof user_id === 'string') user_id = parseInt(user_id, 10);

    const review = await Review.findOne({ _id: reviewId, user_id });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review no encontrada o no tienes permisos',
      });
    }

    await Review.deleteOne({ _id: reviewId });
    res.status(200).json({
      success: true,
      message: 'Review eliminada correctamente',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};