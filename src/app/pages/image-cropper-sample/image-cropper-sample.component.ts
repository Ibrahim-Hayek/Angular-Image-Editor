import { Component, ViewChild, OnInit } from '@angular/core';
import { Dimensions, ImageCroppedEvent, ImageTransform } from '../../modules/image-cropper/interfaces/index';
import { base64ToFile } from '../../modules/image-cropper/utilities/blob.utils';
import { Options } from '@angular-slider/ngx-slider';
import { ToastrService } from 'ngx-toastr';
import { jsPDF } from 'jspdf';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-image-cropper-sample',
  templateUrl: './image-cropper-sample.component.html',
  styleUrls: ['./image-cropper-sample.component.scss']
})
export class ImageCropperSampleComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService
  ) { }

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = null;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  maintainAspectRatio = false;
  aspectRatio = 4 / 3;
  actions = [
    { alt: 'crop', label: 'Crop' },
    { alt: 'zoom', label: 'Zoom' },
    { alt: 'rotate', label: 'Rotate' },
    { alt: 'flip', label: 'Flip' },
    { alt: 'adjust', label: 'Adjust' },
    { alt: 'shadow', label: 'Shadow' },
  ];
  ratios = [
    { label: '1:1', value: 1 / 1 },
    { label: '3:2', value: 3 / 2 },
    { label: '4:3', value: 4 / 3 },
    { label: '16:9', value: 16 / 9 },
    { label: '18:6', value: 18 / 6 },
  ];
  selectedActionIndex = 1;
  srcChanged = false;
  brightness = 100;
  contrast = 100;
  saturate = 100;
  dropShadow = 100;
  grayscale = 0;
  blur = 0;
  hueRotate = 0;
  invert = 0;
  sepia = 0;
  filterStyles = '';
  ShadowX = 0;
  ShadowY = 0;
  ShadowBlur = 0;
  ShadowColor = '#000000';
  brightnessOptions: Options = {
    floor: 0,
    ceil: 200
  };
  contrastOptions: Options = {
    floor: 0,
    ceil: 200
  };
  blurOptions: Options = {
    floor: 0,
    ceil: 20
  };
  hueOptions: Options = {
    floor: 0,
    ceil: 360
  };
  invertOptions: Options = {
    floor: 0,
    ceil: 100
  };
  saturateOptions: Options = {
    floor: 0,
    ceil: 200
  };
  sepiaOptions: Options = {
    floor: 0,
    ceil: 100
  };
  grayscaleOptions: Options = {
    floor: 0,
    ceil: 100
  };
  cropCoor;
  imageBase64 = '';
  imageURL = '';
  usingUpload = true;

  ngOnInit(): void {
    this.getfilters();
    // IN CASE YOU WANT TO EDIT AN IMAGE USING ITS BASE64 OR IMAGEURL AND NOT BY UPLOADING THE IMAGE USE THE BELOW FUNCTION AND PASS YOUR LINK
    // this.initImage();
  }

  initImage(): void {
    // this.imageBase64 = 'data:image/png;base64,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';
    // OR
    this.imageURL = 'https://picsum.photos/600';
    this.usingUpload = false;
  }

  setRatio(ratio): void {
    if (ratio === 'free') {
      this.maintainAspectRatio = false;
    }
    else {
      this.maintainAspectRatio = true;
      this.aspectRatio = ratio;
    }
  }

  fileChangeEvent(event: any): void {
    this.ngxService.start();
    this.resetImage();
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
    this.cropCoor = {
      width: event.width,
      height: event.height
    };
  }

  imageLoaded(): void {
    this.showCropper = true;
    this.ngxService.stop();
  }

  cropperReady(sourceImageDimensions: Dimensions): void {
    this.srcChanged = true;
  }

  loadImageFailed(): void {
    this.ngxService.stop();
    this.toastr.error('Please upload only these files: JPEG, JPG, PNG', 'File is not compatible');
    this.croppedImage = '';
  }

  rotateLeft(): void {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight(): void {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate(): void {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }


  flipHorizontal(): void {
    this.srcChanged = false;
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
    this.srcChanged = true;
  }

  flipVertical(): void {
    this.srcChanged = false;
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
    this.srcChanged = true;
  }

  resetImage(): void {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
    this.brightness = 100;
    this.contrast = 100;
    this.saturate = 100;
    this.dropShadow = 100;
    this.grayscale = 0;
    this.blur = 0;
    this.hueRotate = 0;
    this.invert = 0;
    this.sepia = 0;
    this.ShadowX = 0;
    this.ShadowY = 0;
    this.ShadowBlur = 0;
    this.ShadowColor = '#000000';
    this.getfilters();
  }

  zoomOut(): void {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn(): void {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  toggleContainWithinAspectRatio(): void {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation(): void {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }

  download(): void {
    this.ngxService.start();
    const canvas = document.getElementById('image') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const img = document.getElementById('imageResult') as HTMLCanvasElement;
    canvas.width = this.cropCoor.width + Math.abs(this.ShadowX) + Math.abs(this.ShadowBlur);
    canvas.height = this.cropCoor.height + Math.abs(this.ShadowY) + Math.abs(this.ShadowBlur);
    ctx.filter = this.filterStyles;
    ctx.drawImage(img, 0, 0, this.cropCoor.width, this.cropCoor.height);
    const that = this;
    const dt = canvas.toBlob(function (blob): void {
      const url = window.URL.createObjectURL(new Blob([blob], { type: blob.type }));
      canvas.style.display = 'block';
      canvas.style.filter = `drop-shadow(' ${that.ShadowX}px ${that.ShadowY}px ${that.ShadowBlur}px${that.ShadowColor});`;
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-cropper-${new Date().toDateString()}`;
      link.click();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
      that.ngxService.stop();
    });
  }

  exportToPdf(): void {
    this.ngxService.start();
    const canvas = document.getElementById('image') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const img = document.getElementById('imageResult') as HTMLCanvasElement;
    canvas.width = this.cropCoor.width + Math.abs(this.ShadowX) + Math.abs(this.ShadowBlur);
    canvas.height = this.cropCoor.height + Math.abs(this.ShadowY) + Math.abs(this.ShadowBlur);
    ctx.filter = this.filterStyles;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, this.cropCoor.width, this.cropCoor.height);
    const doc = new jsPDF('p', 'px');
    const imgProps = doc.getImageProperties(canvas);
    const pdfWidth = doc.internal.pageSize.getWidth() - 40;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(canvas, 'png', 20, 20, pdfWidth, pdfHeight);
    doc.save(`image-cropper-pdf-${new Date()}`);
    this.ngxService.stop();
  }

  saveImage(): void {
    // HERE CALL YOUR API TO SAVE THE NEW BASE64 EDITED IMAGE
    // console.log('NEW IMAGE BASE64 is: ' + this.croppedImage);
  }

  getfilters(): void {
    this.filterStyles =
      ' brightness(' + this.brightness + '%)' +
      ' contrast(' + this.contrast + '%)' +
      ' blur(' + this.blur + 'px)' +
      ' hue-rotate(' + this.hueRotate + 'deg)' +
      ' invert(' + this.invert + '%)' +
      ' saturate(' + this.saturate + '%)' +
      ' sepia(' + this.sepia + '%)' +
      ' grayscale(' + this.grayscale + '%)' +
      ' drop-shadow(' + this.ShadowX + 'px ' + this.ShadowY + 'px ' + this.ShadowBlur + 'px ' + this.ShadowColor + ')';
  }

  adjustBrightness(event): void {
    this.brightness = event.value;
    this.getfilters();
  }

  adjustContrast(event): void {
    this.contrast = event.value;
    this.getfilters();
  }

  adjustBlur(event): void {
    this.blur = event.value;
    this.getfilters();
  }

  adjustHue(event): void {
    this.hueRotate = event.value;
    this.getfilters();
  }

  adjustInvert(event): void {
    this.invert = event.value;
    this.getfilters();
  }

  adjustSaturate(event): void {
    this.saturate = event.value;
    this.getfilters();
  }

  adjustSepia(event): void {
    this.sepia = event.value;
    this.getfilters();
  }

  adjustGrayscale(event): void {
    this.grayscale = event.value;
    this.getfilters();
  }
}
