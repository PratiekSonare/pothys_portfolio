import React from 'react'
import Dropdown from './Dropdown'
import SearchBar from '../header/SearchBar'
import HomeScan from '../scan/HomeScan'

const MainHeaderComp = () => {
    return (
        <>
            <div className="hidden md:flex flex-row w-3/4 gap-2 items-center">
                <Dropdown />
                <div className="flex-1 w-full border rounded-lg">
                    <SearchBar
                        // onFocus={() => setIsSearchFocused(true)}
//                         onBlur={() => setIsSearchFocused(false)}
                    />
                </div>
                <HomeScan />
            </div>
        </>
    )
}

export default MainHeaderComp