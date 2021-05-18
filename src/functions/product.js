import axios from "axios";

export const createProduct = async (product, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/product`, product, {
    headers: {
      authtoken,
    },
  });

export const getProductsByCount = async (count) =>
  await axios.get(`${process.env.REACT_APP_API}/products/${count}`);

/**
 * 
   Removal API in backend has implemente CASCADE on delete to remove
    all options under requested Product
 */
export const removeProduct = async (_id, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/product/${_id}`, {
    headers: {
      authtoken,
    },
  });

export const getProduct = async (_id) =>
  await axios.get(`${process.env.REACT_APP_API}/product/${_id}`);

export const updateProduct = async (_id, product, authtoken) =>
  await axios.put(`${process.env.REACT_APP_API}/product/${_id}`, product, {
    headers: {
      authtoken,
    },
  });

export const getProducts = async (sort, order, page, nPerPage) =>
  await axios.post(`${process.env.REACT_APP_API}/products`, {
    sort,
    order,
    page,
    perPage: nPerPage,
  });

export const getProductsCount = async () =>
  await axios.get(`${process.env.REACT_APP_API}/products/total`);

export const getRelated = async (productId, limit) =>
  await axios.get(
    `${process.env.REACT_APP_API}/product/related/${productId}/${limit}`
  );

export const getProductsByCategorySlug = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/products/by-category/${slug}`);

export const getProductsBySubSlug = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/products/by-sub/${slug}`);

export const fetchProductsByKeyword = async (reqBody) =>
  await axios.post(`${process.env.REACT_APP_API}/products/search`, reqBody);

/**
 *
 * @param {*} reqBody { categories, sort, order, page, perPage }
 *  where categories is an array of Category ids
 *
 */
export const fetchProductsByCategories = async (reqBody) =>
  await axios.post(
    `${process.env.REACT_APP_API}/products/by-categories`,
    reqBody
  );
