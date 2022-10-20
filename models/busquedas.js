const axios = require('axios');

class Busquedas{
    historial = ['Tegucigalpa', 'San Jose', 'Madrid'];

    constructor(){
        //TODO leer DB si existe.
    }

    async ciudad (lugar = ''){
        //peticion http
        // console.log(lugar);

        try{

            const resp = await axios.get('https://reqres.in/api/users?page=2');
            console.log(resp.data.per_page);

        }catch(error){

        }
        
        return []; //retornar los lugares.
    }

}

module.exports = Busquedas;0