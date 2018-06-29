import { Component, OnInit, ViewChild } from '@angular/core';
import * as io from 'socket.io-client'
import { NgForm } from '@angular/forms';
import { EventEmitter } from 'protractor';
import { ActivatedRoute, Params, Router } from '@angular/router';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  messageText: string;
  messages: Array<any>
  socket: SocketIOClient.Socket

  _navigator = <any>navigator;
  localStream;

  constructor(
  ) {
    this.socket = io.connect('http://localhost:8888')
  }

  @ViewChild('video') video: any;

  ngOnInit() {

    this.messages = new Array()

    this.socket.on('message-received', (data: any) => {
      this.messages.push(data.text)
      console.log(data)
      console.log(this.messages)
    })

  }

  sendMessage(){
    const message = {
      text: 'Fuuuuuuuuck'
    }
    this.socket.emit('send-message', message)
    console.log(message.text)
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
