import Product from "../models/product.js";
import ApiError from "../utils/ApiError.js";

export const create = (req, res, next) => {
  const newProduct = new Product(req.body);

  newProduct.save((err, product) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(201).json(product);
  });
};
