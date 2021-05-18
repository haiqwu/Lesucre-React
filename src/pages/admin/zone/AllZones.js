import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card } from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminNav from "../../../components/nav/AdminNav";
import { getAllZones } from "../../../functions/zone";

const AllZones = () => {
  const [zones, setZones] = useState([]);

  // comp did mount
  useEffect(() => {
    loadAllZones();
  }, []);

  const loadAllZones = () => {
    getAllZones().then((res) => {
      setZones(res.data);
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          <h4>All Zones</h4>

          <div className="row">
            {zones.map((z) => (
              <div key={z._id}>
                <Card
                  actions={[
                    <Link to={`/admin/zone/${z._id}`}>
                      <EditOutlined className="text-warning" />
                    </Link>,
                    <DeleteOutlined
                      className="text-danger"
                      onClick={() => {
                        // TBIL
                      }}
                    />,
                  ]}
                  title={z.zoneTitle}
                  bordered={true}
                  style={{ width: 300 }}
                >
                  <p>{z.zoneState}</p>
                  <p> {z.zoneCity}</p>
                  <p> {z.zoneZipCode} </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllZones;
