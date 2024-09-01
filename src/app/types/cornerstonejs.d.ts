declare module '@cornerstonejs/dicom-image-loader' {
    interface WebWorkerManagerConfig {
      maxWebWorkers: number;
      startWebWorkersOnDemand: boolean;
    }
  
    interface ImageInfo {
      // ... properties from the ImageInfo interface
    }
  
    interface ImageIdInfo {
      // ... properties related to image ID information
    }
  
    const cornerstoneDICOMImageLoader: {
      external: {
        cornerstone: any;
      };
      webWorkerManager: {
        initialize(config: WebWorkerManagerConfig): void;
        terminateAllWebWorkers(): void;
      };
      loadImage(imageId: string): Promise<ImageInfo>;
      getImageId(imageId: string): Promise<ImageIdInfo>;
      loadAndCacheImage(imageId: string): Promise<ImageInfo>;
      cacheImage(imageId: string, imageInfo: ImageInfo): void;
      getImageFromCache(imageId: string): ImageInfo | undefined;
      clearImageCache(): void;
    };
  
    export default cornerstoneDICOMImageLoader;
  }