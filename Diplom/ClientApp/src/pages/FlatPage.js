import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import './FlatPageStyle.css';
import {Context} from "../context";
import {YMaps, Map, Placemark, withYMaps, Panorama} from '@pbe/react-yandex-maps';
import {Navigation, Pagination, Scrollbar} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
const FlatPage = () => {
    const {loggedInStatus,setStatus,user,setUser} = useContext(Context)
    const {id} = useParams()
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [flat, setFlat] = useState({
        id: '',
        price: '',
        address: '',
        roomCount: '',
        apartmentArea: '',
        floor: '',
        animals: '',
        furniture: '',
        kids: '',
        type: '',
        description: '',
        userid: '',
        username: '',
        userPhone: '',
        district: '',
        owner: false,
        utilityBills: '',
        percent: '',
        prepaymentMonths: ''
    })
    const [pics,setPics] = useState([
        {
            id: '',
            picture: ''
        }
    ])
    const [bools,setBools] = useState({
        animals: '',
        furniture: '',
        kids: ''})
    const [message,setMessage] = useState('')
    const [latitude,setLatitude] = useState(0.0)
    const [longitude,setLongitude] = useState(0.0)
    const [loaded, setLoaded] = useState(false)
    async function fetchData() {
        const response = await fetch(`https://localhost:7262/flat/${id}`,{method: 'GET',
            headers: { 'Content-type':'application/json' , 'Access-Control-Allow-Origin': 'https://localhost:44463'}});
        console.log(response);
        const data = await response.json();
        console.log(data);
        setFlat(data);
        
        //let address = data.address

        const response0 = await fetch(`https://localhost:7262/flat/pictures/${id}`,{method: 'GET',
            headers: { 'Content-type':'application/json' , 'Access-Control-Allow-Origin': 'https://localhost:44463'}});
        console.log(response0);
        const data0 = await response0.json();
        console.log(data0);
        setPics(data0)
        
        const response1 = await fetch(`https://localhost:7262/flat/userid/${id}`,{method: 'GET',
            headers: { 'Content-type':'application/json' , 'Access-Control-Allow-Origin': 'https://localhost:44463'}});
        console.log(response1);
        const data1 = await response1.json();
        console.log(data1);
        setFlat(prevState => ({
            ...prevState,
            username: data1.name, userPhone: data1.phoneMobile
        }))
        data.floor = data.floor.replace("/", " из ")
        let a,k,f;
        //Object.values(data).map((d) => d? "Да" : "Нет")
        a = data.animals? "Да" : "Нет";
        k = data.kids? "Да" : "Нет";
        f = data.furniture? "Да" : "Нет";
        setBools({...bools, animals: a,kids: k,furniture: f})
        setLatitude(+(data.latitude))
        setLongitude(+(data.longitude))
        setLoaded(true)
    }
    async function handleSend(e)
    {
        e.preventDefault();
        
        if (message==="")
        {
            alert("Пустое сообщение");
            return
        }
        const postData = {
            text: message,
            userid: user.id,
            receiverid: flat.userid,
            flatid: flat.id
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
        if (response.status === 200) {
            alert("Успешно");
        }
    }

    async function handleBook(e) {
        e.preventDefault();
        let isoDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
        const postData = {
            date: isoDate.split("T")[0]+"T"+time,
            userid: user.id,
            flatid: flat.id
        }
        console.log(postData)
        const response = await fetch(`https://localhost:7262/booking/book`, {
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
        if (response.status === 200) {
            alert("Успешно");
        }
    }
    
    
    useEffect(()=>{
        fetchData();
        console.log(bools)
        console.log(pics)
    },[id])
    
    let conn;
    if (loggedInStatus==="LOGGED_IN" && flat.userid !== user.id)
    {
        conn =<div>
            <div className='flat-h'>Связь с арендодателем</div>
                <ul>
                    <li>
                        <span className='flat-props'>Номер телефона:</span> {flat.userPhone}
                    </li>
                </ul>
            <div className='flat-h'>Написать арендодателю</div>
            <div className='flat-conn'>
                <input className='flat-form' type='text' placeholder=''
                       value={message}
                       onChange={(event) => setMessage(event.target.value)}/>
                <button className="flat-btn" onClick={handleSend}> Отправить </button>
            </div>
            <div className='flat-h' style={{marginTop:"10px"}}>Забронировать </div>
            <div className='flat-conn'     style={{flexDirection: "column"}}>
                <Calendar onChange={setDate} value={date} />
                <ul>
                    <li>
                        <span className='flat-props'>Время: </span> 
                        <input className='flat-form' type='text' placeholder='' value={time} 
                               onChange={(event) => setTime(event.target.value)}/>
                    </li>
                </ul>
                <button className="flat-btn"  onClick={handleBook}> Забронировать </button>
                
            </div>
            
            
        </div>
    }
    
    let yMap
    yMap = loaded? 
        <span>
            <YMaps query={{ apikey: 'e132cd7d-5f6b-4ee5-bf5b-9f3609f6e9b0' }}>
            <div style={{marginBottom:"10px"}}>
                <Map width={750} height={400} defaultState={{ center: [longitude, latitude], zoom: 14}}>
                <Placemark geometry={[longitude, latitude]} />
                </Map>
            </div>
                <Panorama width={750} height={400} defaultPoint={[longitude, latitude]} />
        </YMaps>
        </span>
        : <span></span>;
    
    
    let picSwiper;
    picSwiper = loaded?
            <Swiper
                className='flat-Swiper'
                modules={[Navigation, Pagination, Scrollbar]}
                slidesPerView={1}
                cssMode={true}
                navigation
                pagination={{ clickable: true }}>
                {pics.map(p => {
                    return (
                        <SwiperSlide key={p.id} className='flat-Swiper-slide'>
                            <img src={p.picture} alt={p.id}/>
                        </SwiperSlide>)
                })}
            </Swiper>
        : <span></span>;
    
    let owner;
    owner = flat.owner?  <li>
        <span className='flat-props'>Собственник:</span> Да
    </li> :
        <li>
            <span className='flat-props'>Собственник:</span> Нет, процент риелтору: {flat.percent}%
        </li>

    let prepayment;
    prepayment = flat.prepaymentMonths === 0 ? <li>
        <span className='flat-props'>Предоплата:</span> Отсутсвует
    </li> : <li>
        <span className='flat-props'>Предоплата:</span> {flat.prepaymentMonths} месяц
    </li>
    
    return (
        <div className="flat-page">
            <div className="flat-block">
                <div className="flat-title">
                    <span className='flat-roomCount'>
                            {flat.type},
                    </span>
                    <span className='flat-roomCount'>
                            {flat.roomCount}-комнатная 
                    </span>
                    
                </div>
                <div className='flat-main'>
                    {picSwiper}
                    <div className="flat-info">
                        <div className='flat-h'>О квартире</div>
                        <ul>
                            <li>
                                <span className='flat-props'>Цена:</span> {flat.price}p/месяц
                            </li>
                            <li>
                                <span className='flat-props'>Коммунальные платежи:</span> {flat.utilityBills} р/месяц
                            </li>
                            {prepayment}
                            <li>
                                <span className='flat-props'>Адрес: </span>
                                {flat.address}
                            </li>
                            <li>
                                <span className='flat-props'>Количество комнат: </span>
                                {flat.roomCount}
                            </li>
                            <li>
                                <span className='flat-props'>Общая площадь: </span>
                                {flat.apartmentArea} м<sup style={{fontSize: 14}}>2</sup>
                            </li>
                            <li>
                                <span className='flat-props'>Этаж: </span>
                                {flat.floor}
                            </li>
                            <li>
                                <span className='flat-props'>Арендодатель: </span>
                                {flat.username}
                            </li>
                            {owner}
                        </ul>
                    </div>
                </div>
                <div className="flat-info">
                    <div className='flat-h'>Правила</div>
                    <ul>
                        <li>
                            <span className='flat-props'>Можно с животными: </span>
                            {bools.animals}
                        </li>
                        <li>
                            <span className='flat-props'>Можно с детьми: </span>
                            {bools.kids}
                        </li>
                        <li>
                            <span className='flat-props'>С мебелью: </span>
                            {bools.furniture}
                        </li>
                    </ul>
                    <div className='flat-h'>Описание</div>
                    <ul>
                        <li>
                            <span className='flat-props'>{flat.description}</span>
                            
                        </li>
                    </ul>
                    
                    <div className='flat-h'>Расположение</div>
                    <ul>
                        <li>
                            <span className='flat-props'>Адрес:</span> {flat.address}
                        </li>
                        <li>
                            <span className='flat-props'>Район:</span> {flat.district}
                        </li>
                    </ul>
                    <div className='map'>
                        {yMap}
                    </div>

                    {conn}
                </div>
            </div>
        </div>
    );
};

export default FlatPage;
