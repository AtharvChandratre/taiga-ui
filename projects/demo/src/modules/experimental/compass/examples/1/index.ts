import {Component} from '@angular/core';
import {changeDetection} from '@demo/emulate/change-detection';
import {encapsulation} from '@demo/emulate/encapsulation';

@Component({
    selector: 'tui-compass-example-1',
    template: '<tui-compass></tui-compass>',
    encapsulation,
    changeDetection,
})
export class TuiCompassExample1 {}
