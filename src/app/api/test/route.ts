export async function GET() {
  console.log('SUPER SIMPLE TEST API')
  return Response.json({ message: 'Hello World', timestamp: Date.now() })
}