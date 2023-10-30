import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResizeObserver } from '@juggle/resize-observer';

interface imageInfo {
  name: string;
  type: string;
  aspectRatio: number;
  averageColor: string;
  versions: imageVersion[];
}
interface imageVersion {
  format: string;
  sizeKB: number;
  width: number;
  height: number;
}
@Component({
  selector: 'image-max',
  templateUrl: './image-max.component.html',
  styleUrls: ['./image-max.component.scss'],
})
export class ImageMaxComponent implements AfterViewInit {
  @Input() fileType: string;
  @Input() fileSizeWidth: string;
  @Input() fileSizeHeight: string;
  @Input() debug: boolean = false;
  @Input() file: string;
  @Input() style: string;
  @Input() class: string;
  @Input() ngClass: string;

  @ViewChild('img', { static: false }) img: ElementRef;

  imageUrl: string;
  imageData: imageInfo;
  resizeObserver: ResizeObserver;
  selectedImage: imageVersion;
  constructor(private http: HttpClient, private renderer: Renderer2) {
    this.resizeObserver = new ResizeObserver(this.onResizeObserver);
  }

  ngAfterViewInit(): void {
    this.getImageData();
    this.resizeObserver.observe(this.img.nativeElement);
  }

  onResizeObserver = (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
    this.loadImage();
  };

  getImageData(): void {
    this.http.get('../assets/' + this.file + '-manifest.json').subscribe((data: imageInfo) => {
      this.imageData = data;
      this.loadImage();
    });
  }

  calculateInitialSize(): { width: number; height: number } {
    const width = this.img.nativeElement.clientWidth || this.img.nativeElement.clientHeight * this.imageData.aspectRatio;
    const height = this.img.nativeElement.clientHeight || this.img.nativeElement.clientWidth / this.imageData.aspectRatio;
    return { width, height };
  }

  loadImage(): void {
    const imageSize = this.calculateInitialSize();
    const sortedImagesVersion = this.imageData?.versions.sort((imageVersionA: imageVersion, imageVersionB: imageVersion) => imageVersionA.width - imageVersionB.width);
    const selectedImage = sortedImagesVersion?.find((imageVersion) => {
      if (this.fileType) {
        return imageVersion.width >= imageSize.width && imageVersion.height >= imageSize.height && imageVersion.format === this.fileType;
      } else {
        return imageVersion.width >= imageSize.width && imageVersion.height >= imageSize.height;
      }
    });
    if (this.selectedImage && selectedImage) {
      if (selectedImage.width > this.selectedImage.width || selectedImage.height > this.selectedImage.height) {
        this.selectedImage = selectedImage;
        this.imageUrl = `../assets/${this.file}-${this.selectedImage?.width}.${this.selectedImage?.format}`;
      }
    } else if (selectedImage) {
      this.selectedImage = selectedImage;
      this.imageUrl = `../assets/${this.file}-${this.selectedImage?.width}.${this.selectedImage?.format}`;
    }
  }
}
