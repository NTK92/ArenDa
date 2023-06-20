import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../context";
import "./PersonalAccountStyles.css"
import FlatItem from "../components/FlatItem";
import {Link} from "react-router-dom";
import Message from "../components/Message";
import Booking from "../components/Booking";

const PersonalAccount = () => {
    const {user,setUser,loggedInStatus,setStatus,checkLoginStatus} = useContext(Context)
    const [sBookingsExist, setSBookingsExist] = useState(false)
    const [rBookingsExist, setRBookingsExist] = useState(false)
    const [receivedBookings, setReceivedBookings] = useState([
        {
            id: '',
            date: '',
            userid: '',
            flatid: '',
            username: '',
            allowed: false
        }
    ])

    const [sendedBookings, setSendedBookings] = useState([
        {
            id: '',
            date: '',
            userid: '',
            receiverid: '',
            flatid: '',
            username: '',
            allowed: false
        }
    ])
    async function fetchData() {
        const response = await fetch(`https://localhost:7262/booking/${user.id}/receivedBookings`,{method: 'GET',
            headers: { 'Content-type':'application/json' , 'Access-Control-Allow-Origin': 'https://localhost:44463'}});
        console.log(response);
        const data = await response.json();
        console.log(data);
        setReceivedBookings(data)
        if(data.length !== 0)
        {
            setRBookingsExist(true)
        }

        const response1 = await fetch(`https://localhost:7262/booking/${user.id}/sendedBookings`,{method: 'GET',
            headers: { 'Content-type':'application/json' , 'Access-Control-Allow-Origin': 'https://localhost:44463'}});
        console.log(response1);
        const data1 = await response1.json();
        console.log(data1);
        setSendedBookings(data1)
        if(data1.length !== 0)
        {
            setSBookingsExist(true)
        }
        console.log(receivedBookings);
        console.log(sendedBookings);
    }
    useEffect(()=>{
        fetchData();
    },[])
    
    let snd_booking, rcvd_booking
    snd_booking  = sBookingsExist === false ? <div className="account-text"> Брони нет </div> : <span> {sendedBookings.map(bkng =>
    {
        return (
            <Booking booking={bkng} key={bkng.id} received={false}/>
        )})}
        </span>
    rcvd_booking = rBookingsExist === false ? <div className="account-text">Брони нет </div> : <span> {receivedBookings.map(bkng =>
    {
        return (
            <Booking booking={bkng} key={bkng.id} received={true}/>
        )})}</span>
    
    
    return (
        <div className="account-page">
            
            <div className="account-menu">
                <Link to={`/account/modify`}>
                    <button className="account-menu-btn">Изменить данные о себе</button></Link>
                <Link to={`/account/manage`}>
                    <button className="account-menu-btn">Управление объявлениями</button></Link>
                <Link to={`/account/new_ad`}>
                    <button className="account-menu-btn">Выставить объявление</button></Link>
                <Link to={`/account/messages`}>
                    <button className="account-menu-btn">Мои сообщения</button></Link>
            </div>
            <div className="account-block">
                <div className="account-title"> Здравствуйте, {user.name}!</div>
                <div className="account-text"> <span className="account-props">Имя, Фамилия: </span> {user.name}</div>
                <div className="account-text"> <span className="account-props">Номер телефона: </span> {user.phoneMobile}</div>
            </div>
            <div className="account-block">
                <div className="account-title"> Полученные брони </div>
                {rcvd_booking}
            </div>
            <div className="account-block">
                <div className="account-title"> Отправленные брони </div>
                {snd_booking }
            </div>
            
        </div>
    );
};

export default PersonalAccount;