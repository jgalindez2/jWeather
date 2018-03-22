const api = require('./api-promises.js')
const yargs = require('yargs')
const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Adress to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv
const encodeUri = encodeURIComponent(argv.a)

api.geocodeAddress(encodeUri)
    .then((location) => api.getWeather(location))
    .then((locWeat) => console.log(`${locWeat.address}\nIt's currently ${locWeat.weather.temperature}. It's feel like ${locWeat.weather.apparentTemperature}`))
    .catch((errMessage) => console.log(errMessage))
