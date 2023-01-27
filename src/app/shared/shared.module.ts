import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupComponent} from './popup/popup.component';
import {RouterModule} from '@angular/router';
import {PopupMeetingComponent} from './popup-meeting/popup-meeting.component';
import {FileUrlPipe} from './pipes/file-url.pipe';
import { TrimDirective } from './directives/trim.directive';

const exportDeclarations = [PopupComponent, PopupMeetingComponent, FileUrlPipe, TrimDirective];

@NgModule({
   declarations: [...exportDeclarations],
   imports: [CommonModule, RouterModule],
   exports: [exportDeclarations],
})
export class SharedModule {}
