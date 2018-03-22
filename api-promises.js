const request = require('request')
const urlAddress = 'https://maps.googleapis.com/maps/api/geocode/json'
const urlWeather = 'https://api.darksky.net/forecast/277f71cfdf5e12ec17c5afea238df4b8/'

const geocodeAddress = (address) => {
    return new Promise((resolve, rejected) => {
        request(`${urlAddress}?address=${address}`, (err, res, body) => {
            if (err || res.statusCode == 404) {
                return rejected('Unable to connect to google servers.')
            }
            const data = JSON.parse(body)
            switch (data.status) {
                case 'ZERO_RESULTS':
                    rejected('There is not results for your search. Please, check your address.')
                break;
                case 'OVER_QUERY_LIMIT':
                    rejected(data.error_message)
                break;
                case 'OK':
                    resolve({
                        address: data.results[0].formatted_address,
                        latitude: data.results[0].geometry.location.lat,
                        longitude: data.results[0].geometry.location.lng
                    })
                break;
                default:
                    rejected('Something wrong happened')
            }
        })
    })
}

const getWeather = (location) => {
    return new Promise((resolve, rejected) => {
        request(`${urlWeather}${location.latitude},${location.longitude}`, (err, res, body) => {
            const data = JSON.parse(body)
            if (err || res.statusCode == 400) {
                rejected('Unable to connect to forecast servers.')
            } else if(data.code == 400){
                rejected(data.error)
            }else{
                resolve({weather: data.currently, address: location.address})
            }
        })
    })
}

module.exports = {geocodeAddress, getWeather}
