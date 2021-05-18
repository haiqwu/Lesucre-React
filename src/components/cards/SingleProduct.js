import React, { useState, useEffect } from "react";
import { Card, Tabs } from "antd";
import { Link } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./SingleProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

// import StarRating from "react-star-ratings";

const { TabPane } = Tabs;

const SingleProduct = ({ product }) => {
  const {
    title,
    _id,
    description,
    options,
    category,
    subs,
    sold,
    images,
    defaultImg,
  } = product;
  const dispatch = useDispatch();
  const [selectedOpt, setSelectedOpt] = useState("");

  useEffect(() => {
    if (options) {
      const defaultOption = options.find((o) => {
        return o.default_opt === true;
      });
      setSelectedOpt(defaultOption._id);
    }
  }, [product]);

  const handleAddToCart = (e, maxQty) => {
    e.preventDefault();

    let cart = [];
    if (typeof window !== "undefined") {
      // if cart is in local storage, GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      const found = cart.find((i) => {
        return i.selectedOptId === selectedOpt;
      });
      if (!found) {
        if (maxQty > 0) {
          cart.push({
            ...product,
            selectedOptId: selectedOpt,
            count: 1,
          });
        } else {
          toast.error("Sorry, this item is out of stock");
        }
      } else {
        if (+found.count + 1 <= +maxQty) {
          console.log("updating +1");
          found.count = +found.count + 1;
        }
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      // update redux store
      dispatch({
        type: "UPDATE_CART",
        payload: cart,
      });
      // show cart items in side drawer
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };

  return (
    <>
      <div className="col-md-6">
        {images && images.length ? (
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images &&
              images.map((i) => <img alt="" src={i.url} key={i.public_id} />)}
          </Carousel>
        ) : (
          <Card
            cover={
              <img
                alt=""
                src={defaultImg && defaultImg.url}
                className="mb-3 card-image"
              />
            }
          ></Card>
        )}

        <Tabs type="card">
          <TabPane tab="Le Sucre" key="1">
            {description && (
              <p
                style={{
                  fontFamily: "Times, Times New Roman, serif",
                  fontSize: "18px",
                }}
              >
                {description}
              </p>
            )}
          </TabPane>
          {/* <TabPane tab="More" key="2">
            Call use on xxxx xxx xxx to learn more about this product.
          </TabPane> */}
        </Tabs>
      </div>

      <div className="col-md-6">
        <p
          className="p-3 text-center"
          style={{
            fontSize: "35px",
            color: "#4f4f4f",
            fontFamily: "Monaco",
          }}
        >
          {title}
        </p>
        <Card
          actions={
            [
              // <>
              //   <ShoppingCartOutlined className="text-success" /> <br />
              //   <b> Add to Cart </b>
              // </>,
              // <Link to="/">
              //   <HeartOutlined className="text-info" /> <br /> Add to Wishlist
              // </Link>,
            ]
          }
        >
          {/* ProductListItems */}

          <ul className="list-group">
            {category && (
              <li className="list-group-item">
                Category
                <Link
                  to={`/category/${category.slug}`}
                  className="label label-default label-pill pull-xs-right"
                >
                  {category.name}
                </Link>
              </li>
            )}

            {subs && subs.length > 0 && (
              <li className="list-group-item">
                Sub Categories
                {subs.map((s) => (
                  <Link
                    key={s._id}
                    to={`/sub/${s.slug}`}
                    className="label label-default label-pill pull-xs-right"
                  >
                    {s.name}
                  </Link>
                ))}
              </li>
            )}

            <li className="list-group-item">
              Sold
              <span className="label label-default label-pill pull-xs-right">
                {sold}
              </span>
            </li>
          </ul>

          {/* /ProductListItems */}
        </Card>
         
        <div className="d-flex flex-wrap">
          {options &&
            options.map((opt) => (
              <label className="mt-3" key={opt._id}>
                <input
                  type="radio"
                  name="opts"
                  className="card-input-element d-none"
                  value={opt._id}
                  defaultChecked={opt.default_opt}
                  onChange={(e) => {
                    setSelectedOpt(e.target.value);
                  }}
                  disabled={opt.quantity < 1}
                />

                <div
                  className="ml-3 card card-body d-flex flex-row justify-content-between align-items-center"
                  style={
                    opt.quantity < 1
                      ? { backgroundColor: "#b8b8b8" } // out of stock
                      : {}
                  }
                >
                  <span className="">{opt.opt_name}</span>

                  <span className="">$ {opt.price}</span>

                  <span className="text-danger">
                    {opt.quantity < 10 && opt.quantity > 0
                      ? "Only Few Left"
                      : ""}
                  </span>

                  <span
                    style={{
                      color: "#e66565",
                    }}
                  >
                    {opt.quantity < 1 ? "SOLD OUT" : ""}
                  </span>
                </div>
              </label>
            ))}
        </div>
        <button
          className="mt-5 btn btn-outline-success w-100"
          onClick={(e) => {
            console.log("selected opt", selectedOpt);
            const opt = options.find((o) => o._id === selectedOpt);
            console.log("opt found", opt);
            const maxQty = opt.quantity;
            console.log("passing in max qty, ", maxQty);

            if (opt.quantity > 0) {
              handleAddToCart(e, maxQty);
            }
          }}
        >
          <ShoppingCartOutlined /> Add to cart
        </button>
      </div>
    </>
  );
};

export default SingleProduct;
