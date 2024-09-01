import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as cornerstone from 'cornerstone-core';
// import * as cornerstoneTools from 'cornerstone-tools';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  private imageIndex: number = 0;
  private images: string[] = [
    'assets/dicom/image1.dcm',
    'assets/dicom/image2.dcm',
    'assets/dicom/image3.dcm',
  ];
  patientId: string | null = null;
  feedback: string = '';
  cornerStoneElement: HTMLElement | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.queryParamMap.get('id');

    if (!this.patientId) {
      this.router.navigate(['/']); // Redirect to the root path
    } else {
      // Initialize Cornerstone on the this.cornerStoneElement!
      this.cornerStoneElement = document.getElementById('cornerstone-element');
      cornerstone.enable(this.cornerStoneElement!);

      cornerstoneDICOMImageLoader.external.cornerstone = cornerstone

      // Load the first DICOM image
      this.loadImage(this.images[this.imageIndex]);
    }
  }

  loadImage(imagePath: string): void {//`imagefile:${imagePath}`
    const imageId = `imagefile:${imagePath}`

    cornerstone.loadImage(imageId).then(image => {
        cornerstone.displayImage(this.cornerStoneElement!, image);
    }).catch(error => {
        console.error('Error loading image:', error);
    });
  }

  zoomIn(): void {
    const viewport = cornerstone.getViewport(this.cornerStoneElement!);
    viewport!.scale += 0.1; // Adjust zoom increment as needed
    cornerstone.setViewport(this.cornerStoneElement!, viewport);
  }

  zoomOut(): void {
    const viewport = cornerstone.getViewport(this.cornerStoneElement!);
    viewport!.scale -= 0.1; // Adjust zoom decrement as needed
    cornerstone.setViewport(this.cornerStoneElement!, viewport);
  }

  increaseContrast(): void {
    const viewport = cornerstone.getViewport(this.cornerStoneElement!);
    viewport!.voi.windowWidth += 10; // Adjust contrast increment as needed
    cornerstone.setViewport(this.cornerStoneElement!, viewport);
  }

  decreaseContrast(): void {
    const viewport = cornerstone.getViewport(this.cornerStoneElement!);
    viewport!.voi.windowWidth -= 10; // Adjust contrast decrement as needed
    cornerstone.setViewport(this.cornerStoneElement!, viewport);
  }

  nextImage(): void {
    if (this.imageIndex < this.images.length - 1) {
      this.imageIndex++;
      this.loadImage(this.images[this.imageIndex]);
    }
  }

  previousImage(): void {
    if (this.imageIndex > 0) {
      this.imageIndex--;
      this.loadImage(this.images[this.imageIndex]);
    }
  }

  loadLocalImage(imageId: string): Promise<cornerstone.Image> {
    return new Promise((resolve, reject) => {
      // Load the image data (you can customize this part)
      // For example, read the file using FileReader or fetch from a local server
      // Here, I assume you have a function called 'loadImageData' that returns a Promise with the pixel data
  
      loadImageData(imageId)
        .then((pixelData) => {
          // Create a Cornerstone Image object
          const image = {
            imageId,
            minPixelValue: 0,
            maxPixelValue: 255,
            slope: 1.0,
            intercept: 0,
            windowCenter: 127,
            windowWidth: 255,
            getPixelData: () => pixelData,
          };
  
          resolve(image);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
