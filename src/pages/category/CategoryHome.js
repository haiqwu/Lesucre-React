import React, { useState, useEffect } from "react";
import { getCategory } from "../../functions/category";
import { getProductsByCategorySlug } from "../../functions/product";
import ProductCard from "../../components/cards/ProductCard";
import { Link } from "react-router-dom";

const CategoryHome = ({ match }) => {
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = match.params;

  useEffect(() => {
    setLoading(true);
    getCategory(slug).then((c) => {
      // console.log(JSON.stringify(c.data, null, 4));
      setCategory(c.data);
    });
    fetchProductsData();
  }, [slug]);

  const fetchProductsData = async () => {
    const resProducts = await getProductsByCategorySlug(slug);
    console.log(resProducts.data);
    setProducts(resProducts.data);
    setLoading(false);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          {loading ? (
            <h4 className="text-center p-3 mt-5 mb-5 display-4">Loading...</h4>
          ) : (
            <h4 className="text-center p-3 mt-5 mb-5 display-4">
              "{category.name}"
            </h4>
          )}
        </div>
      </div>

      <div className="row">
        {products.length > 0 &&
          products.map((p) => (
            <div className="col col-md-4" key={p._id}>
              <ProductCard product={p} />
            </div>
          ))}
      </div>
      {products.length < 1 && (
        <div>
          <h5 className="text-center">
            Nothing found yet...{" "}
            <Link to="/shop" className="pl-3">
              <u> shop others ... </u>
            </Link>
          </h5>
        </div>
      )}
    </div>
  );
};

export default CategoryHome;
