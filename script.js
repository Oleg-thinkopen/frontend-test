const apiKey = "a656aec63605db8dd0a834a98566eab9"
let url = "https://api.openweathermap.org/data/2.5/onecall"
const iconBaseUrl = "http://openweathermap.org/img/wn/"
const locations = {
    "London" : {lat : "51.509865", lon: "-0.118092", img: "https://upload.wikimedia.org/wikipedia/commons/8/82/London_Big_Ben_Phone_box.jpg"},
    "Milan" : {lat : "45.4654219", lon: "9.1859243", img: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1284,h_1080,f_auto/w_80,x_15,y_15,g_south_west,l_klook_water/activities/bsablh7giigawkdkrtbu/MilanCityCenterMilanDuomoFast-TrackPrivateTour.webp"},
    "Bangkok" : {lat : "13.736717", lon: "100.523186", img: "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/109000/109529-Bangkok.jpg"},
    "Los Angeles" : {lat : "34.052235", lon: "-118.243683", img: "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/475000/475457-Los-Angeles.jpg"},
    "Nairobi" : {lat : "-1.286389", lon: "36.817223", img: "https://cdn.audleytravel.com/4082/2913/79/8003731-nairobi.jpg"},
}

window.onload = () => {
    let contents = []
    let scrollAmount = 0
    let i = 0

    for(let loc in locations){

        let currentLoc = locations[loc]
        let currentMonthDay = new Date().getDate()

        $.ajax({
            url: `${url}?lat=${currentLoc.lat}&lon=${currentLoc.lon}&exclude=minutely,hourly&appid=${apiKey}`,
            async:false,
            success: (res) => {
                console.log(res)

                //navigation dots
                let navDot = `<div class="nav-dot ${i === 0 ? 'nav-dot-active' : ''}" id="navDot-content${i}" onClick="scrollApi(content${i})">&xcirc;</div>`
                document.getElementById('navDotContainer').innerHTML += navDot

                //daily weather
                let daily = res.daily.map(d => `
                    <div class="daily-weather-day ${timestampToDay(d.dt) == currentMonthDay ? 'is-current-month-day' : ''}">
                        <div>${timestampToWeekday(d.dt)}</div>
                        <img src="${iconBaseUrl}${d.weather[0].icon}.png" class="daily-weather-img"/>
                        <div class="daily-weather-temp">${toCelsius(d.temp.min)}&#176;/${toCelsius(d.temp.max)}&#176;</div>
                    </div>
                `)
                daily = daily.splice(daily.first, 7)

                //full weather page for city
                contents.push(`<div class="content" id="content${i}">
                    <div class="bg-div" style="background: url('${locations[loc].img}') no-repeat center center;background-size:cover;" ></div>
                    <div class="info">
                        <h1>${loc}</h1>
                        <div class="daily-weather-now">
                            <h4 style="">${res.current.weather[0].main}</h4>
                            <img src="${iconBaseUrl}${res.current.weather[0].icon}.png"/>
                        </div>
                        <div class="current-temp">${toCelsius(res.current.temp)}&#176;</div>
                        <div class="daily-weather">
                            ${daily.toString().replaceAll(',','')}
                        </div>
                    </div>
                </div>`)

                i++
            },
            error: (err) => {
                console.log(err)
            }
        })
    }
    document.getElementById('root').innerHTML = ""
    contents.map(c => document.getElementById('root').innerHTML += c)
}

let toCelsius = (k) => {
    return Math.trunc((k - 273.15))
}

let timestampToDate = (timestamp, options) => {
    let fixedTimestamp = parseInt(timestamp+'000')
    return new Date(fixedTimestamp).toLocaleDateString('en-EN', options)
}
let timestampToWeekday = (timestamp) => {
    let options = {weekday : 'short'}
    return timestampToDate(timestamp, options)
}
let timestampToMonth = (timestamp) => {
    let options = {month: "numeric"}
    return timestampToDate(timestamp, options)
}
let timestampToDay = (timestamp) => {
    let options = {day: 'numeric'}
    return timestampToDate(timestamp, options)
}
//new Date(1504095567183).toLocaleDateString("en-US")
//new Date(1504095567183).toLocaleTimeString("en-US")


let scrollApi = (target) => {
    let activeClass= 'nav-dot-active'
    Array.from(document.getElementById('navDotContainer').children).map(c => {
        if(c.id !== `navDot-${target.id}`){
            if(c.classList.contains(activeClass)) c.classList.remove(activeClass)
        }else{
            if(!c.classList.contains(activeClass)) c.classList.add(activeClass)
        }
    })

    Array.from(document.getElementById('root').children).map(c => {
        if(c.id === target.id){
            c.scrollIntoView({behavior : 'smooth'})
        }
    })
}

let updateNavDots = () => {
    Array.from(document.getElementById('root').children).map(c => {
        let coord = c.getBoundingClientRect()
        if(coord.left === 0){
            scrollApi(c)
            return true
        }
        return false
    })
}
//Array.from(document.getElementById('navDotContainer').children).map(c => c.id)