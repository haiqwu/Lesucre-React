import axios from "axios";

export const createZoneWithGBAndSD = async (b, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/zone`, b, {
    headers: {
      authtoken,
    },
  });

export const getAllZones = async () =>
  await axios.get(`${process.env.REACT_APP_API}/zones`);

export const getZoneById = async (id) =>
  await axios.get(`${process.env.REACT_APP_API}/zone/${id}`);

export const updateZoneWithGBAndSD = async (id, body, authtoken) =>
  await axios.put(`${process.env.REACT_APP_API}/zone/${id}`, body, {
    headers: {
      authtoken,
    },
  });
