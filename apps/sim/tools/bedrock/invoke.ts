import type { ToolConfig } from '@/tools/types'

interface BedrockInvokeParams {
  modelId: string
  prompt: string
}

interface BedrockInvokeResponse {
  success: boolean
  output: {
    content: string
    metadata: Record<string, any>
  }
}

export const bedrockInvokeTool: ToolConfig<BedrockInvokeParams, BedrockInvokeResponse> = {
  id: 'bedrock_invoke',
  name: 'AWS Bedrock Invoke',
  description: 'Invoke a model on AWS Bedrock.',
  version: '1.0.0',

  params: {
    modelId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the model to invoke.',
    },
    prompt: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The prompt to send to the model.',
    },
  },

  request: {
    url: '/api/bedrock/invoke',
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
        content: JSON.stringify(data.response, null, 2),
        metadata: data,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'The response from the model.' },
    metadata: {
      type: 'object',
      description: 'The full response from the model.',
    },
  },
}
