import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PipelineServiceService {

  static socket: any;

  constructor() {   }

  setupSocketConnection() {
    PipelineServiceService.socket = io.connect(environment.BASE_URL);
  }

  getSocketConnection(){
    return PipelineServiceService.socket
  }
}