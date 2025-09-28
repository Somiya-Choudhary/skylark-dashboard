import { useState } from "react";

export const useManualForm = (initialValues = {}) => {
  const [userData, setUserData] = useState(initialValues);

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

  return { userData, handleChange, setUserData, resetForm };
};
