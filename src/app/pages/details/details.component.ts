import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  private image: string = 'assets/dicom/image1.dcm';
  currentFrame: number = 0;
  totalFrames: number = 0;

  patientId: string | null = null;
  feedback: string = '';
  private cornerStoneElement: HTMLElement | null = null;

  public toolMode: 'zoom' | 'contrast' | 'image' = 'zoom'; // Changed to public
  public zoomScale: number = 1; // Initial zoom scale
  public contrastWidth: number = 400; // Initial contrast width

  readonly MIN_ZOOM_SCALE: number = 1;
  readonly MAX_ZOOM_SCALE: number = 10;
  readonly MIN_CONTRAST_WIDTH: number = 0;
  readonly MAX_CONTRAST_WIDTH: number = 2000;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.queryParamMap.get('id');

    if (!this.patientId) {
      this.router.navigate(['/']); // Redirect to the root path
    } else {
      this.cornerStoneElement = document.getElementById('cornerstone-element');
      if (this.cornerStoneElement) {
        //Add Image loader
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

        //Add tools
        cornerstoneTools.external.cornerstone = cornerstone;
        cornerstoneTools.external.Hammer = Hammer;
        cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
        cornerstoneTools.init();

        // Load the first DICOM image
        cornerstone.enable(this.cornerStoneElement);
        this.loadImage(this.image);

        // Add and enable the Pan tool
        const PanTool = cornerstoneTools.PanTool;
        cornerstoneTools.addTool(PanTool);
        cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 }); // Enable pan with left mouse button

        // Add event listener for mouse wheel
        this.cornerStoneElement.addEventListener(
          'wheel',
          this.handleMouseWheel.bind(this)
        );
      }
    }
  }

  ngOnDestroy(): void {
    if (this.cornerStoneElement) {
      cornerstone.disable(this.cornerStoneElement);
      this.cornerStoneElement.removeEventListener(
        'wheel',
        this.handleMouseWheel.bind(this)
      );
    }
  }

  loadImage(imagePath: string): void {
    const imageId = `wadouri:${imagePath}`;

    cornerstone
      .loadImage(imageId)
      .then((image) => {
        cornerstone.displayImage(this.cornerStoneElement!, image);
        // this.totalFrames = image.data.string('x00280008') || 1; // Number of frames
        // cornerstone.setFrame(this.cornerStoneElement!, this.currentFrame);
      })
      .catch((error) => {
        console.error('Error loading image:', error);
      });
  }

  handleMouseWheel(event: WheelEvent): void {
    event.preventDefault();

    const delta = event.deltaY > 0 ? -1 : 1; // Scroll up = -1, Scroll down = 1

    const viewport = cornerstone.getViewport(this.cornerStoneElement!);

    switch (this.toolMode) {
      case 'zoom':
        this.zoomScale += delta * 0.1;
        this.zoomScale = Math.max(
          this.MIN_ZOOM_SCALE,
          Math.min(this.zoomScale, this.MAX_ZOOM_SCALE)
        );
        viewport!.scale = this.zoomScale;
        break;
      case 'contrast':
        this.contrastWidth += delta * 10;
        this.contrastWidth = Math.max(
          this.MIN_CONTRAST_WIDTH,
          Math.min(this.contrastWidth, this.MAX_CONTRAST_WIDTH)
        );
        viewport!.voi.windowWidth = this.contrastWidth;
        break;
      case 'image':
        if (delta < 0) {
          this.nextFrame();
        } else {
          this.previousFrame();
        }
        return; // Do not update viewport for image switching
    }

    cornerstone.setViewport(this.cornerStoneElement!, viewport);

    // Update sliders to reflect changes
    this.updateSliders();
  }

  setToolMode(mode: 'zoom' | 'contrast' | 'image'): void {
    this.toolMode = mode;
    this.updateSliders();
  }

  updateZoom(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.zoomScale = parseFloat(target.value);
    this.zoomScale = Math.max(
      this.MIN_ZOOM_SCALE,
      Math.min(this.zoomScale, this.MAX_ZOOM_SCALE)
    );
    const viewport = cornerstone.getViewport(this.cornerStoneElement!);
    viewport!.scale = this.zoomScale;
    cornerstone.setViewport(this.cornerStoneElement!, viewport);
  }

  updateContrast(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.contrastWidth = parseFloat(target.value);
    this.contrastWidth = Math.max(
      this.MIN_CONTRAST_WIDTH,
      Math.min(this.contrastWidth, this.MAX_CONTRAST_WIDTH)
    );
    const viewport = cornerstone.getViewport(this.cornerStoneElement!);
    viewport!.voi.windowWidth = this.contrastWidth;
    cornerstone.setViewport(this.cornerStoneElement!, viewport);
  }

  nextFrame(): void {
    if (this.currentFrame < this.totalFrames) {
      this.currentFrame++;
      // this.loadImage(this.images[this.imageIndex]);
    }
  }

  previousFrame(): void {
    if (this.currentFrame> 0) {
      this.currentFrame--;
      // this.loadImage(this.images[this.imageIndex]);
    }
  }

  updateSliders(): void {
    const zoomSlider = document.getElementById(
      'zoom-slider'
    ) as HTMLInputElement;
    const contrastSlider = document.getElementById(
      'contrast-slider'
    ) as HTMLInputElement;

    if (zoomSlider) {
      zoomSlider.value = this.zoomScale.toString();
    }

    if (contrastSlider) {
      contrastSlider.value = this.contrastWidth.toString();
    }
  }

  handleSave():void {
    // TODO: Saving feedback logic
    this.router.navigate(['/']);
  }
}
