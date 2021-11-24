//Conexión a MQTT Broker usando WS
var client = mqtt.connect({
    host: '3.23.129.128',
    port: 9883,
    username: 'webapp',
    password: 'webapp'
});


const tweetButton = document.getElementById("tweet-button")
const tempField = document.getElementById("temp-field")

/**
 * Función llamada cuando se presiona el botón para realizar tweet
 * Publica el mensaje del tweet en el tema "twitter" del broker MQTT 
 */
tweetButton.onclick = function() {
    const tweet = document.getElementById("tweet-field").value;
    //Si el tweet es vacío o se pasa del límite
    if(tweet.length > 280 || 0 >= tweet.length){
        alert("La cantidad de caracteres supera el límite")
        return
    }
    console.log(tweet);
    //Publicar tweet en el tema al cual está suscrito el Node Red
    client.publish('twitter', tweet)
}

/**
 * Suscribe el cliente al tema de temperatura una
 * vez se realiza la conexión
 */
function setOnConnect(){
    client.subscribe('temp', function(err) {
        if(err) console.log(error)
    })
}

/**
 * Verifica si un string es nùmero
 * @param str String
 * @returns true si es número, false si no
 */
function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

/**
 * Actualiza el dato de temperatura cuando llega un mensaje
 * al tema de "temperatura" en el broker MQTT
 */
function updateData(topic, message){
    console.log(message.toString())
    if(topic == 'temp'){
        if(isNumeric(message.toString()))
        tempField.value = message.toString() + "°C"
    }
}

client.on('connect', setOnConnect)
client.on('message', updateData)
