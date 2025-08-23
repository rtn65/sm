import { NextResponse, type NextRequest } from 'next/server'
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bucket, key, vectors: newVectors } = body

    if (!bucket || !key || !newVectors) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const s3Client = new S3Client({})

    let existingVectors: { id: string; vector: number[] }[] = []
    try {
      const getObjectCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
      const { Body } = await s3Client.send(getObjectCommand)
      if (Body) {
        const fileContent = await Body.transformToString()
        existingVectors = JSON.parse(fileContent)
      }
    } catch (error: any) {
      if (error.name !== 'NoSuchKey') {
        throw error
      }
      // If the file doesn't exist, we'll create it.
    }

    const updatedVectors = [...existingVectors, ...newVectors]

    const putObjectCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(updatedVectors, null, 2),
      ContentType: 'application/json',
    })

    await s3Client.send(putObjectCommand)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to perform S3 vector upsert',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
