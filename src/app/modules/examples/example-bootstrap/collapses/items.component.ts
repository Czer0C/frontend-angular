import { Component } from '@angular/core';

declare const bootstrap: any;

@Component({
  selector: 'app-collapse',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent {

  closeCollapse() {
    const myCollapse = document.getElementById('collapseWidthJavascript')
    new bootstrap.Collapse(myCollapse, {
      hide: true,
    })
  }

  showCollapse() {
    const myCollapse = document.getElementById('collapseWidthJavascript')
    new bootstrap.Collapse(myCollapse, {
      show: true,
    })
  }

  toggleCollapse() {
    const myCollapse = document.getElementById('collapseWidthJavascript')
    new bootstrap.Collapse(myCollapse, {
      toggle: true,
    })
  }

}
