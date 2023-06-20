import React from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
const CardItem = (props) => {
    const navigate = useNavigate();
    const {id} = useParams();
    return(
        <Link to={`/flats/${props.flat.id}`}>
            <div className='card' >
                <div className='card-picture'>
                    <img src={props.flat.picture} alt={props.flat.id}/>
                </div>
                <div className='card-title'>
                    <h4> {props.flat.price}p/месяц </h4>
                </div>
                <div className='card-description'>
                <span className='address' >
                    {props.flat.address}
                </span>
                    <span className='roomCount'>
                    {props.flat.roomCount}-комн. кв.
                </span>
                    <span className='apartmentArea'>
                    {props.flat.apartmentArea} м<sup style={{fontSize: 9}}>2</sup>
                </span>
                    <span className='floor'>
                    {props.flat.floor} этаж
                </span>
                </div>
            </div>
        </Link>
    );
}

export default CardItem;