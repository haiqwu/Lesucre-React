import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../functions/category";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export const MONGO_ERR_DUPLICATE_KEY = "duplicate key error";

const CategoryCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // comp did mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    return getCategories().then((c) => setCategories(c.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    try {
      const res = await createCategory({ name }, user.token);
      setLoading(false);
      setName("");
      toast.success(`"${res.data.name}" is created`);
      loadCategories();
    } catch (err) {
      let errMsg = err.response.data.error;
      setLoading(false);
      if (errMsg.includes(MONGO_ERR_DUPLICATE_KEY)) {
        return toast.error("Already exists");
      }
      toast.error(errMsg);
    }
  };

  const handleRemove = async (slug) => {
    // let answer = window.confirm("Delete?");
    // console.log(answer, slug);
    if (window.confirm("Delete the selected item?")) {
      setLoading(true);
      removeCategory(slug, user.token)
        .then((res) => {
          console.log(res);
          setLoading(false);
          toast.error(`[${res.data.name}] deleted`);
          loadCategories();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          toast.error(err.response.data.error);
        });
    }
  };

  const categoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name 分类名称</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
          value={name}
          autoFocus
          required
        />
        <br />
        <button className="btn btn-outline-primary"> 添加</button>
      </div>
    </form>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger"> Loading.. </h4>
          ) : (
            <h4> 新增一级分类 </h4>
          )}

          {categoryForm()}

          <hr />
          {categories.map((c) => (
            <div className="alert alert-primary" key={c._id}>
              {c.name}
              <span
                onClick={() => handleRemove(c.slug)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/category/${c.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-warning" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
