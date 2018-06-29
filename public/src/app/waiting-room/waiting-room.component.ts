import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import * as io from 'socket.io-client'
import { NgForm } from '@angular/forms';
import { EventEmitter } from 'protractor';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent implements OnInit {

  @ViewChild('video') video: any;
  messageText: string;
  messages: Array<any>
  socket: SocketIOClient.Socket
  localName: String
  currentRoom: any
  players: Array<any>
  _navigator = <any>navigator;
  localStream;
  @ViewChild('textInput') inputEL:ElementRef


  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.socket = io.connect('http://localhost:8888')
  }

  ngAfterViewInit(){

    this.focusText()

  }
  focusText(){
    this.inputEL.nativeElement.focus()
  }

  ngOnInit() {
    
    this.players = new Array()
    this.messages = new Array()
    

    var person = prompt("Please enter your name");

    if (person == null || person == "") {
      this.localName = ('Player' + Math.floor(Math.random() * 100))
      this.players.push(this.localName)
    } else {
      this.localName = person
      this.players.push(person)
    }
    console.log(this.localName)
    this.socket.on('currentRoom', (data: any) => {
      console.log('@@@@@@@@@@@@',data)
      this.currentRoom = data
      console.log(this.currentRoom)
    })
    // this.socket.on('newUserJoined', (data: any) => {
    //   this.players.push(data)
    // })
    this.initializeSocket()

    this.socket.on('user_left', (data)=>{
      for (var x in this.players){
        if(this.players[x] == data){
          this.players.splice(x, 1)
        }
      }

      this.messages.push(data + ' has left the room')
    })
    this.socket.on('sendName', (data) => {
      this.socket.emit('sentName', this.localName)
    })
    this.socket.on('names', (data) => {
      this.players.push(data)
      console.log('@@@@@', data)
    })
    this.socket.on('go', (data) => {
      this._router.navigate(['/game'])
      console.log('was gonna start')

  
      
    })

  }
  sendMessage(form: NgForm) {
    console.log(form)
    
    const message = {
      text: (this.localName + ' - ' + form.value.newMessage)
    }
      this.socket.emit('send-message', message)
    console.log(message.text)
    this.messages.push(message.text)
    form.resetForm()
  }

  initializeSocket(){


    ///////////////////////
    ////Runs on init, autojoins a room and emits local name
    ///////////////////////


    console.log(this.socket)
    this.socket.emit('room', 1000)
    this.socket.on('message-received', (data: any) => {
      this.messages.push(data.text)
      console.log(this.socket['name'])

    })

    this.socket.emit('newUser', this.localName)
    console.log(this.localName, 'hello')

  }


  // join(){
  //   console.log(this.socket)

  //   this.socket.emit('room', 1000)

  //   this.socket.on('message-received', (data: any) => {
  //     this.messages.push(data.text)
  //     console.log(data)
  //     console.log(this.messages)
      
  //   })
    
  // }
  // joinRoom(){
  //   console.log(this.socket)

  //   this.socket.emit('room', 1001)

  //   this.socket.on('message-received', (data: any) => {
  //     this.messages.push(data.text)
  //     console.log(data)
  //     console.log(this.messages)
  //   })
  // }



  startGame(){
    this.socket.emit('start')
    this._router.navigate(['/game'])
  
    

  }

  startStream() {

    const video = this.video.nativeElement;
    this._navigator = <any>navigator

    this._navigator.getUserMedia = (this._navigator.getUserMedia || this._navigator.webkitGetUserMedia || this._navigator.mozGetUserMedia || this._navigator.msGetUserMedia);

    this._navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.localStream = stream;
        video.src = window.URL.createObjectURL(stream)
        video.muted = true
        video.setAttribute('height', '150')
        video.setAttribute('width', '200')
        this.socket.emit('sending-video', video)
        video.play()
      })
  }

  stopStream() {
    const tracks = this.localStream.getTracks();
    tracks.forEach((track) => {
      track.stop()
    })
  }


}
