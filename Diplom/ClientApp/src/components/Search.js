import React, {useState} from 'react';
import './HomeStyle.css';
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
const Search = () => {
    const [search,setSearch] = useState({type: '', count: '',priceFrom: '', priceUpTo:'', address: '' })
    const navigate = useNavigate();
    const location = useLocation();
    
    async function onSearch(e)
    {
        e.preventDefault()
        /*const postData = {
            priceFrom: search.priceFrom,
            priceUpTo: search.priceUpTo,
            address: search.address,
            type: search.type,
            roomCount: search.count
        }*/
        const params = new URLSearchParams();
        if (search.priceFrom !== '') {params.append('priceFrom', search.priceFrom);}
        if (search.priceUpTo !== ''){params.append('priceUpTo', search.priceUpTo);}
        if (search.address !== '') {params.append('address', search.address);}
        if (search.type !== ''){params.append('type', search.type);}
        if (search.count !== ''){params.append('roomCount', search.count);}
        
        const url = `https://localhost:7262/flat/searching?${params.toString()}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:44463'
            },
            credentials: 'include'
        });
        console.log(response)
        
        /*const response = await fetch(`https://localhost:7262/flat/search`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:44463'
            },
            body: JSON.stringify(postData),
            credentials: 'include'
        });*/
        
    }
    
    async function handleClick(e) 
    {
        e.preventDefault();
        const searchParams = new URLSearchParams(location.search);
        if (search.priceFrom !== '') {searchParams.set('priceFrom', search.priceFrom);}
        if (search.priceUpTo !== ''){searchParams.set('priceUpTo', search.priceUpTo);}
        if (search.address !== '') {searchParams.set('address', search.address);}
        if (search.type !== ''){searchParams.set('type', search.type);}
        if (search.count !== ''){searchParams.set('roomCount', search.count);}
        navigate({
                pathname: '/ads',
                search: searchParams.toString()})
    }
    
    return (
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
                    <input className='searchInput' type='text' placeholder='Город, район, улица, номер дома'
                           value={search.address}
                           onChange={(event) => setSearch({...search,address:event.target.value})}/>
                    <button className='searchBtn' onClick={handleClick}>Поиск</button>
                </div>
            </form>
    );
};

export default Search;