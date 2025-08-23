import type { ToolConfig } from '@/tools/types'

interface S3VectorUpsertParams {
  bucket: string
  key: string
  vectors: { id: string; vector: number[] }[]
}

interface S3VectorUpsertResponse {
  success: boolean
}

export const s3VectorUpsertTool: ToolConfig<S3VectorUpsertParams, S3VectorUpsertResponse> = {
  id: 's3_vector_upsert',
  name: 'S3 Vector Upsert',
  description: 'Upsert vectors into a file stored in S3.',
  version: '1.0.0',

  params: {
    bucket: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The S3 bucket name.',
    },
    key: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The key of the file in the S3 bucket.',
    },
    vectors: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'The vectors to upsert.',
    },
  },

  request: {
    url: '/api/s3/vector-upsert',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => params,
  },

  transformResponse: async (response) => {
    if (response.ok) {
        return {
            success: true,
        }
    } else {
        const error = await response.json()
        return {
            success: false,
            error: error.message || 'Failed to upsert vectors to S3',
        }
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the upsert was successful.' },
  },
}
