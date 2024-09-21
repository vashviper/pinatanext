import { NextRequest, NextResponse } from 'next/server';
import PinataSDK from '@pinata/sdk';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { unlink } from 'fs/promises';

const pinata = new PinataSDK({ pinataJWTKey: process.env.PINATA_JWT });


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Create a temporary file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join('/tmp', file.name);
    await writeFile(tempPath, buffer);
    // Upload to IPFS
    const readableStream = require('fs').createReadStream(tempPath);
    const result = await pinata.pinFileToIPFS(readableStream, {
      pinataMetadata: {
        name: file.name,
      },
    });
    // Clean up the temporary file
    await unlink(tempPath);

    return NextResponse.json({ success: true, ipfsHash: result.IpfsHash });
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error uploading to IPFS' 
    }, { status: 500 });
  }
}