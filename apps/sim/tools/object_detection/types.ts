export interface ObjectDetectionParams {
  image: string;
  apiKey: string;
}

export interface ObjectDetectionResponse {
  success: boolean;
  output: {
    objects: {
      label: string;
      confidence: number;
      x_min: number;
      y_min: number;
      x_max: number;
      y_max: number;
    }[];
  };
}
