import React, { Component } from 'react';
import NavMenu from './NavMenu';
import Footer from "./Footer";

function Layout(props) {
    
    
    
  return (
      <div className="container" style={{width: 'calc(100vw - (100vw - 100%))'}}>
          <NavMenu />
          {props.children}
          <Footer/>
      </div>
  );
}
export default Layout 