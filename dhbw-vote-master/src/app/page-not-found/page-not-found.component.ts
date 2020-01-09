import { OnInit, Component, Input } from '@angular/core';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
    
    @Input()
    displayText: string;

    constructor() { }

    ngOnInit(): void {

    }

}  