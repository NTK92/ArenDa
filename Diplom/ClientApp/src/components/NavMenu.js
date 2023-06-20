import React, {Component, useContext, useState} from 'react';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { Context } from '../context'

function NavMenu() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const {loggedInStatus,setStatus,user,setUser} = useContext(Context)
  let btn;

    async function Logout() {
        const response = await fetch('https://localhost:7262/user/logout', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:44463'
            },
            credentials: 'include'
        });
        if(response.ok)
        {
            setUser({id:'',login:'',password:'',name:'',phoneMobile:'',flats:''})
            setStatus("NOT_LOGGED_IN")
        }
        else{
            alert('error logout')
        }
    }
  
  
  if (loggedInStatus === "LOGGED_IN")
  {
      btn = <div>
          <button className="navButton-account" onClick={() => navigate('/account')}>{user.name}</button>
                
          <button className="navButton-logout" onClick={Logout}> Выйти </button>
      </div>
  }
  else 
  {
      btn = <div>
          <button className="navButton"  onClick={() => {
          setModalOpen(true);
      }}> Войти </button>
      {modalOpen && <Modal setOpenModal={setModalOpen} />}
      </div>
  }
  return (
      <header>
          <div className="logo" onClick={() => navigate('/')}>
              <img className="logoImg" src="/Images/logo.png" alt="logo"/>
              <div className="logoText">ArenDA!</div>
          </div>
          {btn}
      </header>
  );
}
export default NavMenu

