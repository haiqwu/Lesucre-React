import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createProduct } from "../../../functions/product";
import { createProductOption } from "../../../functions/product_option";
import { getCategories, getCategorySubs } from "../../../functions/category";
import { Select, Form, Input, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import SingleFileUpload from "../../../components/forms/SingleFileUpload";
import MultiFileUpload from "../../../components/forms/MultiFileUpload";

const { Option } = Select;

const ProductCreate = () => {
  const [values, setValues] = useState({
    title: "",
    description: "",
    category: "",
    subs: [],
    images: [],
    defaultImg: {},
    categories: [], // all avaiable categories
  });
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [loading, setLoading] = useState(false);
  // default option:
  const [optionName, setOptionName] = useState("");
  const [optionPrice, setOptionPrice] = useState(null);
  const [optionQty, setOptionQty] = useState(null);

  // redux
  const { user } = useSelector((state) => ({ ...state }));

  // comp did mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    return getCategories().then((c) =>
      setValues({
        ...values,
        categories: c.data,
      })
    );
  };

  const {
    title,
    description,
    category,
    subs, // selected values from user
    images,
    defaultImg,
    categories,
  } = values;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      return toast.error("Please provide title");
    }
    if (!defaultImg.url) {
      return toast.error("Please provide default image");
    }
    if (images.length === 0) {
      return toast.error("Please provide images");
    }
    if (!optionName) {
      return toast.error("Please provide option name");
    }
    if (optionPrice < 0 || optionPrice === null) {
      return toast.error("Invalid Price");
    }
    if (
      isNaN(Number(optionQty)) ||
      !Number.isInteger(Number(optionQty)) ||
      optionQty === null ||
      optionQty < 0
    ) {
      return toast.error("Invalid quantity");
    }

    try {
      const resProduct = await createProduct(values, user.token);
      // console.log(resProduct);
      const newProductId = resProduct.data._id;
      console.log("Create Prod success, id: ", newProductId);

      const resOpt = await createProductOption(
        {
          opt_name: optionName,
          price: optionPrice,
          quantity: optionQty,
          product: newProductId,
          default_opt: true,
        },
        user.token
      );

      toast.success(
        `Product: "${resProduct.data.title}" created success, Option "${resOpt.data.opt_name}" created success`
      );
      // clear fields
      setValues({
        ...values,
        title: "",
        description: "",
        images: [],
        defaultImg: {},
        category: "",
        subs: [],
      });
      setShowSub(false);
      setSubOptions([]);
      setOptionName("");
      setOptionPrice(null);
      setOptionQty(null);
    } catch (err) {
      console.log(err);
      // if (err.response.status === 400) toast.error(err.response.data);
      toast.error(err.response.data.error);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    // console.log(e.target.name, " ----- ", e.target.value);
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    // console.log("CLICKED CATEGORY: ", e.target.value);
    setValues({ ...values, subs: [], category: e.target.value });
    if (e.target.value !== "") {
      getCategorySubs(e.target.value)
        .then((res) => {
          console.log("all SUBs on category change: ", res);
          setSubOptions(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      setShowSub(true);
    } else {
      setSubOptions([]);
      setShowSub(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          {loading ? (
            <LoadingOutlined className="text-danger h1" />
          ) : (
            <h4> 创建商品 - including one default product option </h4>
          )}
          <hr />
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label> 一级分类 </label>
              <select
                name="category"
                className="form-control"
                onChange={handleCategoryChange}
                value={category}
              >
                <option value="">Please select</option>
                {categories.length > 0 &&
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {showSub && (
              <div>
                <label> 二级分类 - 可多选</label>
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Please select sub-categories"
                  value={subs}
                  onChange={(value) => setValues({ ...values, subs: value })}
                >
                  {subOptions &&
                    subOptions.length &&
                    subOptions.map((s) => (
                      <Option key={s._id} value={s._id}>
                        {s.name}
                      </Option>
                    ))}
                </Select>
              </div>
            )}
            <br />
            <div className="form-group">
              <label>Title 商品名称</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                className="form-control"
                value={description}
                onChange={handleChange}
              />
            </div>

            <div className="">
              <label>
                <b> Product Images </b> (if uploading taking too long, please
                try again)
              </label>
              <MultiFileUpload
                values={values}
                setValues={setValues}
                setLoading={setLoading}
              />
            </div>

            <div>
              <label>
                <b> Default Image </b> (One)
              </label>
              <SingleFileUpload
                values={values}
                setValues={setValues}
                setLoading={setLoading}
              />
            </div>

            <br />

            <hr />
            <label> Default Option </label>

            <Form.Item
              label="Option Name"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 5 }}
            >
              <Input
                type="text"
                value={optionName}
                onChange={(e) => {
                  setOptionName(e.target.value);
                }}
              />
            </Form.Item>

            <Form.Item
              label="Price"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 5 }}
            >
              <Input
                type="number"
                value={optionPrice}
                onChange={(e) => {
                  setOptionPrice(e.target.value);
                }}
              />
            </Form.Item>

            <Form.Item
              label="Stock Quantity"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 5 }}
            >
              <Input
                type="number"
                value={optionQty}
                onChange={(e) => {
                  setOptionQty(e.target.value);
                }}
              />
            </Form.Item>
            <br />
            <button className="btn btn-outline-info"> Save to database </button>
            <br />
          </form>
          <br />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
