import React, {useEffect, useState} from 'react';

const Booking = (props) => {
    const time = props.booking.date.split("T")[1].split("+")[0]
    const year = props.booking.date.split("T")[0].split("-")[0]
    const month = props.booking.date.split("T")[0].split("-")[1]
    const day = props.booking.date.split("T")[0].split("-")[2]
    const [info,setInfo] = useState({picture: '', name: '', address: ''})
    async function fetchData() {
        if (props.received === true) {
            const postData = {
                date: props.booking.date,
                userid: props.booking.userid,
                flatid: props.booking.flatid
            }
            const response = await fetch(`https://localhost:7262/booking/getinfo/received`, {
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
            const data = await response.json();
            setInfo(data)
            if (response.status === 400) {
                response.json().then(error => {
                    alert(error.error);
                })
            }
        }
        else
        {
            const postData = {
                date: props.booking.date,
                userid: props.booking.userid,
                flatid: props.booking.flatid
            }
            const response = await fetch(`https://localhost:7262/booking/getinfo/sended`, {
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
            const data = await response.json();
            setInfo(data)
            if (response.status === 400) {
                response.json().then(error => {
                    alert(error.error);
                })
            }
        }
    }
    
    
    async function handleChange(e)
    {
        e.preventDefault()
        const response1 = await fetch(`https://localhost:7262/booking/${props.booking.id}/change`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:44463'
            },
            credentials: 'include'
        });
        console.log(response1)
        if (response1.status === 400) {
            response1.json().then(error => {
                alert(error.error);})
        }
        if (response1.status === 200) {
            alert("успешно")
        }
    }

    let cancelBtn = props.received === true ?
        <button className="flat-btn" onClick={handleChange} style={{width: "45%", marginTop: "5px"}}> Отменить </button>
        : <span></span>

    let acceptBtn = props.received === true ?
        <button className="flat-btn" onClick={handleChange} style={{width: "45%", marginTop: "5px"}}> Подтвердить </button>
        : <span></span>
    
    let allowed = props.booking.allowed? <span > 
            <div className="account-msg-text"  style={{color: "rgb(0 211 0)"}}> <span className="account-props" style={{color: "rgb(0 0 0)"}}>Подтверждено: </span> Да </div>
            {cancelBtn}</span>:
        <span> <div className="account-msg-text" style={{color: "rgb(255 0 0)"}}> <span className="account-props" style={{color: "rgb(0 0 0)"}}>Подтверждено: </span> Нет </div>
            {acceptBtn}</span>

    
        
    useEffect(()=>{
        fetchData();
    },[props])

    let msg = props.received === true ?
        <span style={{    display: "flex", flexDirection: "row",justifyContent: "space-between"}}>
            <div>
                <div className="account-msg-text"> <span className="account-props">От кого: </span> {info.name} </div>
                <div className="account-msg-text"> <span className="account-props">Про объявление: </span> {info.address}</div>
                <div className="account-msg-text"> <span className="account-props">Во сколько: </span> {time} {day}/{month}/{year}</div>
                {allowed}
            </div>
            <img src={info.picture} alt={props.booking.id}  style={{maxWidth:"400px", height: "250px"}}/>
        </span>
        :       <span style={{    display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <div>
                <div className="account-msg-text"> <span className="account-props">Кому: </span> {info.name}</div>
                <div className="account-msg-text"> <span className="account-props">Про объявление: </span> {info.address}</div>
                <div className="account-msg-text"> <span className="account-props">Во сколько: </span> {time} {day}/{month}/{year}</div>
                {allowed}
            </div>
            <img src={info.picture} alt={props.booking.id} style={{maxWidth:"400px", height: "250px"}}/>
        
    </span>
    return (
        <div>
            {msg}
            <hr className='hr-line'/>
        </div>
    );
};

export default Booking;