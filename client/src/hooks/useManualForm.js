import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/actions";

export const useManualForm = (initialValues = {}) => {
  const [userData, setUserData] = useState(initialValues);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setUserData(initialValues);
  };

  const handleSubmit = (e,url) => {
    e.preventDefault();
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData),
      credentials: "include" // important to receive HttpOnly refresh token cookie
    })
      .then((response) => {
        if (!response.ok){console.log("Login error")};
        return response.json();
      })
      .then((data) => {
        dispatch(setUser({
          user: data.user,
          accessToken: data.accessToken,
        }));
        navigate("/dashboard")
      })
      .catch((err) => console.log(err));

  }

  return { userData, handleChange, setUserData, resetForm, handleSubmit };
};
