import Product from "../models/product.js";
import ApiError from "../utils/ApiError.js";

export const create = (req, res, next) => {
  const newProduct = new Product(req.body);
  console.log(req.body);
  newProduct.save((err, product) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(201).json(product);
  });
};
export const getAll = (req, res, next) => {
  Product.find()
    .populate("category")
    .exec((err, products) => {
      if (err) return next(new ApiError(err.message, 400));
      res.status(200).json(products);
    });
};
