import { NextResponse, type NextRequest } from 'next/server'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { modelId, prompt } = body

    if (!modelId || !prompt) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const client = new BedrockRuntimeClient({})

    const command = new InvokeModelCommand({
      modelId,
      body: JSON.stringify({ prompt }),
      contentType: 'application/json',
      accept: 'application/json',
    })

    const response = await client.send(command)
    const responseBody = JSON.parse(new TextDecoder().decode(response.body))

    return NextResponse.json({ success: true, response: responseBody })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to invoke Bedrock model',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
