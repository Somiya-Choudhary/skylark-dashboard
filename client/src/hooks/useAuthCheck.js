import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/actions';

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Refresh the access token
        const refreshResponse = await fetch("http://localhost:3000/auth/refresh", {
          method: "GET",
          credentials: "include"
        });

        if (!refreshResponse.ok) {
          throw new Error("Not authenticated");
        }

        const { accessToken } = await refreshResponse.json();

        // Fetch user data with new access token
        const userResponse = await fetch("http://localhost:3000/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          credentials: "include"
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user");
        }

        const userData = await userResponse.json();

        // Update Redux state
        dispatch(setUser({
          user: userData.user,
          accessToken: accessToken
        }));

      } catch (err) {
        console.log("Auth check failed:", err);
        navigate("/login");
      }
    };

    checkAuth();
  }, [dispatch, navigate]);
};