import { Injectable } from '@angular/core';
import { info } from 'console';

@Injectable({
  providedIn: 'root',
})
export class InfoboxService {
  private infoBoxId: string = 'InfoBoxPopUp';
  private infoBoxElement: HTMLDivElement;
  private infoboxTextField: HTMLSpanElement;
  private timerId: any | null = null;

  constructor() {
    this.infoBoxElement = this.createInfoBox();
    this.infoboxTextField = this.infoBoxElement.getElementsByTagName('p')[0];
  }

  showMessage(msg: string): void {
    this.infoBoxElement.style.display = 'block';
    this.infoboxTextField.innerText = msg;
    if (this.timerId != null) {
      clearTimeout(this.timerId);
    }
    this.timerId = setTimeout(() => {
      this.infoBoxElement.style.display = 'none';
      this.infoBoxElement.innerText = '';
    }, 1500);
  }

  private createInfoBox() {
    let infobox = document.createElement('div');
    infobox.id = this.infoBoxId;
    infobox.className =
      'absolute top-10 rounded-lg p-4 bg-white left-1/2 -translate-x-1/2 text-slate-700 font-bold';
    infobox.style.boxShadow = '0 0 10px darkslategrey';
    infobox.style.border = '1px solid darkslategrey';
    infobox.style.display = 'none';

    let textField = document.createElement('P');
    textField.id = 'info-box-text-field';
    infobox.appendChild(textField);

    let infoboxButtons = document.createElement('div');
    infoboxButtons.id = 'infobox-yes-no-buttons';
    infoboxButtons.style.display = 'none';
    infoboxButtons.innerHTML =
      "<button id='infobox-yes-button'>Yes</button><button id='infobox-no-button' class='ml-4'>No</button>";

    infobox.appendChild(infoboxButtons);

    infobox.style.textAlign = 'center';
    document.body.appendChild(infobox);
    return infobox;
  }
}
