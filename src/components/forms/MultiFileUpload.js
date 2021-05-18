import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";

const MultiFileUpload = ({ values, setValues, setLoading }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const fileUploadAndResize = (e) => {
    // console.log(e.target.files);
    // resize
    let files = e.target.files;
    let allUploadedFiles = values.images;

    if (files) {
      setLoading(true);

      for (let i = 0; i < files.length; i++) {
        console.log("processing file # ", i);
        Resizer.imageFileResizer(
          files[i],
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
                  "Access-Control-Allow-Origin": "*", // test
                },
              })
              .then((res) => {
                console.log("Cloudinary url res is back: ", res);
                setLoading(false);
                allUploadedFiles.push(res.data);

                setValues({ ...values, images: allUploadedFiles });
              })
              .catch((err) => {
                setLoading(false);
                console.log("Cloudinary UPLOAD error: ", err);
              });
          }, // call back for img uri
          "base64" // output type
        );
      }
    }
    // send back to server for uploading to cloudinary
    // set url to images[] in the parent component state - ProductCreate
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
        const { images } = values;
        let filteredImages = images.filter((item) => {
          return item.public_id !== public_id;
        });
        setValues({ ...values, images: filteredImages });
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
          {values.images.length > 0 &&
            values.images.map((image) => (
              <div className="d-flex flex-column m-3" key={image.public_id}>
                <Avatar src={image.url} size={100} shape="square" />
                <Badge
                  count="remove"
                  onClick={() => handleImageRemove(image.public_id)}
                  style={{ cursor: "pointer" }}
                  className="btn m-2"
                ></Badge>
              </div>
            ))}
          {values.images.length === 0 && <label>No Image Selected </label>}
        </>
      </div>
      <br />
      <div className="row">
        <label className="btn btn-primary btn-raised">
          Image Upload
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};

export default MultiFileUpload;
