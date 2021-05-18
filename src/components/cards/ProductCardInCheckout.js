import React, { useState } from "react";
import ModalImage from "react-modal-image";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const ProductCardInCheckout = ({ p }) => {
  const dispatch = useDispatch();

  const [selectedOptId, setSelectedOptId] = useState(p.selectedOptId);

  const getOptFromSelected = () => {
    const opt = p.options.find((o) => o._id === selectedOptId);
    return opt;
  };

  const userErrorHandler = (error) => {
    if (error === "CLIENT_LOCAL_STORAGE_LOST") {
      let cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "UPDATE_CART",
        payload: cart,
      });
    }
  };

  //   const handleOptChange = (e) => {
  //     console.log("e target value   ", e.target.value);
  //     // console.log(" selectedOptId in state: ", selectedOptId);

  //     let cart = [];
  //     if (typeof window !== "undefined") {
  //       if (localStorage.getItem("cart")) {
  //         cart = JSON.parse(localStorage.getItem("cart"));
  //       }

  //       const product = cart.find((x) => x.selectedOptId === selectedOptId);
  //       if (!product) {
  //         userErrorHandler("CLIENT_LOCAL_STORAGE_LOST");
  //         return;
  //       }
  //       product.selectedOptId = e.target.value;

  //       setSelectedOptId(e.target.value);
  //       localStorage.setItem("cart", JSON.stringify(cart));
  //       dispatch({
  //         type: "UPDATE_CART",
  //         payload: cart,
  //       });
  //     }
  //   };

  const handleQuantityChange = (e) => {
    let count = e.target.value < 1 ? 1 : e.target.value;

    const indexDot = (count + "").indexOf(".");
    if (indexDot !== -1) {
      // dot found in the count, keep only before the dot
      count = count.substring(0, indexDot);
    }

    if (+count > getOptFromSelected().quantity) {
      // toast.error(`Max available quantity: ${getOptFromSelected().quantity}`);
      count = getOptFromSelected().quantity;
    }

    // end of validation
    let cart = [];

    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      const product = cart.find((x) => x.selectedOptId === selectedOptId);
      if (!product) {
        userErrorHandler("CLIENT_LOCAL_STORAGE_LOST");
        return;
      }

      product.count = count;

      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "UPDATE_CART",
        payload: cart,
      });
    }
  };

  const handleRemove = () => {
    // use selectedOptId

    console.log(selectedOptId, " to remove");
    let cart = [];

    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      const index = cart.findIndex((p) => p.selectedOptId === selectedOptId);
      if (index === -1) {
        userErrorHandler("CLIENT_LOCAL_STORAGE_LOST");
        return;
      }
      cart.splice(index, 1);

      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "UPDATE_CART",
        payload: cart,
      });
    }
  };

  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: "100px", height: "auto" }}>
            <ModalImage small={p.defaultImg.url} large={p.defaultImg.url} />
          </div>
        </td>

        <td>
          <div className="pt-2">
            <Link to={`/product/${p._id}`}>
              <u>{p.title}</u>
            </Link>
          </div>
        </td>

        <td>
          {/* option   */}
          {/* <select  className="form-control">
            {p.options.map((o) => (
              <option
                key={o._id}
                value={o._id}
                selected={o._id === selectedOptId}
              >
                {o.opt_name}
              </option>
            ))}
          </select> */}
          {getOptFromSelected().opt_name}
        </td>
        <td>
          <input
            type="number"
            className="form-control"
            value={p.count}
            onChange={handleQuantityChange}
            onClick={(e) => {
              e.target.select();
            }}
            style={{
              width: "50%",
            }}
          />
        </td>
        <td>${getOptFromSelected().price} /each</td>

        <td className="text-center">
          {getOptFromSelected().quantity < 1 ? (
            <CloseCircleOutlined className="text-danger" />
          ) : (
            <CheckCircleOutlined className="text-success" />
          )}
        </td>

        <td className="">
          <DeleteOutlined
            onClick={handleRemove}
            className="text-danger pointer btn"
          />
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;
