'use client';

import { Suspense } from 'react';
import SearchResultsClient from './SearchResultsClient';
import DelayedSearchResultsClient from './DelayedSearchResults';

export default function SearchResultsPage() {
    return (
        <Suspense
            fallback={<span className='text1 text-4xl'>Loading...</span>}>
            <DelayedSearchResultsClient />
        </Suspense >
    );
}
