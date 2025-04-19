import axios from "axios";
import { signOut, useSession } from "next-auth/react";

const axiosSecure = axios.create({
    baseURL: 'https://chatify-server-1-1a8e.onrender.com/'
})

const UseAxiosSecure = () => {
  const { data: session, status } = useSession();
  
  // Handle the case when session is still loading
  if (status === 'loading') {
    return null; // Or handle it in some other way like showing a loading spinner
  }
  
  const token = session?.accessToken;

  // Request interceptor to add authorization header for every secure call to the API
  axiosSecure.interceptors.request.use(function (config) {
    // If there's no token, you might want to handle it here
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  }, function (error) {
    // Handle request error
    return Promise.reject(error);
  });

  // Intercepts 401 and 403 status
  axiosSecure.interceptors.response.use(function (response) {
    return response;
  }, async (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      await signOut({ redirect: true, callbackUrl: "/login" });
    }
    return Promise.reject(error);
  });

  return axiosSecure;
};

export default UseAxiosSecure;
