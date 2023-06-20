import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../context";
import {Link} from "react-router-dom";
import FlatItem from "../components/FlatItem";
import Message from "../components/Message";

const AccountMessages = () => {
    const {user,setUser,loggedInStatus,setStatus,checkLoginStatus} = useContext(Context)
    const [sMessagesExist, setSMessagesExist] = useState(false)
    const [rMessagesExist, setRMessagesExist] = useState(false)
    const [receivedMessages, setReceivedMessages] = useState([
        {
            id: '',
            text: '',
            time: '',
            userid: '',
            receiverid: '',
            flatid: '',
            username: ''
        }
    ])

    const [sendedMessages, setSendedMessages] = useState([
        {
            id: '',
            text: '',
            time: '',
            userid: '',
            receiverid: '',
            flatid: '',
            username: ''
        }
    ])
    async function fetchData() {
        const response = await fetch(`https://localhost:7262/message/${user.id}/receivedmessages`,{method: 'GET',
            headers: { 'Content-type':'application/json' , 'Access-Control-Allow-Origin': 'https://localhost:44463'}});
        console.log(response);
        const data = await response.json();
        console.log(data);
        setReceivedMessages(data)
        if(data.length !== 0)
        {
            setRMessagesExist(true)
        }
        
        const response1 = await fetch(`https://localhost:7262/message/${user.id}/sendedmessages`,{method: 'GET',
            headers: { 'Content-type':'application/json' , 'Access-Control-Allow-Origin': 'https://localhost:44463'}});
        console.log(response1);
        const data1 = await response1.json();
        console.log(data1);
        setSendedMessages(data1)
        if(data1.length !== 0)
        {
            setSMessagesExist(true)
        }
        console.log(receivedMessages);
        console.log(sendedMessages);
    }
    
    useEffect(()=>{
        fetchData();
    },[])
    
    let snd_msgs, rcvd_msgs
    snd_msgs  = sMessagesExist === false ? <div className="account-text"> Сообщений нет </div> : <span> {sendedMessages.map(msg =>
    {
        return (
            <Message message={msg} key={msg.id} received={false}/>
        )})}
        </span>
    rcvd_msgs = rMessagesExist === false ? <div className="account-text">Сообщений нет </div> : <span> {receivedMessages.map(msg =>
    {
        return (
            <Message message={msg} key={msg.id} received={true}/>
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
                <div className="account-title"> Полученные сообщения </div>
                {rcvd_msgs}
            </div>
            <div className="account-block">
                <div className="account-title"> Отправленные сообщения </div>
                {snd_msgs }
            </div>
        </div>
    );
};

export default AccountMessages;