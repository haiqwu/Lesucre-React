import axios from "axios";

export const createProductOption = async (opt, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/product-option`, opt, {
    headers: {
      authtoken,
    },
  });
