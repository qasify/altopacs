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
import { Patient } from '../../types/Patient';
import { PATIENTS } from '../../mockData';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './examine.component.html',
  styleUrls: ['./examine.component.scss'],
})
export class ExamineComponent implements OnInit, OnDestroy {
  patient: Patient | undefined;
  feedback: string = '';

  private imageURL: string = 'assets/dicom/image1.dcm';
  private cornerStoneElement: HTMLElement | null = null;
  private imageRenderedListener: any;

  public toolMode: 'pan' | 'zoom' | 'contrast' | 'frame' = 'pan';
  public zoomScale: number = 1;
  public windowWidth: number = 1;
  public windowCenter: number = 1;
  public currentFrame: number = 1;
  public totalFrames: number = 1;

  readonly MIN_ZOOM_SCALE: number = 1;
  readonly MAX_ZOOM_SCALE: number = 20;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.queryParamMap.get('id');

    if (!patientId) {
      this.router.navigate(['/']); // Redirect to the root path
    } else {
      this.patient = PATIENTS.find((item)=>item.id.toString()===patientId)

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
        this.loadImage(this.imageURL);

        cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
        cornerstoneTools.setToolActive('StackScrollMouseWheel', {});

        cornerstoneTools.addTool(cornerstoneTools.PanTool);
        cornerstoneTools.addTool(cornerstoneTools.StackScrollTool);
        cornerstoneTools.addTool(cornerstoneTools.ZoomTool, {
          configuration: {
            invert: false,
            preventZoomOutsideImage: false,
            minScale: this.MIN_ZOOM_SCALE,
            maxScale: this.MAX_ZOOM_SCALE,
          },
        });
        cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
        this.setToolMode(this.toolMode);

        this.imageRenderedListener = (event: any) => {
          const viewport = cornerstone.getViewport(this.cornerStoneElement!)!;
          this.zoomScale = viewport.scale;
          this.windowCenter = parseFloat(viewport.voi.windowCenter.toFixed(2));
          this.windowWidth = parseFloat(viewport.voi.windowWidth.toFixed(2));
      
          const stackState = cornerstoneTools.getToolState(this.cornerStoneElement!, 'stack');
          if (stackState) {
            const stack = stackState.data[0];
            this.currentFrame = stack.currentImageIdIndex + 1;
          }
        };
        this.cornerStoneElement!.addEventListener('cornerstoneimagerendered', this.imageRenderedListener)
      }
    }
  }

  ngOnDestroy(): void {
    if (this.cornerStoneElement) {
      this.cornerStoneElement.removeEventListener('cornerstoneimagerendered', this.imageRenderedListener);
      cornerstone.disable(this.cornerStoneElement);
    }
  }

  async loadImage(imagePath: string): Promise<void> {
    var loaded = false;
    const dataSet =
      await cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.load(
        this.imageURL,
        cornerstoneWADOImageLoader.internal.xhrRequest
      );

    // dataset is now loaded, get the # of frames so we can build the array of imageIds
    var numFrames = dataSet.intString('x00280008');
    if (!numFrames) {
      return;
    }
    this.totalFrames = numFrames

    var imageIds = [];
    var imageIdRoot = 'wadouri:' + imagePath;

    for (var i = 0; i < numFrames; i++) {
      var imageId = imageIdRoot + '?frame=' + i;
      imageIds.push(imageId);
    }

    var stack = {
      currentImageIdIndex: 0,
      imageIds: imageIds,
    };

    // Load and cache the first image frame.  Each imageId cached by cornerstone increments
    // the reference count to make sure memory is cleaned up properly.
    cornerstone.loadAndCacheImage(imageIds[0]).then((image) => {
      cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.unload(imagePath);

      const element = document.getElementById('cornerstone-element')!;
      cornerstone.displayImage(element, image);
      if (loaded === false) {
        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);
        loaded = true;
      }
    });
  }

  setToolMode(mode: 'pan' | 'zoom' | 'contrast' | 'frame'): void {
    this.toolMode = mode;
    switch (mode) {
      case 'pan':
        cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
        break;
      case 'zoom':
        cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 });
        break;
      case 'contrast':
        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
        break;
      case 'frame':
        cornerstoneTools.setToolActive('StackScroll', { mouseButtonMask: 1 });
        break;
    }
  }

  updateZoom(event: Event): void {}

  updateContrast(event: Event): void {}

  nextFrame(): void {}

  previousFrame(): void {}

  updateSliders(): void {}

  handleSave(): void {
    // TODO: Saving feedback logic
    this.handleBack()
  }

  handleBack(): void {
    this.router.navigate(['/']);
  }
}
