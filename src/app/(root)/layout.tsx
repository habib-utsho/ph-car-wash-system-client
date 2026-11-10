import React from "react";
import Header from "@/components/shared/Header";
import Navbar from "@/components/shared/Navbar";

const RootLayout = ({ children }) => {
  return (
    <>
      <Header />
      <Navbar />
      {children}
    </>
  );
};

export default RootLayout;
