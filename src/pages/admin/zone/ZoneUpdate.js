import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import moment from "moment";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getZoneById, updateZoneWithGBAndSD } from "../../../functions/zone";

const ZoneUpdate = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const zoneId = match.params._id;

  const [zoneTitle, setZoneTitle] = useState("");
  const [zoneState, setZoneState] = useState("");
  const [zoneCity, setZoneCity] = useState("");
  const [zoneZipCode, setZoneZipCode] = useState("");

  const [gbTitle, setGbTitle] = useState("");
  const [gbNote, setGbNote] = useState("");
  const [gbDeliveryFee, setGbDeliveryFee] = useState("");
  const [gbMinOrderTotal, setGbMinOrderTotal] = useState("");
  const [gbMinGroupBuyTotal, setGbMinGroupBuyTotal] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [gbMinTipRate, setGbMinTipRate] = useState("");
  const [gbPayOnDelivery, setGbPayOnDelivery] = useState(false);

  const [sdNote, setSdNote] = useState("");
  const [sdDeliveryFee, setSdDeliveryFee] = useState("");
  const [sdMinOrderTotal, setSdMinOrderTotal] = useState("");
  const [sdMinTipRate, setSdMinTipRate] = useState("");
  const [sdPayOnDelivery, setSdPayOnDelivery] = useState(false);

  const [zone, setZone] = useState({});

  // comp did mount
  useEffect(() => {
    loadZone();
  }, []);

  const loadZone = async () => {
    const res = await getZoneById(zoneId);
    const zone = res.data;
    setZone(zone);

    console.log("zone loaded, ", zone);

    setZoneTitle(zone.zoneTitle);
    setZoneState(zone.zoneState);
    setZoneCity(zone.zoneCity);
    setZoneZipCode(zone.zoneZipCode);

    const gb = zone.groupBuy;

    setGbTitle(gb.gbTitle);
    setGbNote(gb.gbNote);
    setGbDeliveryFee(gb.gbDeliveryFee);
    setGbMinOrderTotal(gb.gbMinOrderTotal);
    setGbMinGroupBuyTotal(gb.gbMinGroupBuyTotal);
    setExpireDate(moment(gb.expireDate));
    setDeliveryDate(moment(gb.deliveryDate));
    setGbMinTipRate(gb.gbMinTipRate);
    setGbPayOnDelivery(gb.gbPayOnDelivery);

    const sd = zone.singleDelivery;

    setSdNote(sd.sdNote);
    setSdDeliveryFee(sd.sdDeliveryFee);
    setSdMinOrderTotal(sd.sdMinOrderTotal);
    setSdMinTipRate(sd.sdMinTipRate);
    setSdPayOnDelivery(sd.sdPayOnDelivery);
  };

  const handleExpireDateTimeChange = (v) => {
    if (typeof v === "string") {
      console.log("invalid");
      setExpireDate("");
    } else {
      console.log(moment(v).toDate());
      setExpireDate(moment(v).toDate());
    }
  };

  const handleDeliveryDateTimeChange = (v) => {
    if (typeof v === "string") {
      console.log("invalid");
      setDeliveryDate("");
    } else {
      console.log(moment(v).toDate());
      setDeliveryDate(moment(v).toDate());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!zoneTitle) {
      return toast.error("You must give a zone Title");
    }
    if (!gbDeliveryFee) {
      return toast.error(
        "You must give a group buy order Delivery fee, if no fee required, enter 0"
      );
    }
    if (!gbMinOrderTotal) {
      return toast.error(
        "You must give a group buy min Order Total(Per Person), if no fee required, enter 0"
      );
    }
    if (!gbMinGroupBuyTotal) {
      return toast.error(
        "You must give a group buy min Order Total(Per Group), if no fee required, enter 0"
      );
    }
    if (!deliveryDate) {
      return toast.error(
        "You must provide a delivery date/ Wrong date time format."
      );
    }
    if (!expireDate) {
      return toast.error(
        "You must provide a expire date/ Wrong date time format."
      );
    }
    if (!gbMinTipRate) {
      return toast.error(
        "you must give a group buy min tip rate %, if no tip required enter 0"
      );
    }
    if (!sdDeliveryFee) {
      return toast.error(
        "You must give a Single Delivery order Delivery fee, if no fee required, enter 0"
      );
    }
    if (!sdMinOrderTotal) {
      return toast.error(
        "You must give a Single Delivery Order Min Order Total, if no fee required enter 0 "
      );
    }
    if (!sdMinTipRate) {
      return toast.error(
        "you must give a Single Delivery Order min tip rate %, if no tip required enter 0"
      );
    }

    const zoneData = {
      zoneTitle,
      zoneState,
      zoneCity,
      zoneZipCode,
    };
    const groupBuyData = {
      gbTitle,
      gbNote,
      gbDeliveryFee,
      gbMinOrderTotal,
      gbMinGroupBuyTotal,
      expireDate,
      deliveryDate,
      gbMinTipRate,
      gbPayOnDelivery,
    };
    const singleDeliveryData = {
      sdNote,
      sdDeliveryFee,
      sdMinOrderTotal,
      sdMinTipRate,
      sdPayOnDelivery,
    };
    const ids = {
      groupById: zone.groupBuy._id,
      singleDeliveryId: zone.singleDelivery._id,
    };
    try {
      const res = await updateZoneWithGBAndSD(
        zoneId,
        {
          ids,
          zoneData,
          groupBuyData,
          singleDeliveryData,
        },
        user.token
      );
      toast.success(`"${res.data.zoneTitle}" updated success.`);
      history.push("/admin/zones");
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <section className="col-md-10">
          <form onSubmit={handleSubmit}>
            <section className="">
              <h4>Zone Address Info </h4>
              <div className="form-group">
                <label> Zone Title </label>
                <input
                  value={zoneTitle}
                  className="form-control"
                  onChange={(e) => {
                    setZoneTitle(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label> Zone State </label>
                <input
                  value={zoneState}
                  className="form-control"
                  onChange={(e) => {
                    setZoneState(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label> Zone City </label>
                <input
                  value={zoneCity}
                  className="form-control"
                  onChange={(e) => {
                    setZoneCity(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label> Zone Zip Code </label>
                <input
                  value={zoneZipCode}
                  className="form-control"
                  onChange={(e) => {
                    setZoneZipCode(e.target.value);
                  }}
                />
              </div>
            </section>
            <hr />
            <section>
              <h4>Group Buy order Info</h4>

              <div className="form-group">
                <label> Title </label>
                <input
                  value={gbTitle}
                  className="form-control"
                  onChange={(e) => {
                    setGbTitle(e.target.value);
                  }}
                />
              </div>
              <div className="form-group">
                <label> Note </label>
                <input
                  value={gbNote}
                  className="form-control"
                  onChange={(e) => {
                    setGbNote(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label> Delivery Fee </label>
                <input
                  type="number"
                  value={gbDeliveryFee}
                  className="form-control"
                  onChange={(e) => {
                    setGbDeliveryFee(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label> Min Order Total (Per Person) </label>
                <input
                  type="number"
                  value={gbMinOrderTotal}
                  className="form-control"
                  onChange={(e) => {
                    setGbMinOrderTotal(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label> Min Group Buy Total (Per Group) </label>
                <input
                  type="number"
                  value={gbMinGroupBuyTotal}
                  className="form-control"
                  onChange={(e) => {
                    setGbMinGroupBuyTotal(e.target.value);
                  }}
                />
              </div>

              <div>
                <label> Delivery date {`&`} time </label>
                <Datetime
                  onChange={handleDeliveryDateTimeChange}
                  value={deliveryDate}
                />
              </div>

              <div>
                <label> Expire date {`&`} time </label>
                <Datetime
                  onChange={handleExpireDateTimeChange}
                  value={expireDate}
                />
              </div>

              <div className="form-group">
                <label> Min Tip Rate % (e.g. for 15% enter 15 ) </label>
                <input
                  type="number"
                  value={gbMinTipRate}
                  className="form-control"
                  onChange={(e) => {
                    setGbMinTipRate(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <input
                  id="gbPayOnDelivery"
                  type="checkbox"
                  checked={gbPayOnDelivery}
                  onChange={() => {
                    setGbPayOnDelivery(!gbPayOnDelivery);
                  }}
                />
                <label htmlFor="gbPayOnDelivery">
                  {" "}
                  Allow Pay On Delivery (Uncheck means only allow pay online )
                </label>
              </div>
            </section>

            <section>
              <h4> Single Delivery Order Info</h4>

              <div className="form-group">
                <label> Note </label>
                <input
                  value={sdNote}
                  className="form-control"
                  onChange={(e) => {
                    setSdNote(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label> Delivery Fee </label>
                <input
                  type="number"
                  value={sdDeliveryFee}
                  className="form-control"
                  onChange={(e) => {
                    setSdDeliveryFee(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label> Min Order Total </label>
                <input
                  type="number"
                  value={sdMinOrderTotal}
                  className="form-control"
                  onChange={(e) => {
                    setSdMinOrderTotal(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label> Min Tip Rate % (e.g. for 15% enter 15 ) </label>
                <input
                  type="number"
                  value={sdMinTipRate}
                  className="form-control"
                  onChange={(e) => {
                    setSdMinTipRate(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <input
                  id="sdPayOnDelivery"
                  type="checkbox"
                  checked={sdPayOnDelivery}
                  onChange={() => {
                    setSdPayOnDelivery(!sdPayOnDelivery);
                  }}
                />
                <label htmlFor="sdPayOnDelivery">
                  Allow Pay On Delivery (Uncheck means only allow pay online )
                </label>
              </div>
            </section>

            <button>Save</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ZoneUpdate;
