import React, { useEffect, useState } from "react";
import { getProducts, getProductsCount } from "../../functions/product";
import ProductCard from "../../components/cards/ProductCard";
import LoadingCard from "../../components/cards/LoadingCard";
import { Pagination } from "antd";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [productsCount, setProductsCount] = useState(0);

  const NUM_ITEMS_PER_PAGE = 6;

  // const INITIAL_LOAD_AMOUNT = 6;

  useEffect(() => {
    loadAllProducts();
  }, [page]);

  useEffect(() => {
    getProductsCount().then((res) => setProductsCount(res.data));
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    // getProducts(sort, order, page, nPerPage)
    getProducts("createdAt", "desc", page, NUM_ITEMS_PER_PAGE).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  return (
    <>
      <div className="container">
        {loading ? (
          <LoadingCard count={NUM_ITEMS_PER_PAGE} />
        ) : (
          <div className="row ">
            {products.length &&
              products.map((product) => (
                <div key={product._id} className="col-md-4">
                  <ProductCard product={product} />
                </div>
              ))}
          </div>
        )}
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
    </>
  );
};

export default NewArrivals;
