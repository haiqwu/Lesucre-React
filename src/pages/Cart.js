import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import numbro from "numbro";
import ProductCardInCheckout from "../components/cards/ProductCardInCheckout";
import { getAllZones } from "../functions/zone";
import { Radio, Select, Space, Tooltip } from "antd";
import "../components/cards/SingleProduct.css";
import moment from "moment";
import { QuestionCircleOutlined } from "@ant-design/icons";

const Cart = () => {
  const { Option } = Select;

  const DEFAULT_TIP_RATE_FOR_PICK_UP = 0;

  const { cart, user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const [zones, setZones] = useState([]);

  const [orderType, setOrderType] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [orderMethod, setOrderMethod] = useState("");

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [minTipRate, setMinTipRate] = useState(0);

  const [selectedTipRate, setSelectedTipRate] = useState(0);
  const [customizedTip, setCustomizedTip] = useState("");

  // comp did mount
  useEffect(() => {
    console.log("comp did mount");

    // load all zones
    getAllZones().then((res) => {
      const zones = res.data;
      console.log("all zones loaded, ", zones);
      setZones(zones);
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
    });
  }, []);

  useEffect(() => {
    if (orderType === "pick-up") {
      setDeliveryFee(0);
      setMinTipRate(DEFAULT_TIP_RATE_FOR_PICK_UP);
      setSelectedTipRate(DEFAULT_TIP_RATE_FOR_PICK_UP);
    }
    if (orderType === "delivery") {
      // set to default
      setDeliveryFee(0);
      setMinTipRate(0);
      setSelectedTipRate(0);
    }
  }, [orderType]);

  useEffect(() => {
    if (selectedZone === "") {
      // set to default
      setDeliveryFee(0);
      setMinTipRate(0);
      setSelectedTipRate(0);
    }
  }, [selectedZone]);

  useEffect(() => {
    if (selectedZone) {
      if (orderMethod === "gb") {
        setDeliveryFee(getZoneById(selectedZone).groupBuy.gbDeliveryFee);
        setMinTipRate(getZoneById(selectedZone).groupBuy.gbMinTipRate);
        setSelectedTipRate(getZoneById(selectedZone).groupBuy.gbMinTipRate);
      }
      if (orderMethod === "sd") {
        setDeliveryFee(getZoneById(selectedZone).singleDelivery.sdDeliveryFee);
        setMinTipRate(getZoneById(selectedZone).singleDelivery.sdMinTipRate);
        setSelectedTipRate(
          getZoneById(selectedZone).singleDelivery.sdMinTipRate
        );
      }
    }
  }, [orderMethod, selectedZone]);

  const getZoneById = (id) => {
    const found = zones.find((z) => {
      return z._id === id;
    });
    if (!found) {
      return null;
    }
    return found;
  };

  const getSelectedOption = (cartItem) => {
    return cartItem.options.find((i) => i._id === cartItem.selectedOptId);
  };

  const getSubtotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return (
        currentValue + nextValue.count * getSelectedOption(nextValue).price
      );
    }, 0);
  };
  const determinDisableProceed = () => {
    if (orderType === "pick-up") {
      return false;
    }
    if (selectedZone === "") {
      return true;
    }
    if (orderMethod === "gb") {
      if (
        +getSubtotal() >= +getZoneById(selectedZone).groupBuy.gbMinOrderTotal
      ) {
        // min total reached
        return false;
      } else {
        return true;
      }
    }
    if (orderMethod === "sd") {
      if (
        +getSubtotal() >=
        +getZoneById(selectedZone).singleDelivery.sdMinOrderTotal
      ) {
        // min total reached
        return false;
      } else {
        return true;
      }
    }
  };

  const saveOrderToDb = () => {
    //
  };

  const showCartItems = () => (
    <table className="table ">
      <thead className="thead-light">
        <tr>
          <th scope="col"></th>
          <th scope="col">Item Name</th>
          <th scope="col">Option</th>
          <th scope="col">Quantity</th>
          <th scope="col">Price</th>
          <th scope="col">In Stock</th>
          <th scope="col">Remove</th>
        </tr>
      </thead>

      {cart.map((p) => (
        <ProductCardInCheckout key={`${p.selectedOptId}`} p={p} />
      ))}
    </table>
  );

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-md-7">
          <h4 className="pt-3"> {cart.length} item(s)</h4>

          {!cart.length ? (
            <p>
              No item in cart yet. <Link to="/shop">Continue Shopping</Link>
            </p>
          ) : (
            showCartItems()
          )}
        </div>

        <div className="col-md-5 pt-5">
          <h4> Delivery Info </h4> <hr />
          <div>
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
              {orderType === "pick-up" && <div> Min total required: $0</div>}
              {orderType === "delivery" && (
                <div className="pt-2">
                  <Select
                    value={selectedZone}
                    style={{ width: 320 }}
                    onChange={(v) => {
                      setSelectedZone(v);
                      if (v !== "") {
                        setOrderMethod("gb");
                        // setDeliveryFee(getZoneById(v).groupBuy.gbDeliveryFee); //
                        // setMinTipRate(getZoneById(v).groupBuy.gbMinTipRate); //
                      }
                      const orderInfo = {
                        selectedZone: v,
                        orderMethod: "",
                        orderType,
                      };
                      if (v !== "") {
                        orderInfo.orderMethod = "gb";
                      }
                      localStorage.setItem(
                        "orderInfo",
                        JSON.stringify(orderInfo)
                      );
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
                  <label
                    className=""
                    style={{
                      width: "95%",
                    }}
                  >
                    <input
                      value="gb"
                      type="radio"
                      id="gb-order"
                      className="card-input-element d-none"
                      name="deli-type"
                      checked={orderMethod === "gb"}
                      onChange={(e) => {
                        setOrderMethod(e.target.value);
                        const orderInfo = {
                          orderMethod: e.target.value,
                          orderType,
                          selectedZone,
                        };
                        localStorage.setItem(
                          "orderInfo",
                          JSON.stringify(orderInfo)
                        );
                      }}
                    />
                    <div className="ml-3 card card-body d-flex  justify-content-between align-items-center">
                      <b>Group Buy Order </b>
                      <b className="pt-3">
                        {getZoneById(selectedZone).groupBuy.gbTitle}
                      </b>
                      <p className="pt-3">
                        {getZoneById(selectedZone).groupBuy.gbNote}
                      </p>
                      <p>
                        Min Total {` `}
                        <Tooltip title="Amount that each person needs">
                          <QuestionCircleOutlined className=" pr-1" />
                        </Tooltip>
                        : $ {getZoneById(selectedZone).groupBuy.gbMinOrderTotal}
                      </p>
                      <p>
                        Delivery Fee:{" "}
                        {getZoneById(selectedZone).groupBuy.gbDeliveryFee}
                      </p>
                      <p>
                        Group Min Total{" "}
                        <Tooltip title="  Amount that all orders in group needs to added up to">
                          <QuestionCircleOutlined className=" pr-1" />
                        </Tooltip>
                        : ${" "}
                        {getZoneById(selectedZone).groupBuy.gbMinGroupBuyTotal}
                      </p>
                      <p>
                        Group Buy Expire Date : <br />
                        {moment(
                          getZoneById(selectedZone).groupBuy.expireDate
                        ).format("dddd, MMMM Do YYYY, h:mm:ss A")}
                      </p>
                      <p>
                        Expected Delivery Date :
                        <br />
                        {` `}
                        {moment(
                          getZoneById(selectedZone).groupBuy.deliveryDate
                        ).format("dddd, MMMM Do YYYY, h:mm:ss A")}
                      </p>
                      <p>
                        Current orders on this group:
                        {getZoneById(selectedZone).groupBuy.orders}
                      </p>
                      <p>
                        Min Tip Rate:
                        {getZoneById(selectedZone).groupBuy.gbMinTipRate}%
                      </p>
                      <p>
                        {getZoneById(selectedZone).groupBuy.gbPayOnDelivery
                          ? "Pay On Delivery is allowed"
                          : "MUST PAY ALL ONLINE"}
                      </p>
                    </div>
                  </label>
                </div>

                <div className="">
                  <label
                    style={{
                      width: "95%",
                    }}
                  >
                    <input
                      value="sd"
                      type="radio"
                      id="sd-order"
                      className="card-input-element d-none "
                      name="deli-type"
                      checked={orderMethod === "sd"}
                      onChange={(e) => {
                        setOrderMethod(e.target.value);
                        const orderInfo = {
                          orderMethod: e.target.value,
                          orderType,
                          selectedZone,
                        };
                        localStorage.setItem(
                          "orderInfo",
                          JSON.stringify(orderInfo)
                        );
                      }}
                    />
                    <div className="ml-3 card card-body d-flex justify-content-between align-items-center">
                      <b>Single Deliver ( Deliver for you )</b>
                      <p className="pt-3">
                        {getZoneById(selectedZone).singleDelivery.sdNote}{" "}
                      </p>

                      <p>
                        Min Total: $
                        {
                          getZoneById(selectedZone).singleDelivery
                            .sdMinOrderTotal
                        }
                      </p>
                      <p>
                        Delivery Fee: ${` `}
                        {
                          getZoneById(selectedZone).singleDelivery.sdDeliveryFee
                        }{" "}
                      </p>
                      <p>
                        Min Tip Rate:
                        {getZoneById(selectedZone).singleDelivery.sdMinTipRate}%
                      </p>
                      <p>
                        {getZoneById(selectedZone).singleDelivery
                          .sdPayOnDelivery
                          ? "Pay On Delivery is allowed"
                          : "MUST PAY ALL ONLINE"}
                      </p>
                    </div>
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
                      +getZoneById(selectedZone).singleDelivery
                        .sdMinOrderTotal - getSubtotal()
                    ).format({
                      thousandSeparated: true,
                      mantissa: 2,
                    })}{" "}
                    more{" "}
                  </b>
                </p>
              ))}

            {/* Delivery fee and TIP RATE */}
            {(orderType === "pick-up" || selectedZone) && (
              <div>
                <h6>Tips</h6>

                <div className="form-group">
                  <input
                    value={minTipRate}
                    type="radio"
                    name="tips"
                    id="tips1"
                    checked={selectedTipRate == minTipRate}
                    onChange={(e) => {
                      setSelectedTipRate(e.target.value);
                    }}
                  />
                  <label htmlFor="tips1">
                    {minTipRate} % - $
                    {numbro(+getSubtotal() * (minTipRate / 100)).format({
                      thousandSeparated: true,
                      mantissa: 2,
                    })}
                  </label>
                </div>

                <div className="form-group">
                  <input
                    value={+minTipRate + 3}
                    type="radio"
                    name="tips"
                    id="tips2"
                    onChange={(e) => {
                      setSelectedTipRate(e.target.value);
                    }}
                    checked={selectedTipRate == +minTipRate + 3}
                  />
                  <label htmlFor="tips2">
                    {+minTipRate + 3} % - $
                    {numbro(+getSubtotal() * ((+minTipRate + 3) / 100)).format({
                      thousandSeparated: true,
                      mantissa: 2,
                    })}
                  </label>
                </div>

                <div className="form-group">
                  <input
                    value={+minTipRate + 6}
                    type="radio"
                    name="tips"
                    id="tips3"
                    onChange={(e) => {
                      setSelectedTipRate(e.target.value);
                    }}
                    checked={selectedTipRate == +minTipRate + 6}
                  />
                  <label htmlFor="tips3">
                    {+minTipRate + 6} % - $
                    {numbro(+getSubtotal() * ((+minTipRate + 6) / 100)).format({
                      thousandSeparated: true,
                      mantissa: 2,
                    })}
                  </label>
                </div>

                <div className="form-group">
                  <input
                    value=""
                    type="radio"
                    name="tips"
                    id="tips-cust"
                    onChange={(e) => {
                      setSelectedTipRate(e.target.value);
                    }}
                    checked={selectedTipRate === ""}
                  />
                  <label htmlFor="tips-cust">Customized Tips</label>
                </div>
                {selectedTipRate === "" && (
                  <div>
                    $ {` `}
                    <input type="number" />
                  </div>
                )}

                <p>Delivery Fee: ${deliveryFee}</p>
              </div>
            )}
          </div>
          {/* Order Summ starts here */}
          <h4>Order Summary</h4>
          <hr />
          {cart.map((c, i) => (
            <div key={i}>
              <p>
                {`${c.title} - ${getSelectedOption(c).opt_name}`}{" "}
                <b>x {c.count}</b> ={" "}
                <b>${getSelectedOption(c).price * c.count}</b>
              </p>
            </div>
          ))}
          <hr />
          Subtotal :{" "}
          <b>
            $
            {numbro(getSubtotal()).format({
              thousandSeparated: true,
              mantissa: 2,
            })}
          </b>
          <hr />
          {user ? (
            <button
              className="btn btn-sm btn-primary mt-2 btn-raised mb-5 "
              disabled={determinDisableProceed()}
              onClick={saveOrderToDb}
            >
              Proceed to Checkout
            </button>
          ) : (
            <button
              className="btn btn-sm btn-primary mt-2 border "
              disabled={!cart.length}
            >
              <Link
                to={{
                  pathname: "/login",
                  state: {
                    from: "cart",
                  },
                }}
              >
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
