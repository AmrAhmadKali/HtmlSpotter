'use strict'

var WebSocketClient = require('websocket').client

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
		this.dict = []
        this.dict['Druck'] = 'Druck umgibt jedem bei den Herausforderungen, aber jeder reagiert anders  auf Stress'
        this.dict['Pause'] = 'Pausen sind wichtig, der Koerber und das Gehirn brauchen Ruhe'
        this.dict['abnehm'] = 'Der Wille den Koerber zu optimieren ist gut, muss man aber nicht daran uebertrieben'
        this.dict['schlaf'] = 'Schlafen ist in normanlen Massen gesund, macht aber keinen Sinn wenn man  tagsueber schlaeft'
    	this.dict['Sorge'] = 'Lassen Sie die Sorgen nicht zu viel Aufmerksam von Ihnen nehmen'
		this.dict['richtig'] = 'Es gibt nicht die eine richtige Loesung, es ist immer je nach Person anders'
		this.dict['konzentr'] = 'Auch bei Konzentrationsstoerung muss man nicht so schnell von psychatrischen  Diagnosen ausgehen'
		this.dict['einsam'] = 'Alleinsein ist nicht immer die beste Idee '
		this.dict['traurig'] = 'Dauernde Traurigkeit ist manchmal ein Signal'
		this.dict['Medikation'] = 'Auch Aerzte müssen vorsichig sein beim Medikationenverschreibungen'
		this.dict['Droge'] = 'Drogen muss man unbedingt vermeiden, besonders bei unstabile Menschen, bei denen auch kann man leicht suechtig werden'
		this.dict['Angst'] = 'Angst ist Menschlich, wenn aber der kommt haeufig ohne richtigen Grund, da muss man beraten lassen'


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

    this.botMessagesHistoryResetable = []
    this.unkownMessage = "Ich verstehe Sie nicht"

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
      this.userMessagesHistory.push(nachricht)      //save user messages History
      var inhalt = null
    var dictCounter = Object.keys(this.dict).length
    var counter = 0

      for ( var j in this.dict) {
        counter++
        if (nachricht.includes(j)) {              //Nachricht erkannt
          inhalt = this.dict[j]
          break
        }
      }
        
    if(inhalt == null){                          //Nachricht nicht erkannt                                   
        var tmpResponse = `Ich kann Sie nicht verstehen, ich kann aber Ihnen helfen bei ${Math.floor(Math.random() * dictCounter)}`    //zahl zwischen 0 - dictcounter //Einlenken

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
            inhalt = `Beginnen wir von vorne, ich bin hier der ${BOT_NAME} ich kann Ihnen und Später ihrem wircklicher Arzt helfen bei Psycho-Syptome identifizierung`
          }                   //Fallback
        }
      }
    
  
  
      // var name = 'Seelenarzt'
    	// const nicht_verstehen = []
		  // nicht_verstehen ['Ich habe Ihnen nicht genau verstanden wir sollten hier über Ihre Psyche reden'] = 0
      // {
      // "Ich habe Ihnen nicht genau verstanden wir sollten hier über Ihre Psyche reden" : 0,
      // }
      // var antwort = ''
      // var verlauf = []
      // verlauf ['Ich habe Ihnen nicht genau verstanden wir sollten hier über Ihre Psyche reden'] = 0

      //var antworten[inhalt] = 0
     // 

    	// for ( var i in verlauf) {
      //   //For Test
      //   console.log(i)

      // }
		
    	// for ( var j in this.dict) {                                                   //ToDo
			// if (nachricht.includes(j)) {
      //   	antwort = this.dict[j]
      //     verlauf['"' + antwort + '"'] += 1 
      //     break
      //   }
      // else {

      //     // antwort = 

      // }
      
    	// }	
      

    	/*
     	* Verarbeitung 
    	*/
      //sleep()
    	var msg = '{"type": "msg", "name": "' + BOT_NAME + '", "msg":"' + inhalt + '"}'
    	console.log('Send: ' + msg)
    	this.client.con.sendUTF(msg)
  	}

}

module.exports = bot
