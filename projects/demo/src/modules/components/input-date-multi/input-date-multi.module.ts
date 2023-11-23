import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TuiAddonDocModule, tuiGetDocModules} from '@taiga-ui/addon-doc';
import {TuiMobileCalendarDialogModule} from '@taiga-ui/addon-mobile';
import {
    TuiDropdownModule,
    TuiHintModule,
    TuiLinkModule,
    TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {TuiInputDateMultiModule} from '@taiga-ui/kit';

import {InheritedDocumentationModule} from '../abstract/inherited-documentation/inherited-documentation.module';
import {TuiInputDateMultiExample1} from './examples/1';
import {ExampleTuiInputDateMultiComponent} from './input-date-multi.component';

@NgModule({
    imports: [
        CommonModule,
        TuiLinkModule,
        TuiHintModule,
        TuiDropdownModule,
        TuiAddonDocModule,
        ReactiveFormsModule,
        TuiInputDateMultiModule,
        TuiMobileCalendarDialogModule,
        TuiTextfieldControllerModule,
        InheritedDocumentationModule,
        tuiGetDocModules(ExampleTuiInputDateMultiComponent),
    ],
    declarations: [ExampleTuiInputDateMultiComponent, TuiInputDateMultiExample1],
    exports: [ExampleTuiInputDateMultiComponent],
})
export class ExampleTuiInputDateMultiModule {}
