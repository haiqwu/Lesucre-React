import React from "react";
import { Card } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  // destructure
  const { images, title, description, defaultImg, _id } = product;
  const history = useHistory();

  const getLowestOptionPrice = () => {
    const prices = product.options.map((o) => {
      return o.price;
    });
    const min = Math.min(...prices);
    return min;
  };

  const allOptionsOutOfStock = () => {
    let allOutOfStock = true;
    product.options.forEach((o) => {
      if (o.quantity > 0) {
        allOutOfStock = false;
      }
    });
    return allOutOfStock;
  };

  return (
    <Card
      onClick={() => {
        history.push(`/product/${_id}`);
      }}
      hoverable
      bordered={false}
      cover={
        <img
          alt=""
          src={defaultImg && defaultImg.url}
          style={{ height: "150px", objectFit: "cover" }}
          className=""
        />
      }
    >
      <Meta
        className="text-center"
        title={title}
        description={`from $${getLowestOptionPrice()}`}
      />
      {allOptionsOutOfStock() && (
        <>
          <div className="text-danger text-center pt-3">Out of Stock</div>
        </>
      )}
      <div className="mb-5"></div>
    </Card>
  );
};

export default ProductCard;
