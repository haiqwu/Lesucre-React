import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import jwt from "jsonwebtoken";
import { createOrUpdateUser } from "../../functions/auth";

const RegisterComplete = ({ history, match }) => {
  let dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRe, setPasswordRe] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  // const { user } = useSelector((state) => ({ ...state }));

  // componentDidMount:
  useEffect(() => {
    console.log("componentDidMount");

    const token = match.params.urlparams;
    // decode token
    jwt.verify(
      token,
      process.env.REACT_APP_JWT_ACC_ACTIVATION_KEY,
      (err, decodedToken) => {
        if (err) {
          console.log("error : incorrect / expired link.");
          history.push("/page-expired");
        } else {
          const { email } = decodedToken;
          console.log(email);
          setEmail(email);
        }
      }
    );
  }, []);

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
    if (password == "" || passwordRe == "" || !password) {
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
    // 3.
    if (!nickname) {
      setError("You must provide a nickname");
      return;
    }

    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      // console.log(result);
      if (result.user.emailVerified) {
        // get user id token
        let user = auth.currentUser; // get the current logged in user from fireBase
        await user.updatePassword(password); // assign password
        await user.updateProfile({ displayName: nickname }); // assign displayName

        const idTokenResult = await user.getIdTokenResult();
        // redux store
        // console.log("user", user, "idTokenResult", idTokenResult);

        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                display_name: nickname,
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

        // redirect
        history.push("/");
      }
    } catch (error) {
      history.push("/page-expired");
      console.log(error);
      toast.error(error.message);
    }
  };

  const completeRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <input type="email" className="form-control" value={email} disabled />

      <br />

      <input
        type="text"
        className="form-control"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Enter nickname"
      />

      <br />
      <input
        type="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <br />
      <input
        type="password"
        className="form-control"
        value={passwordRe}
        onChange={(e) => setPasswordRe(e.target.value)}
        placeholder="Confirm your password"
      />
      <br />

      <button type="submit" className="btn btn-raised">
        Submit
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4> Complete your sign up </h4>

          {completeRegistrationForm()}
          {showError()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
