require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async () => {

    const busquedas = new Busquedas();

    let opt = '';
    do {
        opt = await inquirerMenu();
        console.log({ opt });

        switch (opt) {
            case 1:
                //mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                //buscar el lugar
                const lugares = await busquedas.ciudad(termino);
                //seleccionar el lugar
                const id = await listarLugares(lugares);

                if( id === '0' ) continue;

                const lugarSel = lugares.find( l => l.id == id);

                //guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);                

                // const { nombre, lng, lat } = lugarSel; /*no entiendo porque se rompio esto*/ 

                //clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                
                // mostrar resultados

                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSel.nombre);
                console.log('Lat: ', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura', clima.temp);
                console.log('Minima:', clima.min);
                console.log('Maxima:', clima.max);
                console.log('Desc:', clima.desc);

                break;

            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) =>{
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
                break;
        }
       

        if (opt !== 0) await pausa();

    } while (opt !== 0);

}

main();