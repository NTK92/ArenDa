import React from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination, Scrollbar} from "swiper";
import "swiper/swiper-bundle.min.css";
import CardItem from "./CardItem";
import "./HomeStyle.css";
import {useNavigate} from "react-router-dom";
const Carousel = ({flats}) => {
    const navigate = useNavigate();
    return (
            <div className='block'>
                <div className="blockTitle">
                    <div className='blockLabel'> Новые объявления:
                    </div>
                    <button onClick={() => navigate('/ads')}>Все объявления</button>
                </div>
               
                <Swiper
                    className='mySwiper'
                    modules={[Navigation, Pagination, Scrollbar]}
                    slidesPerView={3}
                    spaceBetween={5}
                    cssMode={true}
                    navigation
                    pagination={{ clickable: true }}
                    // scrollbar={{ draggable: true }}
                    onSwiper={(swiper) => console.log(swiper)}
                    onSlideChange={() => console.log('slide change')}>
                    {flats.map(flat =>
                    {
                        return (
                            <SwiperSlide key={flat.id} className='mySwiper-slide'>
                                    <CardItem flat={flat} key={flat.id}/>
                            </SwiperSlide>
                        )})}
                </Swiper>
            </div>
    );
};

export default Carousel;