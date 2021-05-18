import React, { useState, useEffect } from "react";
import { Menu, Badge } from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  UserOutlined,
  UserAddOutlined,
  HomeOutlined,
  ShoppingOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Search from "../forms/Search";
import { getCategories } from "../../functions/category";

const { SubMenu, Item } = Menu;

const Header = () => {
  let dispatch = useDispatch(); // update redux state directly using dispatch
  let { user, cart } = useSelector((state) => ({ ...state })); // getter for redux state
  let history = useHistory();

  const [current, setCurrent] = useState("home");
  const [categories, setCategories] = useState([]);

  // comp did mount
  useEffect(() => {
    getCategories().then((c) => {
      setCategories(c.data);
    });
  }, []);

  const handleClick = (e) => {
    // console.log(e.key);
    setCurrent(e.key);
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    history.push("/login");
  };

  const getTitle = () => {
    if (
      firebase.auth().currentUser &&
      firebase.auth().currentUser.displayName
    ) {
      return firebase.auth().currentUser.displayName;
    }
    return user.email;
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Item key="home" icon={<HomeOutlined />}>
        <Link to="/"> Le Sucre </Link>
      </Item>

      <Item key="shop" icon={<ShoppingOutlined />}>
        <Link to="/shop"> Shop </Link>
      </Item>

      <Item key="cart" icon={<ShoppingCartOutlined />}>
        <Link to="/cart">
          <Badge count={cart.length} offset={[9, 0]}>
            Cart
          </Badge>
        </Link>
      </Item>

      {/* <SubMenu
        key="shop"
        icon={<ShoppingOutlined />}
        title={"Shop"}
        className=""
        onTitleClick={() => {
          setCurrent("shop");
          history.push("/shop");
        }}
      >
        <Item key={"shop"}>
          <Link to={`/shop`}> All </Link>
        </Item>
        {categories.length > 0 &&
          categories.map((c) => (
            <Item key={c._id}>
              <Link to={`/category/${c.slug}`}> {c.name} </Link>
            </Item>
          ))}
      </SubMenu> */}

      {!user && (
        <Item key="register" icon={<UserAddOutlined />} className="float-right">
          <Link to="/register"> Sign Up </Link>
        </Item>
      )}

      {!user && (
        <Item key="login" icon={<UserOutlined />} className="float-right">
          <Link to="/login"> Login </Link>
        </Item>
      )}

      {user && (
        <SubMenu
          key="SubMenu"
          icon={<SettingOutlined />}
          title={getTitle()}
          className="float-right"
        >
          {user && user.role === "subscriber" && (
            <Item>
              <Link to="/user/history"> Profile/Orders </Link>
            </Item>
          )}

          {user && user.role === "admin" && (
            <Item>
              <Link to="/admin/dashboard"> Control Center </Link>
            </Item>
          )}

          <Item icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Item>
        </SubMenu>
      )}

      <span className="float-right p-1">
        <Search />
      </span>
    </Menu>
  );
};

export default Header;
