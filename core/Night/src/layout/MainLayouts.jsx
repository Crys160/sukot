import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = ({ searchText, handelSearchText }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
   
    if (location.pathname === "/") {
      alert("You're already on the homepage!");  
    } else {
  
      navigate("/");
    }
  };

  return (
    <>
      <NavBar searchText={searchText} handelSearchText={handelSearchText} />
      
      
     

      <ToastContainer />
      <Outlet /> 
    </>
  );
};

export default MainLayout;
