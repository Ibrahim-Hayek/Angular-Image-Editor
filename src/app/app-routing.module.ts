import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageCropperSampleComponent } from './pages/image-cropper-sample/image-cropper-sample.component';

const routes: Routes = [
  {
    path: '',
    component: ImageCropperSampleComponent,
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
