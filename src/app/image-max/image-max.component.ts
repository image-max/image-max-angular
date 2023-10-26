import { Component, ElementRef, Input, OnInit, HostListener, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResizeObserver } from '@juggle/resize-observer';

interface imageInfo {
  name: string,
  type: string,
  aspectRatio: number,
  averageColor: string,
  versions: imageVersion[]
}
interface imageVersion {
  format: string,
  sizeKB: number,
  width: number,
  height: number
}
@Component({
  selector: 'image-max',
  templateUrl: './image-max.component.html',
  styleUrls: ['./image-max.component.scss']
})
export class ImageMaxComponent implements OnInit {

  @Input() fileType: string
  @Input() fileSizeWidth: string
  @Input() fileSizeHeight: string
  @Input() debug: boolean = false
  @Input() file: string;
  @Input() style: string;
  @Input() class: string;
  @Input() ngClass: string;
  imageUrl: string
  imageSize: { width: number, height: number }
  imageData: imageInfo
  resizeObserver: ResizeObserver
  selectedImage: imageVersion
  constructor(
    private http: HttpClient,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.resizeObserver = new ResizeObserver(this.onResizeObserver)
  }

  ngOnInit(): void {
    this.getImageData()
    this.resizeObserver.observe(this.elementRef.nativeElement)
  }

  onResizeObserver = (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
    this.calculateInitialSize();
    this.loadImage()
  }

  getImageData(): void {
    this.http.get('../assets/' + this.file + '-manifest.json').subscribe((data: imageInfo) => {
      this.imageData = data
      this.calculateInitialSize()
      this.loadImage()
    })
  }

  calculateInitialSize(): void {
    const element = this.elementRef.nativeElement;
    const computedStyle = getComputedStyle(element);
    let width = element.clientWidth || Number(computedStyle.width);
    let height = element.clientHeight || Number(computedStyle.height);
    if (isNaN(width)) {
      width = this.fileSizeWidth || 500
      height = width / this.imageData.aspectRatio
    } else if (isNaN(height)) {
      height = this.fileSizeHeight || 300
      width = height * this.imageData.aspectRatio
    }
    this.imageSize = { width, height }
  }

  loadImage(): void {
    const sortedImagesVersion = this.imageData.versions.sort((firstImageVersion: imageVersion, secondImageVersion: imageVersion) =>
      secondImageVersion.width - firstImageVersion.width
    )
    const selectedImage = sortedImagesVersion.find(imageVersion => {
      if (this.fileType) {
        return imageVersion.width >= this.imageSize.width && imageVersion.height >= this.imageSize.height && imageVersion.format === this.fileType
      }
      else {
        return imageVersion.width >= this.imageSize.width && imageVersion.height >= this.imageSize.height
      }
    })
    this.selectedImage = selectedImage || sortedImagesVersion[0]
    this.imageUrl = `../assets/${this.file}-${this.selectedImage.width}.${this.selectedImage.format}`
  }

}

