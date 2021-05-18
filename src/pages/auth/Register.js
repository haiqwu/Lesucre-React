import React, { useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";

import jwt from "jsonwebtoken";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  const [email, setEmail] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const recaptchaRef = React.createRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter email");
    }
    const recaptchaValue = recaptchaRef.current.getValue();
    // console.log(recaptchaValue);
    if (!recaptchaValue) {
      return toast.error("Please enter reCAPTCHA");
    }

    const token = jwt.sign(
      { email },
      process.env.REACT_APP_JWT_ACC_ACTIVATION_KEY,
      { expiresIn: "20m" }
    );

    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL + "/" + token, // redirect url
      handleCodeInApp: true,
    };

    await auth.sendSignInLinkToEmail(email, config);

    // setDisableBtn(true);
    recaptchaRef.current.reset();
    toast.success(
      `Email has been sent, please go to your email to complete your registration.`
    );

    // save user email in local storage
    // window.localStorage.setItem("emailForRegistration", email);
    // clear state
    setEmail("");
  };

  const onReCaptchaChange = (value) => {
    // console.log("Captcha value:", value);
    // console.log("Ref val,", recaptchaRef.current.getValue());
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="form-control"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
      />
      <br />
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_CLIENT_KEY}
        onChange={onReCaptchaChange}
        className="mt-4"
      />
      <br />
      <button type="submit" className="btn btn-raised" disabled={disableBtn}>
        Register
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4> Enter your email to sign up </h4>

          {registerForm()}
        </div>
      </div>
    </div>
  );
};

export default Register;
