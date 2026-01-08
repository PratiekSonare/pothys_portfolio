import { Separator } from '@/components/ui/separator';
import * as React from 'react';
import '../styles.css';
import SearchBar from './SearchBar';
import SearchbarMobile from './SearchBarMobile';

const HeaderParent = () => {
  return (
    <>
        <SearchBar />
        <SearchbarMobile />
    </>
  )
}

export default HeaderParent;