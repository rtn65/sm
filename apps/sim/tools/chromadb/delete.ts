import type { ToolConfig } from '@/tools/types'
import type { ChromaDBDeleteParams, ChromaDBDeleteResponse } from './types'

export const chromadbDeleteTool: ToolConfig<ChromaDBDeleteParams, ChromaDBDeleteResponse> = {
  id: 'chromadb_delete',
  name: 'ChromaDB Delete',
  description: 'Delete documents from a ChromaDB collection.',
  version: '1.0.0',

  params: {
    collectionName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the collection to delete from.',
    },
    ids: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ids of the documents to delete.',
    },
    where: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'A where clause to filter which documents to delete.',
    },
    chromaDBUrl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The URL of the ChromaDB instance. Defaults to http://localhost:8000.',
    },
  },

  request: {
    url: (params) => `${params.chromaDBUrl || 'http://localhost:8000'}/api/v1/collections/${params.collectionName}/delete`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: (params) => ({
      ids: params.ids,
      where: params.where,
    }),
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
        error: error.detail || 'Failed to delete from ChromaDB',
      }
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the delete was successful.' },
  },
}
