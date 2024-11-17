import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.REACT_APP_SANITY_DATASET,
  token: process.env.REACT_APP_SANITY_TOKEN, // This should ideally be on the server side for security
  apiVersion: '2022-03-07', // Use the current date to ensure the latest features
  useCdn: false, // Set to false for real-time updates, true if you want to use the CDN for faster performance
});

// Set up the image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

export default client;
