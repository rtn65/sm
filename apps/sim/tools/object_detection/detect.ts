import type { ObjectDetectionParams, ObjectDetectionResponse } from '@/tools/object_detection/types'
import type { ToolConfig } from '@/tools/types'

export const objectDetectionTool: ToolConfig<ObjectDetectionParams, ObjectDetectionResponse> = {
  id: 'object_detection',
  name: 'Object Detection',
  description: 'Detect objects in an image',
  version: '1.0.0',

  params: {
    image: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The image to process. This should be a base64 encoded image.',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'API key for the Object Detection API',
    },
  },

  request: {
    url: 'https://api.api-ninjas.com/v1/objectdetection',
    method: 'POST',
    headers: (params: ObjectDetectionParams) => ({
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ObjectDetectionParams) => {
      const formData = new FormData()
      formData.append('image', params.image)
      return formData
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        objects: data.map((obj: any) => ({
          label: obj.label,
          confidence: obj.confidence,
          x_min: obj.x_min,
          y_min: obj.y_min,
          x_max: obj.x_max,
          y_max: obj.y_max,
        })),
      },
    }
  },

  outputs: {
    objects: {
      type: 'array',
      description: 'Array of detected objects',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string', description: 'The label of the detected object' },
          confidence: { type: 'number', description: 'The confidence score of the detection' },
          x_min: { type: 'number', description: 'The x-coordinate of the top-left corner of the bounding box' },
          y_min: { type: 'number', description: 'The y-coordinate of the top-left corner of the bounding box' },
          x_max: { type: 'number', description: 'The x-coordinate of the bottom-right corner of the bounding box' },
          y_max: { type: 'number', description: 'The y-coordinate of the bottom-right corner of the bounding box' },
        },
      },
    },
  },
}
