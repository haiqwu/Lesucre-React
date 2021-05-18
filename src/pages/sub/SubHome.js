import React, { useState, useEffect } from "react";
import { getSub } from "../../functions/sub";
import { getProductsBySubSlug } from "../../functions/product";
import ProductCard from "../../components/cards/ProductCard";

const SubHome = ({ match }) => {
  const [sub, setSub] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = match.params;

  // comp did mount
  useEffect(() => {
    setLoading(true);

    getSub(slug).then((s) => {
      //   console.log(JSON.stringify(c.data, null, 4));
      setSub(s.data);
    });
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    const resProducts = await getProductsBySubSlug(slug);
    // console.log(resProducts.data);
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
              "{sub.name}"
            </h4>
          )}
        </div>
      </div>

      <div className="row">
        {products.map((p) => (
          <div className="col col-md-4" key={p._id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubHome;
