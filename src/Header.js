import React from 'react'

import telegram_img from './images/telegram.png';
import "./Header.css";



function Header() {

    return (
        <div>
            <p class="feedback">
                <a href="http://t.me/apyninja" align="right">
                    <img src={telegram_img} alt="telegram" target="_blank"  style={{width:"38px"}}></img>
                </a> 
                <span>&lt;-- Pls Give us feedback in the channel</span>
            </p>
            <header>
                <div class="heading-box">
                    <h1>APY NINJA (alpha)</h1>
                    <p class="bottom">We scan the internets for the best APYs, so you don't have to</p>
                    <p class="bottom2">Apologies for the shit product, we are doing our best to deliver ASAP</p>
                </div>
            </header>
        </div>
    )
}

export default Header
