import {Component} from '@angular/core';
import {changeDetection} from '@demo/emulate/change-detection';
import {encapsulation} from '@demo/emulate/encapsulation';

@Component({
    selector: 'tui-loader-example-2',
    templateUrl: './index.html',
    styleUrls: ['./index.less'],
    encapsulation,
    changeDetection,
})
export class TuiLoaderExample2 {}
