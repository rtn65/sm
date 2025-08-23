export interface ChromaDBParams {
  collectionName: string
  chromaDBUrl?: string
}

export interface ChromaDBUpsertParams extends ChromaDBParams {
  documents: string[]
  metadatas: Record<string, any>[]
  ids: string[]
}

export interface ChromaDBSearchParams extends ChromaDBParams {
  queryTexts: string[]
  nResults?: number
  where?: Record<string, any>
}

export interface ChromaDBDeleteParams extends ChromaDBParams {
  ids: string[]
  where?: Record<string, any>
}

export interface ChromaDBUpsertResponse {
  success: boolean
}

export interface ChromaDBSearchResponse {
  success: boolean
  output: {
    content: string
    metadata: Record<string, any>
  }
}

export interface ChromaDBDeleteResponse {
  success: boolean
}
