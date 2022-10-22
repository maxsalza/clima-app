const fs = require('fs');

const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath='./db/database.json'

    constructor() {
        //TODO leer DB si existe.
         this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map( lugar =>{

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() +p.substring(1));
            return palabras.join(' ');
        })
    }
    
    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsClimaWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang':  'es'   
        }
    }

    async ciudad(lugar = '') {


        try {
            //peticion http
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await intance.get();


            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))

        } catch (error) {
            return []
        }

    }

    async climaLugar(lat, lon) {
        try {
            //intance de axios
            const intance = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsClimaWeather, lat, lon}
            });

            //respuesta extrar en la informacion en la data.
            const resp = await intance.get();  
            const {weather, main} = resp.data;             
            //retorna un objeto descripcion, temp min, temp max,.y temp.
            
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = ''){
        //TODO: preveni duplicado
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial.unshift(lugar.toLocaleLowerCase());

        //grabar DB
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial:   this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB(){
        // debe de existir...
        if(!fs.existsSync(this.dbPath)){
            return;
        }
        //cargar la informacion const info. readfilesync.path {encoding:utf-8}

        const info  = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        
        if(!info) return;

        const data = JSON.parse(info);

         this.historial = data.historial;
    }
}

module.exports = Busquedas; 


 // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/otawwa.json?&language=es&');