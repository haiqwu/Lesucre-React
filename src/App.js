import React, { useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import firebase from "firebase";

import { currentUser } from "./functions/auth";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Header from "./components/nav/Header";
import RegisterComplete from "./pages/auth/RegisterComplete";
import PageExpired from "./pages/sides/PageExpired";
import ForgotPassword from "./pages/auth/ForgotPassword";
import History from "./pages/user/History";
import UserRoute from "./components/routes/UserRoute";
import AdminRoute from "./components/routes/AdminRoute";
import Password from "./pages/user/Password";
import Wishlist from "./pages/user/Wishlist";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryCreate from "./pages/admin/category/CategoryCreate";
import CategoryUpdate from "./pages/admin/category/CategoryUpdate";
import SubCreate from "./pages/admin/sub/SubCreate";
import SubUpdate from "./pages/admin/sub/SubUpdate";
import ProductCreate from "./pages/admin/product/ProductCreate";
import ProductUpdate from "./pages/admin/product/ProductUpdate";
import AllProducts from "./pages/admin/product/AllProducts";
import Product from "./pages/Product";
import CategoryHome from "./pages/category/CategoryHome";
import SubHome from "./pages/sub/SubHome";
import Shop from "./pages/Shop";
import SearchResult from "./pages/SearchResult";
import Cart from "./pages/Cart";
import SideDrawer from "./components/drawer/SideDrawer";
import AllZones from "./pages/admin/zone/AllZones";
import ZoneCreate from "./pages/admin/zone/ZoneCreate";
import ZoneUpdate from "./pages/admin/zone/ZoneUpdate";

const App = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // comp did mount
  // to check firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // user is defined
        const idTokenResult = await user.getIdTokenResult();
        console.log("user", user);

        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                display_name: res.data.display_name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
    // cleanup
    return () => {
      // comp will unmount
      unsubscribe();
    };
  }, []);

  axios.interceptors.response.use(
    (resp) => {
      return resp;
    },
    (err) => {
      if (err.response && err.response.status === 440) {
        toast.error("Session expired.");
        // console.log('440 Intercepted');
        firebase.auth().signOut();
        dispatch({
          type: "LOGOUT",
          payload: null,
        });
        history.push("/login");
      }
      return Promise.reject({ response: err.response });
    }
  );

  return (
    <>
      <Header />

      <SideDrawer />
      <ToastContainer />

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/page-expired" component={PageExpired} />
        <Route
          exact
          path="/register/complete/:urlparams"
          component={RegisterComplete}
        />
        <Route exact path="/forgot/password" component={ForgotPassword} />
        <UserRoute exact path="/user/history" component={History} />
        <UserRoute exact path="/user/password" component={Password} />
        <UserRoute exact path="/user/wishlist" component={Wishlist} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute exact path="/admin/category" component={CategoryCreate} />
        <AdminRoute
          exact
          path="/admin/category/:slug"
          component={CategoryUpdate}
        />
        <AdminRoute exact path="/admin/sub" component={SubCreate} />
        <AdminRoute exact path="/admin/sub/:slug" component={SubUpdate} />
        <AdminRoute exact path="/admin/product" component={ProductCreate} />
        <AdminRoute exact path="/admin/products" component={AllProducts} />

        <AdminRoute exact path="/admin/zone" component={ZoneCreate} />
        <AdminRoute exact path="/admin/zones" component={AllZones} />
        <AdminRoute exact path="/admin/zone/:_id" component={ZoneUpdate} />

        <AdminRoute
          exact
          path="/admin/product/:_id"
          component={ProductUpdate}
        />
        <Route exact path="/product/:_id" component={Product} />
        <Route exact path="/category/:slug" component={CategoryHome} />
        <Route exact path="/sub/:slug" component={SubHome} />
        <Route exact path="/search" component={SearchResult} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/cart" component={Cart} />
      </Switch>
    </>
  );
};

export default App;
