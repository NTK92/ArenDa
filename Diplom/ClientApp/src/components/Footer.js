import React from 'react';
import './FooterStyle.css';

const Footer = () => {
    return (
        <div className='footer'>
            <span> ©2023 ArenDA  </span>
            <a href={'https://play.google.com/store/games?hl=ru&gl=US&pli=1'}>
                <img src={'/Images/Logos/Google Play.svg'} alt='google play'/>
            </a>
            <a href={'https://www.apple.com/ru/app-store/'}>
                <img src={'/Images/Logos/AppStore.svg'} alt='app store'/>
            </a>
            <a href={'https://web.telegram.org'}>
                <img src={'/Images/Logos/Telegram.svg'} alt='tg'/>
            </a>
            <a href={'https://vk.com'}>
                <img src={'/Images/Logos/Vkontakte (VK).svg'} alt='vk'/>
            </a>
            <a href={'https://www.youtube.com/'}>
                <img src={'/Images/Logos/YouTube.svg'} alt='yt'/>
            </a>
        </div>
    );
};

export default Footer;