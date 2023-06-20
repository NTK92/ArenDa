import React, {Component, useEffect, useReducer, useState} from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Layout  from './components/Layout';
import './custom.css';
import { Context } from './context'


function App() {
    const [loggedInStatus,setStatus] = useState("NOT_LOGGED_IN");
    const [user,setUser] = useState({id:'',login:'',password:'',name:'',phoneMobile:'',flats:''});
    const checkLoginStatus = async() =>  {
        const response = await fetch('https://localhost:7262/user/auth', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:44463'
            },
            credentials: 'include'
        });
        const user = await response.json();
        if(response.ok)
        {
            setUser(user)
            setStatus("LOGGED_IN")
        }
        else{
            setUser({id:'',login:'',password:'',name:'',phoneMobile:'',flats:''})
            setStatus("NOT_LOGGED_IN")
        }
    }
    
    useEffect(()=>{
        checkLoginStatus();
    },[loggedInStatus])
    
    return (
        <Context.Provider value={{loggedInStatus,setStatus,user,setUser,checkLoginStatus}}>
            
            <Layout>
                <Routes>
                {AppRoutes.map((route, index) => {
                    const { element, ...rest } = route;
                    return <Route key={index} {...rest} element={element} exact={route.exact}/>;
                })}
                </Routes>
            </Layout>
        </Context.Provider>
    );
}

export default App;

