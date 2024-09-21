# Next.js IPFS Upload Project with Pinata

This project is a Next.js application that allows users to upload text (.txt) or PDF (.pdf) files to IPFS using Pinata's pinning service.

## Features

- File selection for .txt and .pdf files
- File upload to IPFS via Pinata
- Display of the IPFS link after successful upload
- Error handling and user feedback

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, set up your environment variables by creating a `.env.local` file in the root directory with the following content:

```
PINATA_JWT=your_pinata_jwt_token
PINATA_GATEWAY=your_pinata_gateway_url
NEXT_PUBLIC_GATEWAY_URL=your_public_gateway_url
```

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `components/FileUpload.tsx`: React component for file upload interface
- `app/api/upload/route.ts`: API route for handling file uploads to IPFS
- `app/page.tsx`: Main page component
- `styles/FileUpload.module.css`: Styles for the FileUpload component

## Technologies Used

- Next.js 14
- React 18
- Pinata SDK (pinata-web3)
- Axios for HTTP requests
- TypeScript

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Pinata SDK Documentation](https://github.com/PinataCloud/Pinata-SDK)

## Deployment

This project can be easily deployed on the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
