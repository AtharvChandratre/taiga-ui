import {Component} from '@angular/core';
import {changeDetection} from '@demo/emulate/change-detection';
import {TuiDocExample, TuiRawLoaderContent} from '@taiga-ui/addon-doc';
import {TuiSizeL, TuiSizeXS} from '@taiga-ui/core';

@Component({
    selector: 'example-badge-notification',
    templateUrl: './badge-notification.template.html',
    changeDetection,
})
export class ExampleTuiBadgeNotificationComponent {
    readonly exampleModule: TuiRawLoaderContent = import(
        './examples/import/import-module.md?raw'
    );

    readonly exampleHtml: TuiRawLoaderContent = import(
        './examples/import/insert-template.md?raw'
    );

    readonly example1: TuiDocExample = {
        HTML: import('./examples/1/index.html?raw'),
    };

    readonly example2: TuiDocExample = {
        HTML: import('./examples/2/index.html?raw'),
        LESS: import('./examples/2/index.less?raw'),
    };

    readonly sizeVariants: ReadonlyArray<TuiSizeL | TuiSizeXS> = ['l', 'm', 's', 'xs'];

    size: TuiSizeL | TuiSizeXS = this.sizeVariants[0];
}
