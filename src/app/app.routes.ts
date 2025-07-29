import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content.component';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacypolicyComponent } from './privacy-policy/privacy-policy.component';

export const routes: Routes = [
    {path: '', component: MainContentComponent},
    { path: 'imprint', component: ImprintComponent },
    { path: 'privacy-policy', component: PrivacypolicyComponent },
];
