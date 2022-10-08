import {  Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { createPopper } from "@popperjs/core";

@Component({
  selector: 'app-index-dropdown',
  templateUrl: './index-dropdown.component.html',
  styleUrls: ['./index-dropdown.component.scss']
})
export class IndexDropdownComponent implements OnInit {
  dropdownPopoverShow = false;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef | any;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef | any;
  ngOnInit() {}
  toggleDropdown(event:any) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
      this.createPoppper();
    }
  }
  createPoppper() {
    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
  }
}
