import tz_zones from "./iana-tz.js"

const output = document.querySelector("#curr-time")
const FIVEOCLOCK = 17;


const party_zones = new Set()
const get_tz_name = "([^\/]+$)" // Regex for selecting the city name only


const party_cities = new Set()
const printed = new Set()


const CHECK_INTERVAL = 15

function validateTime() {
    party_zones.forEach(zone => {
        const now = luxon.DateTime.now().setZone(zone)
        if (Number(now.toFormat("HH")) != FIVEOCLOCK) {
            // console.log("It's no longer 5 o'clock at " + zone)
            party_zones.delete(zone) // Delete if it's not 1700 there
        }
    })
}

function findTime() {
    tz_zones.forEach(zone => {
        const now = luxon.DateTime.now().setZone(zone)
        if (Number(now.toFormat("HH")) == FIVEOCLOCK) {
            party_zones.add(zone)
        }
    });
}


function findCities() {
    party_zones.forEach(zone => {
        let city = zone.match(get_tz_name)[0] // Only need the first result
        party_cities.add(city)
    })
}

function displayCities() {
    party_cities.forEach(city => {
        // Don't print already printed cities
        if (!printed.has(city)) {
            output.innerHTML += city + " "
            printed.add(city)
        }
    })
}

function run() {
    validateTime()
    findTime()
    findCities()
    displayCities()
}


setInterval(function () {
    run() // Run once then check
    const check_runtime = luxon.DateTime.now()
    // Only need to check for updates every 15 minutes
    if (Number(check_runtime.toFormat("mm")) % CHECK_INTERVAL == 0) {
        run()
    }
}, 1000)

