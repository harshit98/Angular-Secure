import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/index';

@Component({
    moduleId: module.id,
    selector: 'message',
    templateUrl: 'message.component.html'
})

export class MessageComponent implements OnInit {
    message: any;
    
    constructor(private _message: MessageService) { }

    ngOnInit() {
        this._message.getMessage().subscribe(message => { this.message = message; });
    }
}
