import type { ToolConfig } from '@/tools/types'

interface S3VectorSearchParams {
  bucket: string
  key: string
  queryVector: number[]
  topK?: number
}

interface S3VectorSearchResponse {
  success: boolean
  output: {
    content: string
    metadata: Record<string, any>
  }
}

export const s3VectorSearchTool: ToolConfig<S3VectorSearchParams, S3VectorSearchResponse> = {
  id: 's3_vector_search',
  name: 'S3 Vector Search',
  description: 'Search for vectors in a file stored in S3.',
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
    queryVector: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'The vector to search for.',
    },
    topK: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'The number of results to return. Defaults to 10.',
    },
  },

  request: {
    url: '/api/s3/vector-search',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => params,
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        content: JSON.stringify(data.results, null, 2),
        metadata: data,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'The search results.' },
    metadata: {
      type: 'object',
      description: 'The full search results.',
    },
  },
}
