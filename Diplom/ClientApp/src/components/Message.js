import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../context";

const Message = (props) => {
    const {user,setUser,loggedInStatus,setStatus,checkLoginStatus} = useContext(Context)
    const [username,setUsername] = useState('')
    const [message,setMessage] = useState('')
    const [flatAddress,setFlatAddress] = useState('')
    const time = props.message.time.split("T")[1].split("+")[0]
    const year = props.message.time.split("T")[0].split("-")[0]
    const month = props.message.time.split("T")[0].split("-")[1]
    const day = props.message.time.split("T")[0].split("-")[2]

    async function fetchData() {
        if (props.received === true) {
            const response = await fetch(`https://localhost:7262/message/${props.message.id}/userid`, {
                method: 'GET',
                headers: {'Content-type': 'application/json', 'Access-Control-Allow-Origin': 'https://localhost:44463'}
            });
            console.log(response);
            const data = await response.json();
            setUsername(data.name)

            const response1 = await fetch(`https://localhost:7262/message/${props.message.id}/flatid`, {
                method: 'GET',
                headers: {'Content-type': 'application/json', 'Access-Control-Allow-Origin': 'https://localhost:44463'}
            });
            console.log(response1);
            const data1 = await response1.json();
            setFlatAddress(data1.address)
        } 
        else
        {
            const response = await fetch(`https://localhost:7262/message/${props.message.id}/receiverid`, {
                method: 'GET',
                headers: {'Content-type': 'application/json', 'Access-Control-Allow-Origin': 'https://localhost:44463'}
            });
            console.log(response);
            const data = await response.json();
            setUsername(data.name)
            
            const response1 = await fetch(`https://localhost:7262/message/${props.message.id}/flatid`, {
                method: 'GET',
                headers: {'Content-type': 'application/json', 'Access-Control-Allow-Origin': 'https://localhost:44463'}
            });
            console.log(response1);
            const data1 = await response1.json();
            setFlatAddress(data1.address)
        }
    }

    async function handleSend(e)
    {
        e.preventDefault();
        const postData = {
            text: message,
            userid: user.id,
            receiverid: props.message.userid,
            flatid: props.message.flatid
        }
        console.log(postData)
        const response = await fetch(`https://localhost:7262/message/send`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:44463'
            },
            body: JSON.stringify(postData),
            credentials: 'include'
        });
        console.log(response)
        if (response.status === 400) {
            response.json().then(error => {
                alert(error.error);
            })
        }
    }

    useEffect(()=>{
        fetchData();
    },[])

    let msg = props.received === true ?
        <span>
        <div className="account-msg-text"> <span className="account-props">От кого: </span> {username}</div>
            <div className="account-msg-text"> <span className="account-props">Про объявление: </span> {flatAddress}</div>
        <div className="account-msg-text"> <span className="account-props">Сообщение: </span> {props.message.text} </div>
            <div className="account-msg-text"> <span className="account-props">Во сколько: </span> {time} {day}/{month}/{year}</div>
        <div className='flat-conn'>
        <input className='flat-form' type='text' placeholder=''
            value={message}
            onChange={(event) => setMessage(event.target.value)}/>
            <button className="flat-btn" onClick={handleSend}> Отправить </button>
        </div></span>
:       <span>
            <div className="account-msg-text"> <span className="account-props">Кому: </span> {username}</div>
            <div className="account-msg-text"> <span className="account-props">Про объявление: </span> {flatAddress}</div>
            <div className="account-msg-text"> <span className="account-props">Сообщение: </span> {props.message.text}</div>
            <div className="account-msg-text"> <span className="account-props">Во сколько: </span> {time} {day}/{month}/{year}</div>
</span>
    return (
        <div>
            {msg}
            <hr className='hr-line'/>
        </div>
    );
};

export default Message;