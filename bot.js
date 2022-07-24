'use strict'

var WebSocketClient = require('websocket').client
var intents = require('./test.json')

/**
 * bot ist ein einfacher Websocket Chat Client
 */

class bot {

  /**
   * Konstruktor baut den client auf. Er erstellt einen Websocket und verbindet sich zum Server
   * Bitte beachten Sie, dass die Server IP hardcodiert ist. Sie müssen sie umsetzten
   */
  	constructor () {
		const BOT_NAME = 'Seelenarzt'
    /** Die Websocketverbindung
      */
    this.client = new WebSocketClient()
    /**
     * Wenn der Websocket verbunden ist, dann setzten wir ihn auf true
     */
    this.connected = false

    /**
     * Wenn die Verbindung nicht zustande kommt, dann läuft der Aufruf hier hinein
     */
    this.client.on('connectFailed', function (error) {
      console.log('Connect Error: ' + error.toString())
    })

    /** 
     * Wenn der Client sich mit dem Server verbindet sind wir hier 
    */
    this.client.on('connect', function (connection) {
      this.con = connection
      console.log('WebSocket Client Connected')
      connection.on('error', function (error) {
        console.log('Connection Error: ' + error.toString())
      })

      /** 
       * Es kann immer sein, dass sich der Client disconnected 
       * (typischer Weise, wenn der Server nicht mehr da ist)
      */
      connection.on('close', function () {
        console.log('echo-protocol Connection Closed')
      })

      /** 
       *    Hier ist der Kern, wenn immmer eine Nachricht empfangen wird, kommt hier die 
       *    Nachricht an. 
      */
      connection.on('message', function (message) {
        if (message.type === 'utf8') {
          var data = JSON.parse(message.utf8Data)
          console.log('Received: ' + data.msg + ' ' + data.name)
        }
      })

      /** 
       * Hier senden wir unsere Kennung damit der Server uns erkennt.
       * Wir formatieren die Kennung als JSON
      */
      function joinGesp () {
        if (connection.connected) {
          connection.sendUTF('{"type": "join", "name": "' + BOT_NAME + '"}')
        }
      }
      joinGesp()
    })

    // var chatLog =
    //  [{"user:":"first message", "bot":null}, {"user":null, "bot":"Hi"}]
    // 
    // 

    this.userMessagesHistory = []
    this.botMessagesHistory = []

    this.unkownMessage = "Ich verstehe Sie nicht,Koennten Sie erzaehlen, was deine Beschwerde ist?"

  }

  /**
   * Methode um sich mit dem Server zu verbinden. Achtung wir nutzen localhost
   * 
   */
  connect () {
    this.client.connect('ws://localhost:8181/', 'chat')
    this.connected = true
  }

  	/** 
   	* Hier muss ihre Verarbeitungslogik integriert werden.
   	* Diese Funktion wird automatisch im Server aufgerufen, wenn etwas ankommt, das wir 
   	* nicht geschrieben haben
   	* @param nachricht auf die der bot reagieren soll
  	*/
  	post (nachricht) {
      var BOT_NAME = 'Seelenarzt'
      var NO_OF_Entries = 10                        //Nach wie viele bot-antworten endet der chat
      nachricht = nachricht.toLowerCase()
      this.userMessagesHistory.push(nachricht)      //save user messages History
      var inhalt = null

      for (var j = 0 ;j<intents.answers.length ;j++) {
        if (nachricht.includes(intents.answers[j].intent)) {              //Nachricht erkannt
          inhalt = intents.answers[j].answer
          this.botMessagesHistory.push(inhalt)
          break
        }
      }
        
    if(inhalt == null){                          //Nachricht nicht erkannt                                   
        var tmpResponse = `Ich kann Sie nicht verstehen, ich kann aber Ihnen helfen bei ${intents.answers[Math.floor(Math.random() * intents.answers.length)].diagnosis}`    //zahl zwischen 0 - dictcounter //Einlenken

        if (!(this.botMessagesHistory.includes(this.unkownMessage))){
          inhalt = this.unkownMessage                                               //Normale ich verstehe nicht msg
          this.botMessagesHistory.push(inhalt)
        }
        else {                                                                      //ich verstehe nicht msg schon verwendet wurde
          if (!(this.botMessagesHistory.includes(tmpResponse))){                    //Gegen Vorschlag generieren
            inhalt = tmpResponse 
            this.botMessagesHistory.push(inhalt)
          }
          else {             //beide "Normale ich verstehe nicht" msg u. ein randomiesierte Gegevorschlag verwendet wurden 
            inhalt = `Beginnen wir von vorne, ich bin hier der ${BOT_NAME} ich kann Ihnen und Später ihrem wirklicher Arzt helfen bei Psycho-Syptome identifizierung`
          }                   //Fallback
        }
      }
    
    if(this.botMessagesHistory.length == NO_OF_Entries){
      inhalt = "Das habe ich bis jetzt mitbekommen als moegliche Diagnosen (Bitte bemerken Sie: dass nur eine Hilfe fuer Ihre Arzt und keine tatsaechliche Diagnose ist):"
      var allUserMsgs = ''
      for (var k = 0; k < this.botMessagesHistory.length; k++){
        allUserMsgs = allUserMsgs + " " + this.userMessagesHistory[k]+ " " 
      }
      allUserMsgs = allUserMsgs.toLowerCase()
      for (var i =0; i < intents.answers.length; i++){       
          if(allUserMsgs.includes(intents.answers[i].intent)){
            inhalt = inhalt + " " + intents.answers[i].diagnosis + ","
          }
        }
    }

      //sleep()
    	var msg = '{"type": "msg", "name": "' + BOT_NAME + '", "msg":"' + inhalt + '"}'
    	console.log('Send: ' + msg)
    	this.client.con.sendUTF(msg)
  	}

}

module.exports = bot
