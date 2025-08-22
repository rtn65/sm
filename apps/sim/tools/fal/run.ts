import type { ToolConfig } from '@/tools/types'

export const falRunTool: ToolConfig = {
  id: 'fal_run',
  name: 'Fal Run',
  description: 'Run a model on Fal.',
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
      description: 'Fal API Key',
    },
  },

  request: {
    url: (params) => `https://fal.run/${params.model}`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Key ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => params.input,
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
