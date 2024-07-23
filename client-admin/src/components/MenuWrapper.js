import React from "react";
import { useLocation } from "react-router-dom";
import Menu from "./MenuComponent";

const MenuWrapper = () => {
  const location = useLocation();
  return <Menu location={location} />;
};

export default MenuWrapper;
