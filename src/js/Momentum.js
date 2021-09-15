/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-destructuring */
export default class Momentum {
    constructor (html) {
        // super();
        this.html = html;
    }


    render() {
        this.html = 
          `<div class="weather"></div>
            <div class="main">
                <div class="errorMessage">такого города нет, попробуйте ещё раз</div>
                <div class="city" contenteditable="true"></div>
                <div class="time"></div>
                <div class="greet"></div>
                <div class="focus" contenteditable="true"></div>
                <div class="quotes"></div>
                <div class="button-wrap">
                    <button class="change-quote button">Change quote</button>
                    <button class="change-bg button">Change background</button>
                </div>
            </div>`;

          return this.html;
    }

      afterRender() {
        this.setActions();
      }

    setActions() {
        this.updateTime();
        this.isGreetings();
        this.changeBackground();

        this.name = document.querySelector('.name');
        this.focusUser = document.querySelector('.focus');
        this.userCity = document.querySelector('.city');
        this.changeQuoteButton = document.querySelector('.change-quote');

        this.getCity();
        this.getName();
        this.getFocus();
        this.getQuotes();
        
        this.userCity.addEventListener('click', this.clearName);
        this.name.addEventListener('click', this.clearName);
        this.focusUser.addEventListener('click', this.clearName);
        this.name.addEventListener('keypress', this.setName);
        this.name.addEventListener('blur', this.setName);

        this.focusUser.addEventListener('keypress', this.setFocus);
        this.focusUser.addEventListener('blur', this.setFocus);

        this.changeQuoteButton.addEventListener('click',  this.getQuotes);
        document.addEventListener('DOMContentLoaded', this.getWeather);

        this.userCity.addEventListener('keypress', (e) => {
            if (e.type === 'keypress') {
                if (e.which === 13 || e.keyCode === 13) {
                    if (e.target.textContent === '' || e.target.textContent.length === 0 || !e.target.textContent.trim()) {
                        e.target.textContent = localStorage.city;
                         this.userCity.blur();
                    } else {
                        localStorage.city = e.target.innerText;
                        this.userCity.blur();
                    }
                     this.getWeather();
                }
            } else {
                localStorage.city = e.target.innerText;
            }
        });
        this.userCity.addEventListener('blur', (e) => {
            if (e.target.textContent === '' || e.target.textContent.length === 0 || !e.target.textContent.trim()) {
                e.target.textContent = 'Enter City';
            }
        });
    }

    setFocus(e) {
        this.focusUser = document.querySelector('.focus');
        if (e.type === 'blur') {
            if (e.target.textContent === '' || e.target.textContent.length === 0 || !e.target.textContent.trim()) {
                e.target.textContent = localStorage.focus;
            } else {
                localStorage.focus = e.target.innerText;
            }
        } else if (e.type === 'keypress') {
            if (e.which === 13 || e.keyCode === 13) {
                if (e.target.textContent === '' || e.target.textContent.length === 0 || !e.target.textContent.trim()) {
                    e.target.textContent = localStorage.focus;
                    this.focusUser.blur();
                } else {
                    localStorage.focus = e.target.innerText;
                    this.focusUser.blur();
                }
            }
        } else {
            localStorage.focus = e.target.innerText;
        }
    }

    async getWeather() {
        try {
            const weatherWrap = document.querySelector('.weather');
            this.url = `https://api.openweathermap.org/data/2.5/weather?q=${this.userCity.textContent}&lang=en&appid=58c60576a6f0ef8c4e5e03a182a5a490&units=metric`;
            const res = await fetch(this.url);
            const data = await res.json(); 
            // console.log('data: ', data);

            weatherWrap.innerHTML = 
            `<i class="weather-icon owf owf-${data.weather[0].id}"></i>
            <div class="temperature">${data.main.temp}°C</div>
            <div class="weather-description">${data.weather[0].description}</div>
            <div class="wind-speed">Wind speed: ${data.wind.speed}</div>
            <div class="humidity">Humidity: ${data.main.humidity}%</div>`;
        } catch {
            const errorMessage = document.querySelector('.errorMessage');
            const weatherWrap = document.querySelector('.weather');

            if (this.userCity.textContent != '[Enter city]') {
                errorMessage.classList.add('error');

                weatherWrap.innerHTML = '';
                setTimeout(() => { 
                    errorMessage.classList.remove('error');
                    
                }, 3000);
            }
        }
    }

    async getQuotes() {
        this.quotes = document.querySelector('.quotes');
        const url = 'https://type.fit/api/quotes';
        this.delay = ms => {
            return new Promise(r => setTimeout(() => r(), ms));
        }
        await this.delay(500)
        const response = await fetch(url);
        const data = await response.json();

        this.newArrOfQuotes = data.sort(() => Math.random() - 0.5);
        this.quotes.innerHTML = `<p class="quote">${this.newArrOfQuotes[0].text}</p><p class="author"><em>Author: </em>${this.newArrOfQuotes[0].author}</p>`    

    }

