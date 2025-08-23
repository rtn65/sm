import type { ToolConfig } from '@/tools/types'
import type { ChromaDBSearchParams, ChromaDBSearchResponse } from './types'

export const chromadbSearchTool: ToolConfig<ChromaDBSearchParams, ChromaDBSearchResponse> = {
  id: 'chromadb_search',
  name: 'ChromaDB Search',
  description: 'Search for documents in a ChromaDB collection.',
  version: '1.0.0',

  params: {
    collectionName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the collection to search in.',
    },
    queryTexts: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'The query texts to search for.',
    },
    nResults: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'The number of results to return. Defaults to 10.',
    },
    where: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'A where clause to filter results.',
    },
    chromaDBUrl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The URL of the ChromaDB instance. Defaults to http://localhost:8000.',
    },
  },

  request: {
    url: (params) => `${params.chromaDBUrl || 'http://localhost:8000'}/api/v1/collections/${params.collectionName}/query`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: (params) => ({
      query_texts: params.queryTexts,
      n_results: params.nResults || 10,
      where: params.where,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        content: JSON.stringify(data, null, 2),
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
