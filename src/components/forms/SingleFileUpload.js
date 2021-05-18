import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";

const SingleFileUpload = ({ values, setValues, setLoading }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const fileUploadAndResize = (e) => {
    // console.log(e.target.files);
    // resize
    let files = e.target.files;

    if (files) {
      setLoading(true);

      console.log("processing 1 file ...");
      Resizer.imageFileResizer(
        files[0],
        720, // max width
        720, // max height
        "JPEG", // compress format
        100, // quality (highest 100)
        0, // rotation
        (uri) => {
          // console.log("URI back successfully #", uri);
          let formData = new FormData();
          formData.set("image", uri); // resized binary data

          axios
            .post(`${process.env.REACT_APP_API}/uploadimages`, formData, {
              headers: {
                authtoken: user ? user.token : "",
              },
            })
            .then((res) => {
              console.log("Cloudinary url res is back: ", res);
              setLoading(false);
              let newImage = res.data;
              setValues({ ...values, defaultImg: newImage });
            })
            .catch((err) => {
              setLoading(false);
              console.log("Cloudinary UPLOAD error: ", err);
            });
        }, // call back for img uri
        "base64" // output type
      );
    }
  };

  const handleImageRemove = (public_id) => {
    setLoading(true);
    console.log("remove image", public_id);
    axios
      .post(
        `${process.env.REACT_APP_API}/removeimage`,
        { public_id },
        {
          headers: {
            authtoken: user ? user.token : "",
          },
        }
      )
      .then((res) => {
        console.log("success del resp back ");
        setLoading(false);
        // const { defaultImg } = values;

        setValues({ ...values, defaultImg: {} });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="row">
        <>
          {values.defaultImg.url && (
            <div
              className="d-flex flex-column m-3"
              key={values.defaultImg.public_id}
            >
              <Avatar src={values.defaultImg.url} size={100} shape="square" />
              <Badge
                count="remove"
                onClick={() => handleImageRemove(values.defaultImg.public_id)}
                style={{ cursor: "pointer" }}
                className="btn m-2"
              ></Badge>
            </div>
          )}
          {!values.defaultImg.url && <label>No Image Selected </label>}
        </>
      </div>
      <br />
      {!values.defaultImg.url && (
        <div className="row">
          <label className="btn btn-primary btn-raised">
            Image Upload
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={fileUploadAndResize}
            />
          </label>
        </div>
      )}
    </>
  );
};

export default SingleFileUpload;
