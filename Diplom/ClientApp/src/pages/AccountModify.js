import React, {useContext, useState} from 'react';
import {Context} from "../context";
import {Link} from "react-router-dom";

const AccountModify = () => {
    const {user,setUser,loggedInStatus,setStatus,checkLoginStatus} = useContext(Context)
    const [modify,setModify] = useState({name: '', phoneMobile: ''})

    async function onSubmitModify() {
        const postData = {id: user.id, login: user.login, password: user.password,
            name: modify.name, phoneMobile: modify.phoneMobile}
        console.log(postData)
        const response1 = await fetch(`https://localhost:7262/account/modify`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:44463'
            },
            body: JSON.stringify(postData),
            credentials: 'include'
        });
        console.log(response1)
        if (response1.status === 400) {
            response1.json().then(error => {
                alert(error.error);})
        }
        if (response1.status === 200) {
            Modified()
        }
    }

    async function Modified()
    {
        const response = await fetch(`https://localhost:7262/user/${user.id}`,{method: 'GET',
            headers: { 'Content-type':'application/json' , 'Access-Control-Allow-Origin': 'https://localhost:44463'}});
        console.log(response);
        const data = await response.json();
        console.log(data);
        setUser(prevState => ({
            ...prevState,
            name: data.name, phoneMobile: data.phoneMobile
        }));
    }
    
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
                
                <div className="account-modify">
                    <span className="account-h">Изменить имя</span>
                    <input className='account-input' type='text' placeholder=''
                           value={modify.name}
                           onChange={(event) => setModify({...modify,name:event.target.value})}/>
                    <span className="account-h">Изменить номер</span>
                    <input className='account-input' type='text' placeholder=''
                           value={modify.phoneMobile}
                           onChange={(event) => setModify({...modify,phoneMobile:event.target.value})}/>
                    <button className='account-btn' onClick={onSubmitModify}>Изменить</button>
                </div>
            </div>
        </div>
    );
};

export default AccountModify;