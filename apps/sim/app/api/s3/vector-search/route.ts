import { NextResponse, type NextRequest } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

// Helper function to calculate cosine similarity
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0)
  const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0))
  const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0))
  if (magA === 0 || magB === 0) {
    return 0
  }
  return dotProduct / (magA * magB)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bucket, key, queryVector, topK } = body

    if (!bucket || !key || !queryVector) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const s3Client = new S3Client({})
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    const { Body } = await s3Client.send(getObjectCommand)
    if (!Body) {
      return NextResponse.json({ error: 'File not found in S3' }, { status: 404 })
    }

    const fileContent = await Body.transformToString()
    const vectors = JSON.parse(fileContent) as { id: string; vector: number[] }[]

    const similarities = vectors.map((v) => ({
      id: v.id,
      similarity: cosineSimilarity(queryVector, v.vector),
    }))

    similarities.sort((a, b) => b.similarity - a.similarity)

    const numResults = topK || 10
    const searchResults = similarities.slice(0, numResults)

    return NextResponse.json({ success: true, results: searchResults })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to perform S3 vector search',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
