import React, { useState, useEffect } from "react";
import { fetchProductsByCategories } from "../functions/product"; // tbu
import ProductCard from "../components/cards/ProductCard";
import { getProducts, getProductsCount } from "../functions/product"; // get all products

import { getCategories } from "../functions/category";
import { Pagination } from "antd";

const Shop = () => {
  const [categories, setCategories] = useState([]); // all available categories
  const [categoryIds, setCategoryIds] = useState([]); // checkbox data

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [productsCount, setProductsCount] = useState(0);

  const NUM_ITEMS_PER_PAGE = 9; // 9

  // comp did mount
  useEffect(() => {
    // fetch all categories first
    getCategories().then((res) => setCategories(res.data));
    setCategoryIds([]); // uncheck all category checkbox
  }, []);

  useEffect(() => {
    console.log("Detected category checkbox change");
    if (categoryIds.length < 1) {
      // fetch all products
      setPage(1);
      getProductsCount().then((res) => setProductsCount(res.data));
      getProducts("sold", "desc", 1, NUM_ITEMS_PER_PAGE).then((res) => {
        setProducts(res.data);
      });
    } else {
      // fetch products based on categoryIds
      setPage(1);
      fetchProductsBasedOnCategories({
        categories: categoryIds,
        sort: "sold",
        order: "desc",
        page: 1,
        perPage: NUM_ITEMS_PER_PAGE,
      });
    }
  }, [categoryIds]);

  const fetchProductsBasedOnCategories = (body) => {
    fetchProductsByCategories(body).then((res) => {
      setProducts(res.data.products);
      setProductsCount(res.data.totalCount);
    });
  };

  useEffect(() => {
    if (categoryIds.length < 1) {
      // fetch new page of the all products
      getProducts("sold", "desc", page, NUM_ITEMS_PER_PAGE).then((res) => {
        setProducts(res.data);
      });
    } else {
      // fetch new page of the selected category checkbox options
      fetchProductsBasedOnCategories({
        categories: categoryIds,
        sort: "sold",
        order: "desc",
        page: page,
        perPage: NUM_ITEMS_PER_PAGE,
      });
    }
  }, [page]);

  // handleCheck
  const handleCategoriesCheckboxChange = (e) => {
    // dispatch({
    //     type: "SEARCH_QUERY",
    //     payload: { text: "" },
    //   });
    const categoryIdsCopy = [...categoryIds]; //inTheState

    const index = categoryIdsCopy.indexOf(e.target.value);
    if (index === -1) {
      // not found, push it
      categoryIdsCopy.push(e.target.value);
    } else {
      // found, remove it
      categoryIdsCopy.splice(index, 1);
    }
    setCategoryIds(categoryIdsCopy);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 mt-4 pl-4">
          <div className="h6 mb-4"> Categories </div>
          {categories.length > 0 &&
            categories.map((c) => (
              <div className="pb-2" key={c._id}>
                <input
                  id={c._id}
                  className="mr-2"
                  type="checkbox"
                  value={c._id}
                  onChange={handleCategoriesCheckboxChange}
                  // checked={categoryIds.includes(c._id)}
                />
                <label htmlFor={c._id}>{c.name}</label>
              </div>
            ))}
        </div>

        <div className="col-md-9">
          {products.length < 1 && (
            <p className="text-center pt-4">Sorry, no product found</p>
          )}

          <div className="row pb-5">
            {products.map((p) => (
              <div key={p._id} className="col-md-4 mt-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          <div className="row">
            <nav className="col-md-4 offset-md-4 text-center p-2">
              <Pagination
                current={page}
                total={(productsCount / NUM_ITEMS_PER_PAGE) * 10}
                onChange={(value) => setPage(value)}
              />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
