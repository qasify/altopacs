declare module 'cornerstone-wado-image-loader' {
    import { ImageLoader } from '@cornerstonejs/core';

    interface WADOImageLoader {
        loadImage: (imageId: string) => ImageLoader;
        configure: (options: any) => void;
        external: {
            cornerstone: any;
        };
    }

    const cornerstoneWADOImageLoader: any;

    export default cornerstoneWADOImageLoader;
}