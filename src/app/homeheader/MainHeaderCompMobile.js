import React from 'react'
import SearchBarMobile from '../header/SearchBarMobile'
import HomeScan from '../scan/HomeScan'

const MainHeaderCompMobile = () => {
    return (
        <div>
            <div className="z-50">
                {/* Mobile View */}
                <div className="flex flex-row gap-1 p-5 justify-center md:hidden items-center w-full">
                    <SearchBarMobile
                        // onFocus={() => setIsSearchFocused(true)}
//                         onBlur={() => setIsSearchFocused(false)}
                    />
                    <div className="-mt-1"></div>
                    <HomeScan />
                </div>

            </div>
        </div>
    )
}

export default MainHeaderCompMobile