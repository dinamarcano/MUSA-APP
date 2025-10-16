export interface ImageData {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  metadata?: {
    size: number;
    type: string;
    dimensions: {
      width: number;
      height: number;
    };
    uploadDate: string;
  };
}

export interface ImageUploadData {
  file: File;
  preview: string;
  alt: string;
  caption: string;
}