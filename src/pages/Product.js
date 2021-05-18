import React, { useEffect, useState } from "react";
import { getProduct } from "../functions/product";
import SingleProduct from "../components/cards/SingleProduct";
import { getRelated } from "../functions/product";
import ProductCard from "../components/cards/ProductCard";

const Product = ({ match }) => {
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);

  const { _id } = match.params;

  const RELATED_PRODUCT_LIMIT = 3;

  useEffect(() => {
    loadSingleProduct();
  }, [_id]);

  const loadSingleProduct = () => {
    getProduct(_id).then((res) => {
      setProduct(res.data);
      if (res.data.category) {
        // the product has a category, fill the related
        // load related
        getRelated(res.data._id, RELATED_PRODUCT_LIMIT).then((res) =>
          setRelated(res.data)
        );
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct product={product} />
      </div>

      {related.length > 0 && (
        <>
          <div className="row">
            <div className="col text-center pt-5 pb-5">
              <hr />
              <h4> You Might Also Like </h4>
              <hr />
            </div>
          </div>

          <div className="row pb-5">
            {related.map((r) => (
              <div key={r._id} className="col-md-4">
                <ProductCard product={r} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
