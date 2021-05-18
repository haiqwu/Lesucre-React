import React, { useState } from "react";
import UserNav from "../../components/nav/UserNav";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { PASSWORD_INVALID } from "../auth/Login";

export const ERR_NEED_RE_AUTH =
  "This operation is sensitive and requires recent authentication. Log in again before retrying this request.";

const Password = () => {
  const [password, setPassword] = useState("");
  const [passwordOld, setPasswordOld] = useState("");

  const [passwordRe, setPasswordRe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useSelector((state) => ({ ...state }));

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 0. check if password fields are empty
    if (password == "" || passwordRe == "" || !password || passwordOld == "") {
      setError("Please enter password");
      return;
    }
    // 1. check password and passwordRe same?
    if (password != passwordRe) {
      setError("Password did not match, please try again");
      return;
    }
    // 2.
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // validation done, all good now.
    setLoading(true);
    // console.log(password);

    try {
      const loggedInUserEmail = user.email;
      // send re-login request to prevent ERR_NEED_RE_AUTH error from firebase
      await auth.signInWithEmailAndPassword(loggedInUserEmail, passwordOld);

      // send update password request to the firebase to handle
      await auth.currentUser.updatePassword(password);

      setLoading(false);
      setPassword("");
      setPasswordRe("");
      setPasswordOld("");
      toast.success("Your password has been successfully updated");
    } catch (err) {
      setLoading(false);
      if (err.message === PASSWORD_INVALID) {
        toast.error("Old password mismatch, please try again");
        return;
      }
      console.log(err.message);
      toast.error(err.message);
    }
  };

  const passwordUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group text-center">
        <label> Old password </label>
        <input
          type="password"
          onChange={(e) => setPasswordOld(e.target.value)}
          className="form-control"
          disabled={loading}
          value={passwordOld}
        />

        <label>New password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="form-control "
          disabled={loading}
          value={password}
        />
        <label> Confirm (re-enter) new password</label>
        <input
          type="password"
          onChange={(e) => setPasswordRe(e.target.value)}
          className="form-control"
          disabled={loading}
          value={passwordRe}
        />
        <button className="btn btn-primary" disabled={loading}>
          Confirm
        </button>
      </div>
    </form>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <>
              <h4 className="text-center">Password Change</h4>
              <br />{" "}
            </>
          )}
          {passwordUpdateForm()}
          {showError()}
        </div>
      </div>
    </div>
  );
};

export default Password;
