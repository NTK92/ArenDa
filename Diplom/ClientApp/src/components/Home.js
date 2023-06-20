import React, {Component, useContext, useEffect, useRef, useState} from 'react';
import './HomeStyle.css';
import Carousel from "./Carousel";
import Search from "./Search";
import Modal from "./Modal";
import {Link, useNavigate} from "react-router-dom";
import { Context } from '../context'

const imgStyle = {
    background: 'url(/Images/flat1920x716.jpg)',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    height: 'calc(57vh - (57vh - 100%))',
    width: 'calc(100vw - (100vw - 100%))',
    opacity: 0.5,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0
};
function Home(){
    const {user,setUser,loggedInStatus,setStatus,checkLoginStatus} = useContext(Context)
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
    const [modalOpen, setModalOpen] = useState(false);
    
    async function fetchData() {
        const response = await fetch('https://localhost:7262/flat/byid',{method: 'GET',
            headers: { 'Content-type':'application/json' , 'Access-Control-Allow-Origin': 'https://localhost:44463'}});
        
        const data = await response.json();
        console.log(data);
        setFlats(data)
    }
    
    useEffect(()=>{
        fetchData();
    },[])
    
    let btn
    
    if (loggedInStatus === "LOGGED_IN")
    {
        btn = <div className='block' style={{alignContent: "center"}}>
            <div className='banner'>
                <img src={'/Images/banner.jpg'} alt={'banner'}/>
            </div>
            <Link to={`/account/new_ad`}>
            <button className='block-button'> Сдать в аренду </button></Link>
        </div>
    }
    else
    {
       btn = <div className='block' style={{alignContent: "center"}} >
           <div className='banner'>
               <img src={"/Images/banner.jpg"} alt={'banner'}/>
           </div>
           <button className='block-button' onClick={() => {
               setModalOpen(true);
           }}> Сдать в аренду </button>
           {modalOpen && <Modal setOpenModal={setModalOpen} />}
       </div>
    }
    
    return (
        <div className='container'>
            <div className='containerMain'>
                <div style={imgStyle}></div>
                <h1>
                    <span className='labelMain'>Найдём, где остановиться!</span>
                    <span className='smallLabelMain'>10 тысяч вариантов жилья в России</span>
                </h1>
                <Search/>
            </div>
            
            <div className='startPage'>
                <Carousel flats={flats}/>
                {btn}
                <div className='block'>
                    <div className='bannerPhones'>
                        <h3> ArenDA - доступна и на телефоне</h3>
                        <h4> Скачивайте наши бесплатные приложения </h4>
                        <div className='bannerLogos'>
                            <a href={'https://play.google.com/store/games?hl=ru&gl=US&pli=1'}>
                                <img src={'/Images/Logos/Google Play - rus.png'} alt='google play download'/>
                            </a>
                            <a href={'https://www.apple.com/ru/app-store/'}>
                                <img src={'/Images/Logos/App Store - rus.png'} alt='google play download'/>
                            </a>
                        </div>
                        <div className='bannerImgPhones'>
                            <a href={'https://play.google.com/store/games?hl=ru&gl=US&pli=1'}>
                                <img src={'/Images/android1.png'} alt='google play download'/>
                            </a>
                            <a href={'https://www.apple.com/ru/app-store/'}>
                                <img src={'/Images/iphone1.png'} alt='google play download'/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home
