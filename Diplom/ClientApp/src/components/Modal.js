import React, {useContext, useRef, useState} from 'react';
import "./ModalStyle.css"
import {Context} from "../context";
import ReCAPTCHA from "react-google-recaptcha";

function Modal({ setOpenModal }) {
    const [isRegistration, setRegistration] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [checkPassed, setCheckPassed] = useState(false);
    const [code,setCode] = useState('');
    const [info, setInfo] = useState({login: '', password: '', PhoneMobile: '', name: '', repeatPassword: ''});
    const {setStatus, user, setUser} = useContext(Context)
    const captchaRef = useRef(null)
    
    async function onSignInNoTwoFactor(event) {
        event.preventDefault();
        const token = captchaRef.current.getValue();
        if (token===null || token==='')
        {
            alert("Пройдите капчу")
            return;
        }
        if (info.login === '' || info.password === '')
        {
            alert("Заполнены не все поля");
            return;
        }
        console.log(token)
        //window.myCSRFRequestToken = "@antiforgery.GetAndStoreTokens(context).RequestToken)";
        //console.log(window.myCSRFRequestToken)
        const postData = {login: info.login, password: info.password, captcha: token}
        console.log(postData)
        const response = await fetch('https://localhost:7262/user/signin/notwofactor', {
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
                alert(error.error);})
        }
        else if (response.status === 200 || response.status === 201 ) {
            setOpenModal(false)
            setUser(user)
            setStatus("LOGGED_IN")
        }
        captchaRef.current.reset();
    }
    
    
    async function onSignIn(event) {
        event.preventDefault();
        const token = captchaRef.current.getValue();
        if (token === null || token === '') {
            alert("Пройдите капчу")
            return;
        }
        if (info.login === '' || info.password === '') {
            alert("Заполнены не все поля");
            return;
        }
        console.log(token)
        //window.myCSRFRequestToken = "@antiforgery.GetAndStoreTokens(context).RequestToken)";
        //console.log(window.myCSRFRequestToken)
        const postData = {login: info.login, password: info.password, captcha: token}
        console.log(postData)
        const response = await fetch('https://localhost:7262/user/signin', {
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
        } else if (response.status === 200 || response.status === 201) {
            alert("Введите код, отправленный на почту");
            //setOpenModal(false)
            setTwoFactor(true)
        }
        //captchaRef.current.reset();
    }

    async function onSignInTwoFactor(event)
    {
        //console.log(code)
        event.preventDefault();
        const postData = {
            code: code,
            login: info.login,
            password: info.password
        }
        console.log(postData)
        const response = await fetch('https://localhost:7262/user/signin/twofactor', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:44463'
            },
            body: JSON.stringify(postData)
        });
        const user = await response.json();
        console.log(response)
        if (response.status === 400) {
            response.json().then(error => {
                alert(error.error);
            })}
        else if (response.status !== 200 && response.status !== 201) {
                throw new Error(`Request failed: ${response.status}`);
        } 
        else if (response.status === 200 || response.status === 201) {
            setOpenModal(false)
            setUser(user)
            console.log(user)
            setStatus("LOGGED_IN")
        }
        
    }
    function Validation()
    {
        if (info.login === '' || info.password === '' || info.name === '' || info.PhoneMobile === '' || info.repeatPassword === '') {
            alert("Заполнены не все поля");
            return false;
        }
        if (info.password.length < 8) {
            alert("Пароль должен быть не менее 8 символов");
            return false;
        }
        if (!/\d/.test(info.password)) {
            alert("Пароль должен содержать хотя бы одну цифру");
            return false;
        }
        if (!/[A-z]/.test(info.password)) {
            alert("Пароль должен содержать хотя бы одну латинскую букву");
            return false;
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(info.password)) {
            alert("Пароль должен содержать хотя бы один специальный символ");
            return false;
        }
        if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(info.password)) {
            alert("Пароль должен состоять из не менее восьми знаков, включать латинские буквы, цифры и специальные символы.");
            return false;
        }
        if (info.password !== info.repeatPassword) {
            alert("Пароли не совпадают");
            return false;
        }
        return true;
    }
    
    async function onSubmitRegistration(event) {
        console.log(info)
        event.preventDefault();
        let valid = Validation();
        if (!valid) {
            return;
        }
        const token = captchaRef.current.getValue();
        if (token === null || token === '') {
            alert("Пройдите капчу")
            return;
        }
        const postData = {
            login: info.login,
            password: info.password,
            name: info.name,
            PhoneMobile: info.PhoneMobile,
            captcha: token
        }
        console.log(postData)
        const response = await fetch('https://localhost:7262/user/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:44463'
            },
            body: JSON.stringify(postData)
        });
        console.log(response)
        if (response.status === 400) {
            response.json().then(error => {
                alert(error.error);
            })
        } else if (response.status !== 200 && response.status !== 201) {
            throw new Error(`Request failed: ${response.status}`);
        } else if (response.status === 200 || response.status === 201) {
            alert("Для дальнейшей регистрации введите код, отправленный на почту");
            //setOpenModal(false)
            setTwoFactor(true)
        }
    }

    async function onRegisterTwoFactor(event){
        console.log(code)
        event.preventDefault();
        const postData = {
            code: code 
        }
        console.log(postData)
        const response = await fetch('https://localhost:7262/user/register/twofactor', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:44463'
            },
            body: JSON.stringify(postData)
        });
        console.log(response)
        if (response.status === 400) {
            response.json().then(error => {
                alert(error.error);
            })
        } else if (response.status !== 200 && response.status !== 201) {
            throw new Error(`Request failed: ${response.status}`);
        } else if (response.status === 200 || response.status === 201) {
            alert("Вы успешно зарегестрированы, можете войти в аккаунт");
            setTwoFactor(false)
            setOpenModal(false)
        }
    }

    async function handleForgotPassword(e)
    {
        e.preventDefault();
        const token = captchaRef.current.getValue();
        if (token===null || token==='')
        {
            alert("Пройдите капчу")
            return;
        }
        if (info.login === '')
        {
            alert("Заполните почту, связанную с аккаунтом");
            return;
        }
        const postData = {login: info.login, password: info.password, captcha: token}
        console.log(postData)
        const response = await fetch('https://localhost:7262/user/forgotpassword', {
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
        } else if (response.status === 200 || response.status === 201) {
            alert("Введите код, отправленный на почту");
            //setOpenModal(false)
            setForgotPassword(true);
        }
    }
    
    async function onCheckCode(event) {
        event.preventDefault();
        const postData = {code: code,
            login: info.login,
            password: info.password}
        console.log(postData)
        const response = await fetch('https://localhost:7262/user/checkcode', {
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
        } else if (response.status === 200 || response.status === 201) {
            alert("Успешно, теперь придумайте новый пароль");
            //setOpenModal(false)
            setCheckPassed(true);
            setForgotPassword(false);
        }
    }

    async function onResetPassword(event) {
        event.preventDefault();
        const postData = {
            login: info.login,
            password: info.password}
        console.log(postData)
        const response = await fetch('https://localhost:7262/user/resetpassword', {
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
        } else if (response.status === 200 || response.status === 201) {
            alert("Успешно");
            setOpenModal(false)
        }
    }
    
    if(checkPassed === true)
    {
        return (
            <div className="modalBackground">
                <div className="modalContainer">
                    <div className="modalTitle">
                        <h1>Придумайте новый пароль</h1>
                        <div className="modalTitleCloseBtn">
                            <button onClick={() => {setOpenModal(false);}}> X </button>
                        </div>
                    </div>
                    <div className="modalBody">
                        <p>Новый пароль</p>
                        <input required className='modalInput' type='password' value={info.password}
                               onChange={(event) => setInfo({...info,password:event.target.value})}/>
                        <p>Повторите пароль</p>
                        <input required className='modalInput' style={{marginBottom:'5px'}} type='password' value={info.repeatPassword}
                               onChange={(event) => setInfo({...info,repeatPassword:event.target.value})}/>
                        <span className='additional-info'> Пароль должен состоять из не менее восьми знаков, включать латинские буквы, цифры и специальные символы. </span>

                        <button className='modalBtn' onClick={onResetPassword}> Подтвердить</button>
                    </div>
                </div>
            </div>        )
    }
    
    if(forgotPassword === true)
    {
        return (
            <div className="modalBackground">
                <div className="modalContainer">
                    <div className="modalTitle">
                        <h1>Подтверждение почты</h1>
                        <div className="modalTitleCloseBtn">
                            <button onClick={() => {setOpenModal(false);}}> X </button>
                        </div>
                    </div>
                    <div className="modalBody">
                        <p>Код отправленный на почту {info.login} (Если не можете найти, попробуйте проверить папку спам)</p>
                        <input required className='modalInput' type='text' value={code}
                               onChange={(event) => setCode(event.target.value)}/>
                        <button className='modalBtn' onClick={onCheckCode}> Подтвердить</button>
                    </div>
                </div>
            </div>        )
    }
    
    if (isRegistration === false){
        if (twoFactor === true) {
            return (
                <div className="modalBackground">
                    <div className="modalContainer">
                        <div className="modalTitle">
                            <h1>Подтверждение почты</h1>
                            <div className="modalTitleCloseBtn">
                                <button onClick={() => {setOpenModal(false);}}> X </button>
                            </div>
                        </div>
                        <div className="modalBody">
                            <p>Код отправленный на почту {info.login} (Если не можете найти, попробуйте проверить папку спам)</p>
                            <input required className='modalInput' type='text' value={code}
                                   onChange={(event) => setCode(event.target.value)}/>
                            <button className='modalBtn' onClick={onSignInTwoFactor}> Подтвердить</button>
                        </div>
                    </div>
                </div>        )
        }
        else {
            return (
                <div className="modalBackground">
                    <div className="modalContainer">
                        <div className="modalTitle">
                            <h1>Войти</h1>
                            <div className="modalTitleCloseBtn">
                                <button
                                    onClick={() => {
                                        setOpenModal(false);
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        </div>
                        <div className="modalBody">
                            <p>Логин</p>
                            <input required className='modalInput' type='text' value={info.login}
                                   onChange={(event) => setInfo({...info, login: event.target.value})}/>

                            <p>Пароль</p>
                            <input required className='modalInput' type='password' value={info.password}
                                   onChange={(event) => setInfo({...info, password: event.target.value})}/>

                            <ReCAPTCHA
                                sitekey={process.env.REACT_APP_SITE_KEY}
                                ref={captchaRef}
                            />
                            <button onClick={onSignInNoTwoFactor}>Войти</button>
                        </div>

                        <div className="modalFooter">
                            <button style={{marginRight: "30px", marginLeft: "0px"}}
                                onClick={handleForgotPassword}
                            >
                                Сбросить пароль
                            </button>
                            <p> Нет аккаута?</p>
                            <button
                                onClick={() => {
                                    setRegistration(true);
                                }}
                            >
                                Зарегистрироватся
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    }
    else{
        if (twoFactor === true){
            return (
                <div className="modalBackground">
                    <div className="modalContainer">
                        <div className="modalTitle">
                            <h1>Подтверждение почты</h1>
                            <div className="modalTitleCloseBtn">
                                <button onClick={() => {setOpenModal(false);}}> X </button>
                            </div>
                        </div>
                        <div className="modalBody">
                            <p>Код отправленный на почту {info.login} (Если не можете найти, попробуйте проверить папку спам)</p>
                            <input required className='modalInput' type='text' value={code}
                                   onChange={(event) => setCode(event.target.value)}/>
                            <button className='modalBtn' onClick={onRegisterTwoFactor}> Подтвердить</button>
                        </div>
                    </div>
                </div>
            )
        }
        else
        {
            return (
                <div className="modalBackground">
                    <div className="modalContainer">
                        <div className="modalTitle">
                            <h1>Зарегистрироватся</h1>
                            <div className="modalTitleCloseBtn">
                                <button
                                    onClick={() => {
                                        setOpenModal(false);
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        </div>
                        <div className="modalBody">
                            <p>Логин</p>
                            <input required className='modalInput' type='text' value={info.login}
                                   onChange={(event) => setInfo({...info,login:event.target.value})}/>
                            <p>Пароль</p>
                            <input required className='modalInput' type='password' value={info.password}
                                   onChange={(event) => setInfo({...info,password:event.target.value})}/>
                            <p>Повторите пароль</p>
                            <input required className='modalInput' style={{marginBottom:'5px'}} type='password' value={info.repeatPassword}
                                   onChange={(event) => setInfo({...info,repeatPassword:event.target.value})}/>
                            <span className='additional-info'> Пароль должен состоять из не менее восьми знаков, включать латинские буквы, цифры и специальные символы. </span>
                            <p>Телефон</p>
                            <input required className='modalInput' type='text' value={info.phoneMobile}
                                   onChange={(event) => setInfo({...info,PhoneMobile:event.target.value})}/>
                            <p>Имя, Фамилия</p>
                            <input required className='modalInput' type='text' value={info.name}
                                   onChange={(event) => setInfo({...info, name:event.target.value})}/>
                            <ReCAPTCHA
                                sitekey={process.env.REACT_APP_SITE_KEY}
                                ref={captchaRef}
                            />
                            <button className='modalBtn' onClick={onSubmitRegistration}>Зарегистрироватся </button>
                        </div>
                        <div className="modalFooter">
                            <p> Есть аккаунт?</p>
                            <button
                                onClick={() => {
                                    setRegistration(false);
                                }}
                            >
                                Войти
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Modal;