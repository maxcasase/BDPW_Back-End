// /models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,          // <- CAMBIA A Number
      required: true,
    },
    album_id: {
      type: Number,          // número de álbum de Postgres
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    title: String,
    content: String,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('Review', reviewSchema);
