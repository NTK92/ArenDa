import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../context";
import {Link} from "react-router-dom";
import FlatItem from "../components/FlatItem";
import Message from "../components/Message";

const AccountManage = () => {
    const {user,setUser,loggedInStatus,setStatus,checkLoginStatus} = useContext(Context)
    const [flatsExist, setFlatsExist] = useState(false)
    const [flats, setFlats] = useState([
        {
            id: '',
            picture: '',
            price: '',
            address: '',
            roomCount: '',
            apartmentArea: '',
            floor: ''
        }
    ])
    async function fetchData() {
        const response = await fetch(`https://localhost:7262/account/${user.id}/flats`,{method: 'GET',
            headers: { 'Content-type':'application/json' , 'Access-Control-Allow-Origin': 'https://localhost:44463'}});
        console.log(response);
        const data = await response.json();
        console.log(data);
        if(data.length !== 0)
        {
            setFlatsExist(true)
        }
        setFlats(data)
        //const updatedFlats = [...flats, newCar];
        /*setFlats(
            flats.filter(a => a.id !== flats.id)
        );*/
        /*setFlats(prevState => [{
            ...prevState,
            id: data.name,
            picture: data.picture,
            price: data.price,
            address: data.address,
            roomCount: data.roomCount,
            apartmentArea: data.apartmentArea,
            floor: data.floor
        }]);*/
    }
    
    useEffect(()=>{
        fetchData();
    },[])
    let user_flats
    user_flats  = flatsExist === false ? <div className="account-text"> Объявлений нет </div> : <span> {flats.map(flat =>
    {
        return (
            <FlatItem flat={flat} key={flat.id} onManage={true}/>
        )})}
        </span>
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
                <div className="account-title">Выставленные объявления: </div>
                {user_flats}
            </div>
        </div>
    );
};

export default AccountManage;