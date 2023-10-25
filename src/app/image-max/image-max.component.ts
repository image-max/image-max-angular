/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Input, NgZone, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'image-max',
  templateUrl: './image-max.component.html',
  styleUrls: ['./image-max.component.scss']
})
export class ImageMaxComponent implements AfterViewInit, OnInit {
  imageUrl: string;
  @Input() altText: string;
  @Input() manifest: any;
  @Input() cssStyles: { [key: string]: string };
  selectedImage: string;
  width = 500;
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private http: HttpClient,
    private zone: NgZone) { }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit() {
    const componentSize = this.determineComponentSize();
    this.selectedImage = this.selectBestImage(componentSize);
    const observer = new ResizeObserver(entries => {
      this.zone.run(() => {
        this.width = entries[0].contentRect.width;
        console.log(this.width, "this.width=--==-")
      });
    });

    observer.observe(this.elementRef.nativeElement);
    // Calculate missing dimensions and maintain aspect ratio
    // this.calculateAndApplyAspectRatio(componentSize);
  }

  private determineComponentSize(): { width?: number; height?: number } {
    const style = getComputedStyle(this.elementRef.nativeElement);
    // Check for manual settings using component inputs (e.g., width and height).
    const width = this.elementRef.nativeElement.style.width ? parseInt(this.elementRef.nativeElement.style.width) : undefined;
    const height = this.elementRef.nativeElement.style.height ? parseInt(this.elementRef.nativeElement.style.height) : undefined;

    if (width && height) {
      // Both width and height are specified manually.
      return { width, height };
    }

    // If only one of width or height is specified manually, calculate the missing dimension based on the aspect ratio.
    const aspectRatio = this.getAspectRatio();
    if (width) {
      return { width, height: width / aspectRatio };
    }
    if (height) {
      return { width: height * aspectRatio, height };
    }

    // If no manual settings, check for styles and CSS classes.
    if (style.width && style.height) {
      return {
        width: 700,
        height: 108
      };
    }

    // If no width or height in styles, you can check for CSS classes.
    const classes = this.elementRef.nativeElement.classList;
    for (const className of classes) {
      // Implement logic to handle specific CSS classes if needed.
      if (className === 'custom-size') {
        // Return a predefined size for the 'custom-size' class.
        return { width: 300, height: 200 };
      }
    }

    // If no size is specified anywhere, you can return default dimensions.
    return { width: 300, height: 200 }; // Default size if no size is specified.
  }
  private selectBestImage(size: { width?: number; height?: number }): string {
    if (!this.manifest || !this.manifest.versions || this.manifest.versions.length === 0) {
      // Handle the case where there's no manifest or no images in the manifest.
      return ''; // Return an empty string or a default image URL.
    }
    // Sort the images in the manifest by size in ascending order.
    const sortedImages = this.manifest.versions.sort((a, b) => a.width - b.width);
    for (const image of sortedImages) {
      if (size.width && image.width >= size.width) {
        //console.log(image,"image-=-=-=-=");
        if (!image.downloaded) {
          return `../../assets/${this.manifest.name}-${image.width}.${image.format}` // image.url;
        }
      }
    }

    // If no appropriate image is found, return the largest available image.
    const largestImage = sortedImages[sortedImages.length - 1];
    return largestImage.url;
  }

  private downloadAndDisplayImage(imageUrl: string): void {
    this.http.get(imageUrl, { responseType: 'blob' }).subscribe(
      (imageBlob: Blob) => {
        const imageUrl = URL.createObjectURL(imageBlob);

        // this.updateDownloadStatus(componentSize.width, componentSize.height);

        // Remove the background color if applied.
        this.renderer.removeStyle(this.elementRef.nativeElement, 'background-color');
        this.renderer.setAttribute(this.elementRef.nativeElement, 'src', imageUrl);
      },
      (error) => {
        console.error('Failed to download the image', error);
      }
    );
  }

  private calculateAndApplyAspectRatio(size: { width?: number; height?: number }): void {
    if (size.width && !size.height) {
      // Calculate height based on aspect ratio
      const aspectRatio = this.getAspectRatio();
      size.height = size.width / aspectRatio;
    } else if (size.height && !size.width) {
      // Calculate width based on aspect ratio
      const aspectRatio = this.getAspectRatio();
      size.width = size.height * aspectRatio;
    }

    // Apply the calculated dimensions to the component's element
    this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${size.width}px`);
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${size.height}px`);
  }

  private getAspectRatio(): number {
    if (this.manifest && this.manifest.aspectRatio) {
      // If your manifest file provides an aspectRatio property, use it.
      return this.manifest.aspectRatio;
    }

    // If the aspect ratio is not provided in the manifest, you can fetch image dimensions.
    const img = new Image();
    img.src = this.selectedImage;

    // Wait for the image to load and then calculate the aspect ratio.
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      // Ensure that both dimensions are available before calculating the aspect ratio.
      if (width && height) {
        const aspectRatio = width / height;
        // You might want to store this aspect ratio for future use.
        return aspectRatio;
      } else {
        // Provide a default aspect ratio if image dimensions are not available.
        return 16 / 9; // Default 16:9 aspect ratio
      }
    };

    // Default aspect ratio if the image fails to load or the dimensions are unavailable.
    return 16 / 9; // Default 16:9 aspect ratio
  }

  // (window:resize)="onWindowResize($event)" 
  // onWindowResize(e) {
  //   console.log('height:', e.target.innerHeight,'width:', e.target.innerWidth)
  //   const componentSize = this.determineComponentSize();
  //   this.selectedImage = this.selectBestImage(componentSize);
  //   this.downloadAndDisplayImage(this.selectedImage);
  // }
}

