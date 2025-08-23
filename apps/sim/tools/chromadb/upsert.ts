import type { ToolConfig } from '@/tools/types'
import type { ChromaDBUpsertParams, ChromaDBUpsertResponse } from './types'

export const chromadbUpsertTool: ToolConfig<ChromaDBUpsertParams, ChromaDBUpsertResponse> = {
  id: 'chromadb_upsert',
  name: 'ChromaDB Upsert',
  description: 'Upsert documents into a ChromaDB collection.',
  version: '1.0.0',

  params: {
    collectionName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the collection to upsert to.',
    },
    documents: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'The documents to upsert.',
    },
    metadatas: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'The metadatas to upsert.',
    },
    ids: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ids to upsert.',
    },
    chromaDBUrl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The URL of the ChromaDB instance. Defaults to http://localhost:8000.',
    },
  },

  request: {
    url: (params) => `${params.chromaDBUrl || 'http://localhost:8000'}/api/v1/collections/${params.collectionName}/add`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: (params) => ({
      documents: params.documents,
      metadatas: params.metadatas,
      ids: params.ids,
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
        error: error.detail || 'Failed to upsert to ChromaDB',
      }
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the upsert was successful.' },
  },
}
