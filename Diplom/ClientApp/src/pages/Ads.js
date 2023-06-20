import React, {useEffect, useState} from 'react';
import Search from "../components/Search";
import '../components/SearchStyle.css';
import CardItem from "../components/CardItem";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
const imgStyle = {
    background: 'url(/Images/background1.jpg)',
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
const Ads = () => {
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
    const [loaded, setLoaded] = useState(false)
    const [flatExist, setFlatExist] = useState(false)
    const [searchParams] = useSearchParams();
    const [search,setSearch] = useState(
        {type: '', count: '',priceFrom: '',
            priceUpTo:'', address: '', animals: false, kids: false, furniture: false, owner: false})
    const navigate = useNavigate();
    async function fetchData() {
        if (loaded) return ;
        
        const currentParams = Object.fromEntries([...searchParams])
        console.log(currentParams)
        if (searchParams.toString() === '')
        {
            const response = await fetch('https://localhost:7262/flat',{method: 'GET',
                headers: { 'Content-type':'application/json' , 'Access-Control-Allow-Origin': 'https://localhost:44463'}});
            const data = await response.json();
            console.log(data);
            setFlats(data)
            if(data.length !== 0)
            {
                setFlatExist(true)
            }
            else
            {
                setFlatExist(false)
            }
        }
        else {
            console.log(searchParams.toString())
            const url = `https://localhost:7262/flat/searching?${searchParams.toString()}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': 'https://localhost:44463'
                },
                credentials: 'include'
            });
            //console.log(postData)
            const data = await response.json();
            console.log(response)
            setFlats(data)
            if(data.length !== 0)
            {
                setFlatExist(true)
            }
            else
            {
                setFlatExist(false)
            }
        }
        setLoaded(true)
    }

    useEffect(()=>{
        fetchData();
        console.log(flatExist)
    },[flats])
    
    async function onSearch(e)
    {
        e.preventDefault()
        navigate({
            pathname: '/ads'
        })
        const params = new URLSearchParams();
        if (search.priceFrom !== '') {params.append('priceFrom', search.priceFrom);}
        if (search.priceUpTo !== ''){params.append('priceUpTo', search.priceUpTo);}
        if (search.address !== '') {params.append('address', search.address);}
        if (search.type !== ''){params.append('type', search.type);}
        if (search.count !== ''){params.append('roomCount', search.count);}
        if (search.animals !== '') {params.append('animals', search.animals);}
        if (search.kids !== ''){params.append('kids', search.kids);}
        if (search.furniture !== ''){params.append('furniture', search.furniture);}
        if (search.owner !== ''){params.append('owner', search.owner);}

        const url = `https://localhost:7262/flat/searching?${params.toString()}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:44463'
            },
            credentials: 'include'
        });
        const data = await response.json();
        console.log(data)
        if(data.length !== 0)
        {
            setFlatExist(true)
        }
        else 
        {
            setFlatExist(false)
        }
        setFlats(data)

        /*const postData = {
            priceFrom: search.priceFrom,
            priceUpTo: search.priceUpTo,
            address: search.address,
            type: search.type,
            roomCount: search.count,
            animals: search.animals,
            kids: search.kids,
            furniture: search.furniture
        }
        console.log(postData)
        const response = await fetch(`https://localhost:7262/flat/search`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:44463'
            },
            body: JSON.stringify(postData),
            credentials: 'include'
        });
        const data = await response.json();
        console.log(response)
        setFlats(data)*/
    }

    async function onReset(e)
    {
        e.preventDefault()
        navigate({
            pathname: '/ads'
        })
        console.log(searchParams)
        setSearch({type: '', count: '',priceFrom: '',
            priceUpTo:'', address: '', animals: false, kids: false, furniture: false, owner: false })
    }
    
    let ads 
    ads = flatExist === true ? <div className='ads'>
        {flats.map(flat =>
        {
            return (
                <CardItem flat={flat} key={flat.id}/>
            )})}
    </div> : <div className='ads'> Подходящих объявлений нет
    </div>
        
    
    return (
        <div className='container'>
            <div className='containerMain-filter'>
                <div style={imgStyle}></div>
                <h1>
                    <span className='labelMain'> Поиск по фильтрам </span>
                </h1>
                <div className="filter-block">
                <form>
                    <div className='searchMain'>
                        <select value={search.type} onChange={(event) => setSearch({...search,type:event.target.value})}>
                            <option value="" disabled selected>Квартира/Дом</option>
                            <option value="Квартира"> Квартира</option>
                            <option value="Дом"> Дом</option>
                        </select>
                        <div></div>
                        <select value={search.count} onChange={(event) => setSearch({...search,count:event.target.value})}>
                            <option value="" disabled selected>Кол-во комнат</option>
                            <option value="1">1-комн.</option>
                            <option value="2">2-комн.</option>
                            <option value="3">3-комн.</option>
                            <option value="4">4+ комн.</option>
                        </select>
                        <div></div>
                        <input className='searchPriceInput' type='text' placeholder='Цена от (р/месяц)'
                               value={search.priceFrom}
                               onChange={(event) => setSearch({...search,priceFrom:event.target.value})}/>
                        <div></div>
                        <input className='searchPriceInput' type='text' placeholder='Цена до (р/месяц)'
                               value={search.priceUpTo}
                               onChange={(event) => setSearch({...search,priceUpTo:event.target.value})}/>
                        <div></div>
                        <input className='searchInput' type='text' placeholder='Город, улица, номер дома, район'
                               value={search.address}
                               onChange={(event) => setSearch({...search,address:event.target.value})}/>
                        
                        <label>
                        <input className="filter-checkbox" type="checkbox" name="animals"
                               checked={search.animals} 
                               onChange={(event) => setSearch({...search,animals:event.target.checked})}/>
                            Можно с питомцами
                        </label>
                        <div></div>
                        <label>
                            <input className="filter-checkbox" type="checkbox" name="kids"
                                   checked={search.kids}
                                   onChange={(event) => setSearch({...search,kids:event.target.checked})}/>
                            Можно с детьми
                        </label>
                        <div></div>
                        <label>
                            <input className="filter-checkbox" type="checkbox" name="furniture" 
                                   checked={search.furniture}
                                   onChange={(event) => setSearch({...search,furniture:event.target.checked})}/>
                                С мебелью
                        </label>
                        <div></div>
                        <label>
                            <input className="filter-checkbox" type="checkbox" name="furniture"
                                   checked={search.owner}
                                   onChange={(event) => setSearch({...search,owner :event.target.checked})}/>
                            От собственника
                        </label>
                        <button className='searchBtn' onClick={onSearch}>Поиск</button>
                        <button className='resetBtn' onClick={onReset}>Сбросить</button>
                    </div>
                </form>
                </div>
            </div>
            <div className='startPage'>
                <div className='block'>
                    <div className="blockTitle">
                        <div className='blockLabel'> Все объявления:</div>
                    </div>
                    {ads}
                </div> 
            </div>
        </div>
    );
};

export default Ads;