import React, {useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {Context} from "../context";

const AccountAddNew = () => {
    const {user,setUser,loggedInStatus,setStatus,checkLoginStatus} = useContext(Context)
    const [newFlat,setNewFlat] = useState({
        pictures: [],
        picture: '',
        price: '',
        city: '',
        street: '',
        houseNum: '',
        roomCount: '',
        apartmentArea: '',
        flatFloor: '',
        buildingFloor: '',
        animals: false,
        furniture: false,
        kids: false,
        type: '',
        description: '',
        userid: '',
        owner: false,
        realtor: false,
        district: '',
        utilityBills: '',
        percent: '',
        prepaymentMonths: '',
    })
    const [files,setFiles] = useState([])
    const [imagePreviewUrl,setImagePreviewUrl] = useState([])
    const handleOwnerCheckboxChange = () => {
        setNewFlat(prevState => ({
            ...prevState,
            owner: !newFlat.owner,
            realtor: false
        }))
    };
    const handleRealtorCheckboxChange = () => {
        setNewFlat(prevState => ({
            ...prevState,
            owner: false,
            realtor: !newFlat.realtor
        }))
    };

    useEffect(() => {
        console.log(files)
        setImagePreviewUrl([...files].map(file => URL.createObjectURL(file)))
        console.log(imagePreviewUrl)
    }, [files])
    
    async function onAdd(event) {
        event.preventDefault();
        if (files===[])
        {
            alert("Загрузите фотографию")
            return
        }
        console.log(files, imagePreviewUrl)
        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        console.log(formData)
        //formData.append("files", files);
        const response1 = await fetch(`https://localhost:7262/account/add_flat_pictures`, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': 'https://localhost:44463'
            },
            body: formData
        });
        console.log(response1)
        const data = await response1.json();
        console.log(data);
        setNewFlat(prevState => ({
            ...prevState,
            picture: data.fileName[0],
            pictures: data.fileName
        }))

        const postData = {
            price: newFlat.price,
            picture: data.fileName[0],
            pictures: data.fileName,
            address: 'г. '+newFlat.city + ', ул. '+ newFlat.street + ', д. '+newFlat.houseNum,
            roomCount: newFlat.roomCount,
            apartmentArea: newFlat.apartmentArea,
            floor: newFlat.flatFloor + '/' + newFlat.buildingFloor,
            animals: newFlat.animals,
            furniture: newFlat.furniture,
            kids: newFlat.kids,
            type: newFlat.type,
            description: newFlat.description,
            userid: user.id,
            owner: newFlat.owner,
            district: newFlat.district,
            utilityBills: newFlat.utilityBills,
            percent: newFlat.percent,
            prepaymentMonths: newFlat.prepaymentMonths,
            latitude: '',
            longitude: '',
        }
        postData.percent = newFlat.realtor === true? postData.percent : "0"
        
        const response2 = await fetch(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=e132cd7d-5f6b-4ee5-bf5b-9f3609f6e9b0&geocode=${postData.address}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:44463'
            }
        });
        console.log(response2);
        const data2 = await response2.json();
        console.log(data2);
        let rawCoords = data2.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
        postData.latitude = (+(rawCoords.split(" ")[0]))
        postData.longitude = (+(rawCoords.split(" ")[1]))
        console.log(postData)
        const response = await fetch(`https://localhost:7262/account/addNewFlat`, {
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
            
        }

    }
    
    /*let $imagePreview = null;
    if (imagePreviewUrl) {
        $imagePreview = (<img style={{height:"260px", width:'390px'}} src={imagePreviewUrl}  alt={$imagePreview}/>);
    } else {
        $imagePreview = (<div className="previewText"></div>);
    }*/
    /*<input className="fileInput"
           accept="image/*,.png,.jpeg,.jpg"
           type="file"
           onChange={handleImageChange} />
    <div className="imgPreview">
        {$imagePreview}
    </div>*/
    let realtorPercent = newFlat.realtor === true ?
        <div className="newFlat"><span className="account-text"> Процент от сделки: </span>
            <input className='account-input' type='text' placeholder='%'
                   value={newFlat.percent}
                   onChange={(event) => setNewFlat({...newFlat,percent :event.target.value})}/>
        </div> : <span></span>
    
    
    
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
                <div className="account-title">Выставить объявление </div>
                <form>
                    <div className="newFlat"><span className="account-text" style={{width:"287px"}}> Фотография квартиры: </span>
                            <div>
                                <input className="fileInput" onChange={(e) => setFiles(e.target.files)} type="file" accept="image/*,.png,.jpeg,.jpg" multiple />
                                {imagePreviewUrl.map((url, i) => <img width={100} height={100} key={i} src={url} />)}
                            </div>
                    </div>
                    <div className="newFlat">
                        <label>
                            <span className="account-text">Выставить объявление как</span>
                            <span className="account-text"> Собственник</span>
                            <input className="add-checkbox" type="checkbox" name="owner" checked={newFlat.owner} onChange={handleOwnerCheckboxChange}/>
                            <span className="account-text"> Риелтор</span>
                            <input className="add-checkbox" type="checkbox" name="realtor" checked={newFlat.realtor} onChange={handleRealtorCheckboxChange}/>
                        </label>
                    </div>
                    
                    {realtorPercent}
                    
                    <div className="newFlat"><span className="account-text"> Цена: </span>
                        <input className='account-input' type='text' placeholder='руб. в месяц'
                               value={newFlat.price}
                               onChange={(event) => setNewFlat({...newFlat,price :event.target.value})}/>
                    </div>
                    
                    <div className="newFlat"><span className="account-text"> Коммунальные услуги: </span>
                        <input className='account-input' type='text' placeholder='руб. в месяц'
                               value={newFlat.utilityBills}
                               onChange={(event) => setNewFlat({...newFlat,utilityBills :event.target.value})}/>
                    </div>

                    <div className="newFlat"><span className="account-text"> Предоплата: </span>
                        <select className='account-input' value={newFlat.prepaymentMonths} onChange={(event) => setNewFlat({...newFlat,prepaymentMonths :event.target.value})}>
                            <option value="" disabled selected>Количество месяцев</option>
                            <option value="0">Без предоплаты</option>
                            <option value="1">1 месяц</option>
                            <option value="2">2 месяца</option>
                            <option value="3">3 месяца</option>
                            <option value="4">4 месяца</option>
                            <option value="5">5 месяцев</option>
                            <option value="6">6 месяцев</option>
                            <option value="7">7 месяцев</option>
                            <option value="8">8 месяцев</option>
                            <option value="9">9 месяцев</option>
                            <option value="10">10 месяцев</option>
                            <option value="11">11 месяцев</option>
                            <option value="12">1 год</option>
                        </select>
                    </div>
                    
                    <div className="newFlat"><span className="account-text"> Район: </span>
                        <select className='account-input' value={newFlat.district} onChange={(event) => setNewFlat({...newFlat,district :event.target.value})}>
                            <option value="" disabled selected>Район</option>
                            <option value="Авиастроительный">Авиастроительный</option>
                            <option value="Вахитовский">Вахитовский</option>
                            <option value="Кировский">Кировский</option>
                            <option value="Московский">Московский</option>
                            <option value="Ново-Савиновский">Ново-Савиновский</option>
                            <option value="Приволжский">Приволжский</option>
                            <option value="Советский">Советский</option>
                        </select>
                    </div>
                    
                    <div className="newFlat">
                        <div className="account-text"> Адрес: </div>
                        <input className='account-input-secondary' type='text' placeholder='Город'
                               value={newFlat.city}
                               onChange={(event) => setNewFlat({...newFlat,city :event.target.value})}/>
                        <input className='account-input-secondary' type='text' placeholder='Улица'
                               value={newFlat.street}
                               onChange={(event) => setNewFlat({...newFlat,street :event.target.value})}/>
                        <input className='account-input-secondary' type='text' placeholder='Номер дома'
                               value={newFlat.houseNum}
                               style={{marginRight: 0}}
                               onChange={(event) => setNewFlat({...newFlat,houseNum :event.target.value})}/>
                    </div>
                    
                    <div className="newFlat"><span className="account-text"> Количество комнат: </span>
                        <input className='account-input' type='text' placeholder='число'
                               value={newFlat.roomCount}
                               onChange={(event) => setNewFlat({...newFlat,roomCount :event.target.value})}/>
                    </div>
                    
                    <div className="newFlat"><span className="account-text"> Общая площадь: </span>
                        <input className='account-input' type='text' placeholder='в кв. м'
                               value={newFlat.apartmentArea}
                               onChange={(event) => setNewFlat({...newFlat,apartmentArea :event.target.value})}/>
                    </div>
                    
                    <div className="newFlat"><span className="account-text"> Тип: </span>
                        <select className="account-input" type='text' value={newFlat.type}
                                onChange={(event) => setNewFlat({...newFlat,type :event.target.value})}>
                            <option value="" disabled selected> Квартира или Дом </option>
                            <option value="Квартира"> Квартира</option>
                            <option value="Дом"> Дом</option>
                        </select>
                    </div>
                    
                    <div className="newFlat"><span className="account-text"> На каком этаже квартира: </span>
                        <input className='account-input' type='text' placeholder='число'
                               value={newFlat.flatFloor}
                               onChange={(event) => setNewFlat({...newFlat,flatFloor :event.target.value})}/>
                    </div>
                    
                    <div className="newFlat"><span className="account-text"> Сколько этажей в доме: </span>
                        <input className='account-input' type='text' placeholder='число'
                               value={newFlat.buildingFloor}
                               onChange={(event) => setNewFlat({...newFlat,buildingFloor :event.target.value})}/>
                    </div>
                    
                    <div className="newFlat">
                        <label>
                            <span className="account-text">Можно с питомцами</span>
                            <input className="add-checkbox" type="checkbox" name="animals"
                               checked={newFlat.animals}
                               onChange={(event) => setNewFlat({...newFlat,animals:event.target.checked})}/>
                        </label>
                        <label>
                            <span className="account-text">Можно с детьми</span>
                            <input className="add-checkbox" type="checkbox" name="animals"
                               checked={newFlat.kids}
                               onChange={(event) => setNewFlat({...newFlat,kids:event.target.checked})}/>
                            </label>    
                        <label>
                            <span className="account-text">С мебелью</span>
                            <input className="add-checkbox" type="checkbox" name="animals"
                               checked={newFlat.furniture}
                               onChange={(event) => setNewFlat({...newFlat,furniture:event.target.checked})}/>
                            </label>
                    </div>
                    
                    <div className="newFlat"><span className="account-text"> Описание: </span>
                        <input className='account-input' type='text' placeholder='Дополнительная информация'
                               value={newFlat.description}
                               onChange={(event) => setNewFlat({...newFlat,description :event.target.value})}/>
                    </div>
                    
                    <div className="newFlat-btn">
                        <button className="add-btn" onClick={onAdd}> Добавить </button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
};

export default AccountAddNew;