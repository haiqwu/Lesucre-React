import React from "react";
import { Link } from "react-router-dom";

const AdminNav = () => (
  <nav>
    <ul className="nav flex-column">
      <li className="nav-item">
        <Link to="/admin/dashboard" className="nav-link">
          Dashboard
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/admin/product" className="nav-link">
          Product 商品创建
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/admin/products" className="nav-link">
          Products 商品编辑
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/admin/category" className="nav-link">
          Category 一级分类
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/admin/sub" className="nav-link">
          Sub Category 二级分类
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/admin/zone" className="nav-link">
          Zone Create
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/admin/zones" className="nav-link">
          Modify Zones
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/admin/coupon" className="nav-link">
          Coupons
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/user/password" className="nav-link">
          APC管理员账户密码
        </Link>
      </li>
    </ul>
  </nav>
);

export default AdminNav;