    async changeBackground() {
        this.imagesBg = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
        this.arrTypeOfDay = ['morning', 'day', 'evening', 'night'];
        this.currantTypeOfDay = null;
        this.contentFolder = null;
        let i = 0;
        this.body = document.querySelector('body');
        this.changeBg = document.querySelector('.change-bg');

        this.newBackgroundImage = this.imagesBg.sort(() => Math.random() - 0.5);
        
        if (this.hour <= 11 && this.hour >= 6) {
            i = 0;
            this.currantTypeOfDay = this.arrTypeOfDay[0];
        } else if (this.hour <= 17 && this.hour >= 12) {
            i = 1;
            this.currantTypeOfDay = this.arrTypeOfDay[1];
        } else if (this.hour >= 18 && this.hour <= 23) {
            i = 2;
            this.currantTypeOfDay = this.arrTypeOfDay[2];
        } else if (this.hour >= 0 && this.hour <= 5) {
            i = 3;
            this.currantTypeOfDay = this.arrTypeOfDay[3]; 
        }

        this.contentFolder = `url("../img/${this.currantTypeOfDay}/${this.newBackgroundImage[0]}")`;
        this.body.style.backgroundImage = this.contentFolder;
        
        this.changeBg.addEventListener('click', () => {
            if (this.currantTypeOfDay === 'night') {
                i = 0; 
            } else {
                i+=1;
            }
               
            this.currantTypeOfDay = this.arrTypeOfDay[i];
            this.contentFolder = `url("../img/${this.currantTypeOfDay}/${this.newBackgroundImage[0]}")`;
            this.body.style.backgroundImage = this.contentFolder;

            this.changeBg.disabled = true;
            setTimeout(() => { this.changeBg.disabled = false }, 1000);
        });


    }


    clearName(e) {
        this.target = e.target;
        this.target.innerText = '';
    }

    setName(e) {
        this.name = document.querySelector('.name');
        if (e.type === 'blur') {
            if (e.target.textContent === '' || e.target.textContent.length === 0 || !e.target.textContent.trim()) {
                e.target.textContent = localStorage.name;
            } else {
                localStorage.name = e.target.innerText;
            }
        } else if (e.type === 'keypress') {
            if (e.which === 13 || e.keyCode === 13) {
                if (e.target.textContent === '' || e.target.textContent.length === 0 || !e.target.textContent.trim()) {
                    e.target.textContent = localStorage.name;
                    this.name.blur();
                } else {
                    localStorage.name = e.target.innerText;
                    this.name.blur();
                }
            }
        } else {
            localStorage.name = e.target.innerText;
        }
    }



    
    updateTime() {
        this.today = new Date();
        const timeContainer = document.querySelector('.time');
        const monthsEng = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dayEnglish = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.hour = this.today.getHours();
        this.min = this.today.getMinutes();
        this.sec = this.today.getSeconds();
        this.day = this.today.getDate();
        this.month = this.today.getMonth();
        this.year = this.today.getFullYear();
        this.dayWeek = this.today.getDay();
    
        timeContainer.innerHTML = 
        `
        <div><span class="day-week">${dayEnglish[this.dayWeek]}</span></div>
        <div class="date-full"><span class="day-count">${this.day} </span><span class="mounth">${monthsEng[this.month]} </span><span class="year">${this.year}</span></div>
        <span class="hour">${(this.hour < 10)? `0${this.hour}`:this.hour}</span>:<span class="minutes">${(this.min < 10)? `0${this.min}`:this.min}</span>:<span class="seconds">${(this.sec < 10)? `0${this.sec}`:this.sec}</span>
        `;
        
        setInterval(this.updateTime, 1000);
    }

    isGreetings() {
        const greet = document.querySelector('.greet');
        this.greeting = null;

        if (this.hour <= 11 && this.hour >= 6) {
            this.greeting = `Good Morning`;
        } else if (this.hour <= 17 && this.hour >= 12) {
            this.greeting = `Good Day`;
        } else if (this.hour >= 18 && this.hour <= 23) {
            this.greeting = `Good Evening`;
        } else if (this.hour >= 0 && this.hour <= 5) {
            this.greeting = `Good Night`;
        }

        greet.innerHTML = `<span class="greeting">${this.greeting},</span><span class="name" contenteditable="true"></span>`

       
    }

    getCity() {
        if (localStorage.getItem('city') === null) {
            localStorage.city = '[Enter city]';
            this.userCity.textContent = '[Enter city]';
        } else {
            this.userCity.textContent = localStorage.getItem('city');
        }
    }

    getName() {
        if (localStorage.getItem('name') === null) {
            localStorage.name = '[Enter Name]';
            this.name.textContent = '[Enter Name]';
        } else {
            this.name.textContent = localStorage.getItem('name');
            this.getWeather();
        }
    }

    getFocus() {
        console.log(this.focusUser);
        if (localStorage.getItem('focus') === null) {
            localStorage.focus = '[What is your focur]';
            this.focusUser.textContent = '[What is your focur]';
        } else {
            this.focusUser.textContent = localStorage.getItem('focus');
        }
    }
}