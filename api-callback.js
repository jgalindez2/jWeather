const request = require('request')
const urlAddress = 'https://maps.googleapis.com/maps/api/geocode/json'
const urlWeather = 'https://api.darksky.net/forecast/277f71cfdf5e12ec17c5afea238df4b8/'

const geocodeAddress = (address, callback) => {
    request(`${urlAddress}?address=${address}`, (err, res, body) => {
        if (err || res.statusCode == 404) {
            callback('Unable to connect to google servers.')
            return
        }
        const data = JSON.parse(body)
        switch (data.status) {
            case 'ZERO_RESULTS':
                callback('There is not results for your search. Please, check your address.')
                break;
            case 'OVER_QUERY_LIMIT':
                callback(data.error_message)
                break;
            case 'OK':
                callback(null, {
                    address: data.results[0].formatted_address,
                    latitude: data.results[0].geometry.location.lat,
                    longitude: data.results[0].geometry.location.lng
                })
                break;
            default:
                callback('Something wrong happened')
        }
    })
}

const getWeather = (latitude, longitude, callback) => {
    request(`${urlWeather}${latitude},${longitude}`, (err, res, body) => {
        const data = JSON.parse(body)
        if (err || res.statusCode == 400) {
            callback('Unable to connect to forecast servers.')
        } else if(data.code == 400){
            callback(data.error)
        }else{
            callback(null, data.currently)
        }
    })
}

module.exports = {geocodeAddress, getWeather}
