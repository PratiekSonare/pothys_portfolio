"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import HeaderParent from '../header/HeaderParent';
import EmployeeInfo from './EmployeeInfo';
import ComingSoon from './ComingSoon';
import '@/app/styles.css'

const Page = () => {
    // State to keep track of the selected button
    const [selectedComponent, setSelectedComponent] = useState(null);

    // Function to handle button clicks
    const handleButtonClick = (componentNumber) => {
        setSelectedComponent(componentNumber);
    };
    
    const button = 'p-5 bg-transparent text-blue-500 border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white'

    return (
        <div>
            <header className='top-0 header-sdw'>
                <HeaderParent />
            </header>

            <div className='my-10'></div>

            <div className='px-24 grid grid-cols-4 gap-5 text2'>
                {/* Admin Info Button */}
                <Button 
                    className={button}
                    onClick={() => handleButtonClick(1)}
                >
                    Admin Summary
                </Button>

                {/* Employee Settings Button */}
                <Button 
                    className={button}
                    onClick={() => handleButtonClick(2)}
                >
                    Employee Manager
                </Button>

                {/* Dynamic Pricing Button */}
                <Button 
                    className={button}
                    onClick={() => handleButtonClick(3)}
                >
                    Dynamic Pricing
                </Button>

                {/* Display Images, Discounts and More Button */}
                <Button 
                    className={button}
                    onClick={() => handleButtonClick(4)}
                >
                    Manage images, discounts and more...
                </Button>
            </div>

            <div className='mt-10'>
                {/* Conditional Rendering of Components */}
                {selectedComponent === 1 && <div><ComingSoon /></div>}
                {selectedComponent === 2 && <div><EmployeeInfo /></div>}
                {selectedComponent === 3 && <div><ComingSoon /></div>}
                {selectedComponent === 4 && <div><ComingSoon /></div>}
            </div>
        </div>
    );
};

export default Page;