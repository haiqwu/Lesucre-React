import React from "react";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Meta } = Card;

const AdminProductCard = ({ product, handleRemove }) => {
  const { title, description, images, defaultImg, _id } = product;
  const SHORTEN_STR_LEN = 40;

  const shorten = (d, l) => {
    if (d && d.length > l) {
      return d.substring(0, l) + "...";
    }
    return d;
  };

  return (
    <Card
      cover={
        <img
          alt=""
          src={defaultImg && defaultImg.url}
          style={{ height: "150px", objectFit: "cover" }}
          className="p-1"
        />
      }
      actions={[
        <Link to={`/admin/product/${_id}`}>
          <EditOutlined className="text-warning" />
        </Link>,
        <DeleteOutlined
          className="text-danger"
          onClick={() => handleRemove(_id)}
        />,
      ]}
    >
      <Meta title={title} description={shorten(description, SHORTEN_STR_LEN)} />
    </Card>
  );
};

export default AdminProductCard;
