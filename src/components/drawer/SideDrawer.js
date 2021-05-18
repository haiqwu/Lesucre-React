import React, { useState, useEffect } from "react";
import { Drawer, Tooltip, Radio, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import numbro from "numbro";
import { getAllZones } from "../../functions/zone";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { drawer, cart } = useSelector((state) => ({ ...state }));
  const [zones, setZones] = useState([]);

  const [orderType, setOrderType] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [orderMethod, setOrderMethod] = useState("");

  const imageStyle = {
    width: "60px",
    height: "60px",
    objectFit: "cover",
  };

  const { Option } = Select;

  // comp did mount
  useEffect(() => {
    console.log("comp did mount in sideDrawer");
    // load all zones
    getAllZones().then((res) => {
      const zones = res.data;
      console.log("all zones loaded, ", zones);
      setZones(zones);
      loadFromLocalStorage();
    });
  }, []);

  useEffect(() => {
    if (drawer) {
      loadFromLocalStorage();
    }
  }, [drawer]);

  const loadFromLocalStorage = () => {
    // local storage:
    let orderInfo = null;
    if (localStorage.getItem("orderInfo")) {
      orderInfo = JSON.parse(localStorage.getItem("orderInfo"));
    }
    if (!orderInfo) {
      // no local storage orderInfo found
      setOrderType("pick-up");
    } else {
      setOrderMethod(orderInfo.orderMethod);
      setOrderType(orderInfo.orderType);
      setSelectedZone(orderInfo.selectedZone);
    }
  };

  const getZoneById = (id) => {
    const found = zones.find((z) => {
      return z._id === id;
    });
    if (!found) {
      return null;
    }
    return found;
  };

  const getOptByOptId = (product, selectedOptId) => {
    const opt = product.options.find((o) => o._id === selectedOptId);
    return opt;
  };

  const getSubtotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return (
        currentValue +
        nextValue.count *
          getOptByOptId(nextValue, nextValue.selectedOptId).price
      );
    }, 0);
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

  const handleRemove = (selectedOptId) => {
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

  const handleQuantityChange = (e, p) => {
    let count = e.target.value < 1 ? 1 : e.target.value;

    const indexDot = (count + "").indexOf(".");
    if (indexDot !== -1) {
      // dot found in the count, keep only before the dot
      count = count.substring(0, indexDot);
    }

    if (+count > getOptByOptId(p, p.selectedOptId).quantity) {
      // toast.error(`Max available quantity: ${getOptFromSelected().quantity}`);
      count = getOptByOptId(p, p.selectedOptId).quantity;
    }

    // end of validation
    let cart = [];

    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      const product = cart.find((x) => x.selectedOptId === p.selectedOptId);
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

  return (
    <Drawer
      className="text-center"
      title={`SHOPPING CART - ${cart.length} Product(s)`}
      placement="right"
      closable={false}
      onClose={() => {
        dispatch({
          type: "SET_VISIBLE",
          payload: false,
        });
      }}
      visible={drawer} //
      width={430}
    >
      <div className="">
        <Radio.Group
          className="container-fluid"
          options={[
            {
              label: "Pick Up in Flushing, NY",
              value: "pick-up",
            },
            { label: "Delivery", value: "delivery" },
          ]}
          onChange={(e) => {
            console.log(e.target.value);
            setOrderType(e.target.value);
            setSelectedZone("");
            setOrderMethod("");
            const orderInfo = {
              orderType: e.target.value,
              selectedZone: "",
              orderMethod: "",
            };
            localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
          }}
          value={orderType}
          optionType="button"
        />
        {orderType === "pick-up" && <div>Min total: $0</div>}
        {orderType === "delivery" && (
          <div className="pt-2">
            <Select
              value={selectedZone}
              style={{ width: 320 }}
              onChange={(v) => {
                setSelectedZone(v);
                if (v !== "") {
                  setOrderMethod("gb");
                }
                const orderInfo = {
                  selectedZone: v,
                  orderMethod: "",
                  orderType,
                };
                if (v !== "") {
                  orderInfo.orderMethod = "gb";
                }
                localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
              }}
            >
              <Option value="">Please select your zone</Option>
              {zones.map((z) => (
                <Option key={z._id} value={z._id}>
                  {`${z.zoneTitle} ${z.zoneCity} ${z.zoneState} ${z.zoneZipCode}`}
                </Option>
              ))}
            </Select>
          </div>
        )}
      </div>

      {orderType === "delivery" && selectedZone && (
        <>
          <div className="pt-2 pb-1">
            <input
              value="gb"
              type="radio"
              id="gb-order"
              name="deli-type"
              checked={orderMethod === "gb"}
              onChange={(e) => {
                setOrderMethod(e.target.value);
                const orderInfo = {
                  orderMethod: e.target.value,
                  orderType,
                  selectedZone,
                };
                localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
              }}
            />
            <label className="" htmlFor="gb-order">
              Group Buy Order (Min Total: $
              {getZoneById(selectedZone).groupBuy.gbMinOrderTotal})
            </label>
          </div>

          <div className="">
            <input
              value="sd"
              type="radio"
              id="sd-order"
              name="deli-type"
              checked={orderMethod === "sd"}
              onChange={(e) => {
                setOrderMethod(e.target.value);
                const orderInfo = {
                  orderMethod: e.target.value,
                  orderType,
                  selectedZone,
                };
                localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
              }}
            />
            <label className="" htmlFor="sd-order">
              Single Deliver(Deliver for you) (Min Total: $
              {getZoneById(selectedZone).singleDelivery.sdMinOrderTotal})
            </label>
          </div>
        </>
      )}

      <br />

      {orderMethod === "gb" &&
        selectedZone &&
        (+getSubtotal() >=
        +getZoneById(selectedZone).groupBuy.gbMinOrderTotal ? (
          <p style={{ color: "green" }}>
            <b> Min total reached, you are good to go </b>
          </p>
        ) : (
          <p className="text-danger">
            <b>
              {" "}
              Min total not reached, you'll need $
              {numbro(
                +getZoneById(selectedZone).groupBuy.gbMinOrderTotal -
                  getSubtotal()
              ).format({
                thousandSeparated: true,
                mantissa: 2,
              })}{" "}
              more{" "}
            </b>
          </p>
        ))}
      {orderMethod === "sd" &&
        selectedZone &&
        (+getSubtotal() >=
        +getZoneById(selectedZone).singleDelivery.sdMinOrderTotal ? (
          <p style={{ color: "green" }}>
            <b> Min total reached, you are good to go </b>
          </p>
        ) : (
          <p className="text-danger">
            <b>
              Min total not reached, you'll need $
              {numbro(
                +getZoneById(selectedZone).singleDelivery.sdMinOrderTotal -
                  getSubtotal()
              ).format({
                thousandSeparated: true,
                mantissa: 2,
              })}{" "}
              more{" "}
            </b>
          </p>
        ))}

      <br />

      {cart.map((p) => (
        <div key={p.selectedOptId}>
          <div className="row">
            <div className="col-sm-3">
              <img alt="" src={p.defaultImg.url} style={imageStyle} />
              {/* <p className="text-center bg-secondary text-light">{p.title}</p> */}
            </div>

            <div className="col">
              <div className="row pb-2">
                {p.title} - {getOptByOptId(p, p.selectedOptId).opt_name}
                <div className="">
                  <Tooltip title="Remove">
                    <CloseOutlined
                      onClick={() => {
                        handleRemove(p.selectedOptId);
                      }}
                      className="pl-4 pointer"
                    />
                  </Tooltip>
                </div>
              </div>

              <div className="row">
                <span className="pt-1 pr-2">Qty : </span>
                <input
                  type="number"
                  value={p.count}
                  className="form-control text-center"
                  onChange={(e) => {
                    handleQuantityChange(e, p);
                  }}
                  onClick={(e) => {
                    e.target.select();
                  }}
                  style={{
                    width: "20%",
                  }}
                />
                <span className="pl-5 ml-2 pt-1">
                  ${getOptByOptId(p, p.selectedOptId).price}
                </span>
              </div>
            </div>
          </div>
          <hr />
        </div>
      ))}
      <div>
        <b>
          SUBTOTAL : $
          {numbro(getSubtotal()).format({
            thousandSeparated: true,
            mantissa: 2,
          })}
        </b>
      </div>
      <br />

      <button
        onClick={() => {
          dispatch({
            type: "SET_VISIBLE",
            payload: false,
          });
          history.push("/cart");
          window.location.reload(); // bug work around
        }}
        className="text-center btn btn-primary btn-raised btn-block"
      >
        Review {`&`} Checkout
      </button>
    </Drawer>
  );
};

export default SideDrawer;
