import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Path to the JSON file in the public directory
    const jsonFilePath = path.join(process.cwd(), 'public', 'articles', 'articles.json');
    
    // Read the JSON file
    const fileContents = await fs.readFile(jsonFilePath, 'utf8');
    const articlesData = JSON.parse(fileContents);
    
    return NextResponse.json(articlesData);
  } catch (error) {
    console.error('Error reading articles.json:', error);
    
    // Return a proper error response
    return NextResponse.json(
      { 
        error: 'Failed to fetch articles',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}