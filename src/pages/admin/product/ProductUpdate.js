import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getProduct, updateProduct } from "../../../functions/product";
import { createProductOption } from "../../../functions/product_option";
import { getCategories, getCategorySubs } from "../../../functions/category";
import { Select, Form, Input, Button, Radio, Space, Checkbox } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import SingleFileUpload from "../../../components/forms/SingleFileUpload";
import MultiFileUpload from "../../../components/forms/MultiFileUpload";

const { Option } = Select;

const ProductUpdate = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const productId = match.params._id;

  const [values, setValues] = useState({
    title: "",
    description: "",
    category: {}, // selectedCategory - DFLN
    subs: [], // arrayOfSubs  -  DFLN
    images: [],
    defaultImg: {},
    options: [], //
  });

  const [categories, setCategories] = useState([]); // all avaiable categories

  const [subOptions, setSubOptions] = useState([]); // all selectable subs (Dynamic)
  const [loading, setLoading] = useState(false);

  const {
    title,
    description,
    category,
    subs, // selected values from user
    images,
    defaultImg,
    options, //
  } = values;

  // comp did mount
  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = async () => {
    try {
      const p = await getProduct(productId);

      // data derich
      const idList = p.data.subs.map((s) => {
        return s._id;
      });
      p.data.subs = idList;
      console.log("single product data fetched: (AFTER derich) ", p.data);
      setValues({ ...values, ...p.data }); // It runs from left to right, first destruct values, then destruct p.data, thus p.data overwrites values

      // load single prod's subs
      const res = await getCategorySubs(p.data.category._id);
      setSubOptions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCategories = () =>
    getCategories().then((c) => {
      // console.log("GET CATEGORIES IN UPDATE PRODUCT", c.data);
      setCategories(c.data);
    });

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
    let optionCheckErr = "";
    options.forEach((o) => {
      if (!o.opt_name) {
        optionCheckErr = "Please provide option name";
        return;
      }
      if (o.price < 0 || o.price === "") {
        optionCheckErr = "Invalid Option Price";
        return;
      }
      if (
        isNaN(Number(o.quantity)) ||
        !Number.isInteger(Number(o.quantity)) ||
        o.quantity === "" ||
        o.quantity < 0
      ) {
        optionCheckErr = "Invalid stock quantity in product option(s)";
        return;
      }
    });
    if (optionCheckErr !== "") {
      return toast.error(optionCheckErr);
    }

    setLoading(true);
    try {
      // remove redundants of option item
      options.forEach((o) => {
        delete o.__v;
        delete o.updatedAt;
        delete o.createdAt;
        delete o.sold;
        delete o._id;
      });
      const resProd = await updateProduct(productId, values, user.token);
      setLoading(false);
      toast.success(`"${resProd.data.title}" is updated`);
      history.push("/admin/products");
    } catch (err) {
      console.log(err);
      setLoading(false);
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
    setValues({ ...values, subs: [], category: e.target.value }); // category is live (selectedCategory)
    // setArrayOfSubs([]);
    if (e.target.value !== "") {
      getCategorySubs(e.target.value)
        .then((res) => {
          // console.log("all SUBs on category change: ", res);
          setSubOptions(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      //setShowSub(true);
    } else {
      setSubOptions([]);
      //setShowSub(false);
    }
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const isDefault = options[index].default_opt;
    if (isDefault) {
      return toast.error(`you can't remove a default option`);
    }
    const list = [...options];
    list.splice(index, 1);
    setValues({
      ...values,
      options: list,
    });
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    const lst = [
      ...options,
      {
        opt_name: "",
        price: "",
        quantity: "",
        product: productId,
        default_opt: false,
      },
    ];
    setValues({
      ...values,
      options: lst,
    });
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
            <h4> Edit Product </h4>
          )}

          {/* Form begin  */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label> 一级分类 </label>

              <select
                name="category"
                className="form-control"
                onChange={handleCategoryChange}
                value={category._id} // correct WAY
              >
                {categories.length > 0 &&
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label> 二级分类 - 可多选</label>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Please select sub-categories"
                value={subs}
                onChange={(value) => setValues({ ...values, subs: value })} // here value is the finalized (by ant) array of ids from user selects
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

            <div>
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
            <br />

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

            {/* Dynamic comp ---   Including { name, price, stockQty } as a repeated comp, with a default selection checkbox  */}
            <div>
              <b> Product Options </b>

              {options.map((opt, index) => (
                <div key={index}>
                  <div className="border">
                    <br />
                    <Form.Item
                      label="Option Name"
                      labelCol={{ span: 3 }}
                      wrapperCol={{ span: 5 }}
                    >
                      <Input
                        value={opt.opt_name}
                        onChange={(e) => {
                          const lst = [...options];
                          lst[index].opt_name = e.target.value;
                          setValues({
                            ...values,
                            options: lst,
                          });
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
                        value={opt.price}
                        onChange={(e) => {
                          const lst = [...options];
                          lst[index].price = e.target.value;
                          setValues({
                            ...values,
                            options: lst,
                          });
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
                        value={opt.quantity}
                        onChange={(e) => {
                          const lst = [...options];
                          lst[index].quantity = e.target.value;
                          setValues({
                            ...values,
                            options: lst,
                          });
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      labelCol={{ span: 3 }}
                      wrapperCol={{ span: 5, offset: 2 }}
                    >
                      <Checkbox
                        checked={opt.default_opt}
                        onChange={() => {
                          if (options[index].default_opt) {
                            // do not uncheck a checked opt
                            return;
                          }
                          options[index].default_opt = true;
                          // set all others to false
                          options.forEach((o, i) => {
                            if (i !== index) {
                              o.default_opt = false;
                            }
                          });

                          setValues({
                            ...values,
                            options: options,
                          });
                        }}
                      >
                        Set as default
                      </Checkbox>

                      {options.length !== 1 && (
                        <Button
                          className="btn btn-raised ml-4"
                          onClick={() => handleRemoveClick(index)}
                          icon={<MinusCircleOutlined />}
                        >
                          Remove
                        </Button>
                      )}
                    </Form.Item>
                  </div>

                  <div className="">
                    <br />
                    {options.length - 1 === index && (
                      <Form.Item>
                        <Button
                          icon={<PlusOutlined />}
                          onClick={handleAddClick}
                          type="dashed"
                          block
                        >
                          Add Another Option
                        </Button>
                      </Form.Item>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* All form field ends --- --- --- ------ ---  --- --- */}

            <br />
            <button className="btn btn-outline-info"> Save to database </button>
            <br />
          </form>

          <hr />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
