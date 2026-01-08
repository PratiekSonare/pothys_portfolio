'use client';

import dynamic from 'next/dynamic';

// Artificial delay of 2 seconds
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Wrap the import with a delay
const DelayedSearchResultsClient = dynamic(
  async () => {
    await delay(0);
    return import('./SearchResultsClient');
  },
  { ssr: false }
);

export default DelayedSearchResultsClient;
