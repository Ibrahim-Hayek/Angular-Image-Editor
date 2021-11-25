import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageCropperSampleComponent } from './pages/image-cropper-sample/image-cropper-sample.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/image-cropper-sample'
  },
  {
    path: 'image-cropper-sample',
    component: ImageCropperSampleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
