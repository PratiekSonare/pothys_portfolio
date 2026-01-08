// components/CategoryCard.jsx
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const TemplateCard = ({ title, images, categorySlug }) => {
    const router = useRouter();
    const [discounts, setDiscounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/categories/discounts`);
                const data = await response.json();
                setDiscounts(data);
            } catch (error) {
                console.error('Category discount fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col bg-transparent rounded-lg py-5">
            <div className='block relative w-fit md:mb-3'>
                <span className="cursor-pointer group text-xl z-50 md:text-[40px] items-start text3">
                    {title}
                    <span className="absolute rounded-lg left-0 bottom-0 -z-50 w-0 h-[4px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
            </div>

            <div className="mb-5 mt-2 grid grid-cols-2 gap-2 md:flex md:flex-row md:justify-center md:gap-10 ">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className='flex cursor-pointer transform active:scale-95 scale-100  flex-col gap-1 p-2 bg-white rounded-lg hover:scale-105 transition-all ease-in-out duration-200 shadow-xl hover:shadow-2xl'
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            className='rounded-lg w-full md:w-full h-auto cursor-pointer'
                            onClick={() => router.push(`/category/${categorySlug}`)}
                        />
                        <span className='text-sm md:text-xl poppins-light text-start px-2 my-1'>{image.title}</span>
                        <div className='flex flex-row items-center justify-between gap-10 px-2'>
                            <div className='bg-red-500 h-5 md:h-7 w-[4px] md:w-[5px]'></div>
                            {loading ?
                                <span className='text3 text-xs md:text-xl text-end animate-pulse'>
                                    LOADING...
                                </span>
                                :
                                <span className='text3 text-xs md:text-xl text-end'>
                                    {discounts[image.slug] ? `MIN ${discounts[image.slug]}% OFF!` : `MAX DISCOUNTS`}
                                </span>
                            }

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplateCard;
