import React from 'react';
import './FlatItem.css'
const FlatItem = (props) => {
    let a,k,f
    a = props.flat.animals? "Да" : "Нет";
    k = props.flat.kids? "Да" : "Нет";
    f = props.flat.furniture? "Да" : "Нет";
    
    async function onDelete()
    {
        await fetch(`https://localhost:7262/account/flat/${props.flat.id}`,{method: 'DELETE',
            headers: { 'Access-Control-Allow-Origin': 'https://localhost:44463'}});
    }
    
    let btn;
    if (props.onManage === true)
    {
        btn = <button className="user-card-button" onClick={onDelete}>Удaлить</button>
    }
    else
    {
        btn = <span> </span>
    }
    return (
        <div className="user-flats">
            <div className='user-card'>
                <img src={props.flat.picture} alt={props.flat.id}/>
                <div className='user-card-description'>
                    <div className="account-text"> <span className="account-props">Адрес: </span> {props.flat.address}</div>
                    <div className="account-text"> <span className="account-props">Цена: </span> {props.flat.price}p/месяц </div>
                    <div className="account-text"> <span className="account-props">Тип: </span> {props.flat.type} </div>
                    <div className="account-text"> <span className="account-props">Количество комнат: </span>  {props.flat.roomCount}-комн. кв. </div>
                    <div className="account-text"> <span className="account-props">Общая плошадь: </span>  {props.flat.apartmentArea}м<sup style={{fontSize: 9}}>2</sup> </div>
                <div className="account-text"> <span className="account-props">Этаж: </span> {props.flat.floor} этаж</div>
                </div>
                    <div className='user-card-description'>
                    <div className="account-text"> <span className="account-props">Можно с животными: </span> {a}</div>
                    <div className="account-text"> <span className="account-props">Можно с детьми: </span> {k}</div>
                    <div className="account-text"> <span className="account-props">С мебелью: </span> {f}</div>
                </div>
            </div>
            {btn}
            <hr className='hr-line'/>
        </div>
    );
};

export default FlatItem;