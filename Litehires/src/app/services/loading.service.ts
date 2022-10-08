import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(@Inject(DOCUMENT) private document: Document) { }
  globalLoading(set: boolean){

    let loader = this.document.getElementById("globalLoader")

    if(loader)
    loader.style.display = (set)? "block" : "none";
  }

}
