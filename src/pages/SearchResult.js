import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductsByKeyword } from "../functions/product";
import { Pagination } from "antd";
import ProductCard from "../components/cards/ProductCard";
import { getProducts, getProductsCount } from "../functions/product";

/**
 * Fully Paginationed comp
 * 
 * Note in order to have pagination dynamically switch between different data set
 * one needs to consider the following 3 properties binding to the Pagination rule
 *  1. page
    2. productsCount
    3. products
 * 
 */
const SearchResult = () => {
  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [productsCount, setProductsCount] = useState(0);

  const NUM_ITEMS_PER_PAGE = 9; // 9

  useEffect(() => {
    let delayed;
    if (text) {
      delayed = setTimeout(() => {
        // fetch/refresh data here
        // fetchProductsByKeyword(reqBody)
        setPage(1);

        fetchProducts({
          text: text,
          sort: "sold",
          order: "desc",
          page: 1,
          perPage: NUM_ITEMS_PER_PAGE,
        });
      }, 600); // delay by x ms
    } else {
      // text is empty string
      // fetch all products to display
      setPage(1);
      getProductsCount().then((res) => setProductsCount(res.data));
      getProducts("sold", "desc", 1, NUM_ITEMS_PER_PAGE).then((res) => {
        setProducts(res.data);
      });
    }
    return () => clearTimeout(delayed);
  }, [text]);

  useEffect(() => {
    if (text) {
      fetchProducts({
        text: text,
        sort: "sold",
        order: "desc",
        page: page,
        perPage: NUM_ITEMS_PER_PAGE,
      });
    } else {
      // text as empty string
      // all products displayed
      // page change effect
      getProducts("sold", "desc", page, NUM_ITEMS_PER_PAGE).then((res) => {
        setProducts(res.data);
      });
    }
  }, [page]);

  const fetchProducts = (body) => {
    fetchProductsByKeyword(body).then((res) => {
      setProducts(res.data.products);
      setProductsCount(res.data.totalCount);
    });
  };

  return (
    <div className="container-fluid">
      {text ? (
        <h5 className="text-center p-3 mt-5 mb-5 display-4">{`"${text}"`}</h5>
      ) : (
        <h5 className="text-center p-3 mt-5 mb-5 display-4">All</h5>
      )}

      {products.length < 1 && (
        <p className="text-center">Sorry, no product found</p>
      )}

      {text && products.length > 0 && (
        <h5 className="pl-3 ml-5"> {productsCount} sweet(s) found</h5>
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

      <br />
    </div>
  );
};

export default SearchResult;
