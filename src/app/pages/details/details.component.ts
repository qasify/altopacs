import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

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

      cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
      cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

      // Initialize Cornerstone Tools
      cornerstoneTools.external.cornerstone = cornerstone;
      cornerstoneTools.init();
      cornerstoneTools.addTool(cornerstoneTools.PanTool);
      cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 }); // Enable pan with left mouse button

      // Load the first DICOM image
      this.loadImage(this.images[this.imageIndex]);

    }
  }

  loadImage(imagePath: string): void {
    const imageId = `wadouri:${imagePath}`;

    cornerstone
      .loadImage(imageId)
      .then((image) => {
        cornerstone.displayImage(this.cornerStoneElement!, image);
      })
      .catch((error) => {
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
}
