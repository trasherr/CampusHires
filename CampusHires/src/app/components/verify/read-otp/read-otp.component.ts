import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-read-otp',
  templateUrl: './read-otp.component.html',
  styleUrls: ['./read-otp.component.scss']
})
export class ReadOtpComponent implements OnInit {

  @Input() otpEmail: string = "";
  @Output() otpValue = new EventEmitter<string>();
  otpForm: any = FormGroup ;
  
  constructor(private fb: FormBuilder) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.max(999999), Validators.min(100000)]],
        });
   }

  ngOnInit(): void {
  }

  submitOTP(o:string){
    console.log(o);
    this.otpValue.emit(o);
  }

}
