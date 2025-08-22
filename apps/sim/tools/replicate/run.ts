import type { ToolConfig } from '@/tools/types'

export const replicateRunTool: ToolConfig = {
  id: 'replicate_run',
  name: 'Replicate Run',
  description: 'Run a model on Replicate.',
  version: '1.0.0',

  params: {
    model: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The model to run.',
    },
    input: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description: 'The input to the model.',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Replicate API Key',
    },
  },

  request: {
    url: 'https://api.replicate.com/v1/predictions',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Token ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
        version: params.model,
        input: params.input,
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
    content: { type: 'string', description: 'The output of the model.' },
    metadata: {
      type: 'object',
      description: 'The full output of the model.',
    },
  },
}
