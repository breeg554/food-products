import Category from "../models/category.js";
import ApiError from "../utils/ApiError.js";

export const create = (req, res, next) => {
  const newCategory = new Category(req.body);

  newCategory.save((err, cat) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(201).json(cat);
  });
};
export const get = (req, res, next) => {
  Category.find((err, categories) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(200).json(categories);
  });
};
