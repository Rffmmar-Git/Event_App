import axios from "axios";

const API_URL = "http://localhost:5000";

export const getMyCoupons = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${API_URL}/coupons/my-coupons`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.data;
};