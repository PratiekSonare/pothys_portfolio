"use client"
import React, { useState, useEffect } from 'react'
import '../styles.css'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '../../components/ui/separator'
import { useRouter } from 'next/navigation'
import { LuBaby as Baby, LuBanana as Banana, LuBone as Bone, LuSparkles as BrushCleaning, LuCable as Cable, LuCake as Cake, LuCupSoda as CupSoda, LuFish as Fish, LuHam as Hamburger, LuHeart as Heart, LuShirt as Shirt, LuWheat as Wheat } from 'react-icons/lu'


const FilterMobile = ({ selectedDiscounts, handleDiscountChange }) => {

    const [activeCategory, setActiveCategory] = useState(null);

    const discountOptions = [
        { id: "fiftyPercent", label: "20% and more off" },
        { id: "thirtyPercent", label: "10% and more off" },
    ];

    const router = useRouter();

    const [toggle, setToggle] = useState(false);


    const categories = [
        { name: "Fruits & Vegetables", route: "/category/fruits-vegetables", logo: <Banana /> },
        { name: "Foodgrains, Oil & Masala", route: "/category/foodgrains-oil-masala", logo: <Wheat /> },
        { name: "Bakery, Cakes & Dairy", route: "/category/bakery-cakes-dairy", logo: <Cake /> },
        { name: "Beverages", route: "/category/beverages", logo: <CupSoda /> },
        { name: "Eggs, Meat & Fish", route: "/category/eggs-meat-fish", logo: <Fish /> },
        { name: "Cleaning & Household", route: "/category/cleaning-household", logo: <BrushCleaning /> },
        { name: "Beauty & Hygiene", route: "/category/beauty-hygiene", logo: <Heart /> },
        { name: "Apparel", route: "/category/apparel", logo: <Shirt /> },
        { name: "Baby Care", route: "/category/baby-care", logo: <Baby /> },
        { name: "Electronics", route: "/category/electronics", logo: <Cable /> },
        { name: "Kitchen, Garden & Pets", route: "/category/kitchen-garden-pets", logo: <Bone /> },
        { name: "Snacks & Branded Foods", route: "/category/snacks-branded-foods", logo: <Hamburger /> },
    ];

    const categoryMap = {
        "Apparel": ["Men's Apparel", "Women's Apparel"],
        "Baby Care": [
            "Baby Accessories",
            "Baby Bath & Hygiene",
            "Baby Food & Formula",
            "Diapers & Wipes",
            "Feeding & Nursing",
            "Mothers & Maternity"
        ],
        "Bakery, Cakes & Dairy": [
            "Bakery Snacks",
            "Breads & Buns",
            "Cakes & Pastries",
            "Cookies, Rusk & Khari",
            "Dairy",
            "Gourmet Breads",
            "Ice Creams & Desserts",
            "Non Dairy"
        ],
        "Beauty & Hygiene": [
            "Bath & Hand Wash",
            "Feminine Hygiene",
            "Fragrances & Deos",
            "Hair Care",
            "Health & Medicine",
            "Makeup",
            "Men's Grooming",
            "Oral Care",
            "Sexual Wellness",
            "Skin Care"
        ],
        "Beverages": [
            "Coffee",
            "Energy & Soft Drinks",
            "Fruit Juices & Drinks",
            "Health Drink, Supplement",
            "Tea",
            "Water"
        ],
        "Cleaning & Household": [
            "All Purpose Cleaners",
            "Bins & Bathroom Ware",
            "Car & Shoe Care",
            "Detergents & Dishwash",
            "Disposables, Garbage Bag",
            "Fresheners & Repellents",
            "Mops, Brushes & Scrubs",
            "Party & Festive Needs",
            "Pooja Needs",
            "Sports & Fitness",
            "Stationery",
            "Toys & Games"
        ],
        "Eggs, Meat & Fish": [
            "Eggs",
            "Fish & Seafood",
            "Marinades",
            "Mutton & Lamb",
            "Pork & Other Meats",
            "Poultry",
            "Sausages, Bacon & Salami"
        ],
        "Electronics": [
            "Audio devices",
            "Beauty & Grooming",
            "Cameras & Accessories",
            "Electrical Accessories",
            "Home & Kitchen Appliance",
            "Home Appliances",
            "Kitchen Appliances",
            "Phone & Laptop Accessory",
            "Phone, Laptop & Tablets",
            "Smart Wearables"
        ],
        "Fashion": [
            "Fashion Essentials",
            "Footwear",
            "Kids Apparel",
            "Men's Apparel",
            "Travel",
            "Women's Apparel"
        ],
        "Food Court": [
            "Burgers & Sandwiches",
            "Cake & Pastry Delights",
            "Cold Beverages",
            "Hot Beverages",
            "Rolls & Wraps",
            "Snack Time"
        ],
        "Foodgrains, Oil & Masala": [
            "Atta, Flours & Sooji",
            "Dals & Pulses",
            "Dry Fruits",
            "Edible Oils & Ghee",
            "Masalas & Spices",
            "Organic Staples",
            "Rice & Rice Products",
            "Salt, Sugar & Jaggery"
        ],
        "Fruits & Vegetables": [
            "Cuts & Sprouts",
            "Exotic Fruits & Veggies",
            "Flower Bouquets, Bunches",
            "Fresh Fruits",
            "Fresh Vegetables",
            "Herbs & Seasonings",
            "Organic Fruits & Vegetables"
        ],
        "Gourmet & World Food": [
            "Cereals & Breakfast",
            "Chocolates & Biscuits",
            "Cooking & Baking Needs",
            "Dairy & Cheese",
            "Drinks & Beverages",
            "Oils & Vinegar",
            "Pasta, Soup & Noodles",
            "Sauces, Spreads & Dips",
            "Snacks, Dry Fruits, Nuts",
            "Tinned & Processed Food"
        ],
        "Kitchen, Garden & Pets": [
            "Appliances & Electricals",
            "Bakeware",
            "Cookware & Non Stick",
            "Crockery & Cutlery",
            "Electronics & Devices ",
            "Flask & Casserole",
            "Gardening",
            "Home Furnishing",
            "Kitchen Accessories",
            "Pet Food & Accessories",
            "Steel Utensils",
            "Storage & Accessories"
        ],
        "Paan Corner": ["Smoking Supplies"],
        "Snacks & Branded Foods": [
            "Biscuits & Cookies",
            "Breakfast Cereals",
            "Chocolates & Candies",
            "Frozen Veggies & Snacks",
            "Indian Mithai",
            "Noodle, Pasta, Vermicelli",
            "Pickles & Chutney",
            "Ready To Cook & Eat",
            "Snacks & Namkeen",
            "Spreads, Sauces, Ketchup"
        ]
    };

    const slugify = (str) =>
        str
            .toLowerCase()
            .replace(/[\s&]+/g, "-")
            .replace(/[,\/]+/g, "")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");


    useEffect(() => {
        if (toggle) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [toggle]);

    return (
        <div className="flex md:hidden w-fit relative items-center justify-center shadow-xl">
            {/* Toggle Button */}
            <div className='z-100'>
                <button
                    onClick={() => setToggle(!toggle)}
                    className="px-2 py-2 rounded-lg bg-blue-600 transition-colors duration-300 ease-in-out"
                >
                    <img
                        src={toggle ? 'https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/funnel-x.svg' : 'https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/funnel.svg'}
                        alt={toggle ? 'Hide Filters' : 'Show Filters'}
                        className="w-4 h-4 invert"
                    />
                </button>
            </div>

            {/* Sliding Filter Panel */}
            <div
                className={`z-50 absolute top-1/2 right-1/2 translate-x-1/2 w-screen h-full transform transition-transform duration-500 ease-in-out ${!toggle ? "-translate-y-[5000px] " : "translate-y-0"
                    }`}
            >
                <div className="flex flex-row gap-2 p-5">

                    {/* Categories */}
                    <div className="bg-white p-5 rounded-lg shadow-md overflow-y-auto">

                        <div className='flex flex-row justify-between items-center'>
                            <p className="text3 text-xl mb-2">Categories</p>
                            <button
                                onClick={() => setToggle(false)}
                                className="scale-125 text-gray-600 hover:text-black transition duration-200"
                            >
                                ✖
                            </button>
                        </div>

                        <div className='max-h-[80vh] overflow-y-auto pr-2'>
                            {categories.map((category, index) => {
                                const categoryName = category.name;
                                const isOpen = activeCategory === categoryName;
                                const hasSubcategories = categoryMap[categoryName]?.length > 0;
    
                                return (
                                    <div key={index} className="mb-1">
                                        <div className='flex flex-row gap-2 justify-start items-center group'>
    
                                            <div className={`scale-90 text-gray-600 group-hover:text-red-500 ${isOpen ? 'text-red-500 text2' : 'text-gray-600'}`}>{category.logo}</div>
                                            <button
                                                className="block relative w-fit"
                                                onClick={() => {
                                                    if (hasSubcategories) {
                                                        setActiveCategory(isOpen ? null : categoryName); // Toggle
                                                    } else {
                                                        router.push(`/category/${slugify(categoryName)}`);
                                                    }
                                                }}
                                            >
                                                <p className={`text0 text-xs text-start text-gray-600 mt-2 cursor-pointer group ${isOpen ? 'text-red-500 text2' : ''}`}>
                                                    {categoryName}
                                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                                                </p>
                                            </button>
                                        </div>
    
                                        {/* Subcategories if open */}
                                        {isOpen && hasSubcategories && (
                                            <div className="ml-4 mt-1 flex flex-col gap-1 text1">
                                                {categoryMap[categoryName].map((sub, subIndex) => (
                                                    <button
                                                        key={subIndex}
                                                        onClick={() =>
                                                            router.push(`/category/${slugify(categoryName)}/${slugify(sub)}`)
                                                        }
                                                        className="text-xs ml-4 text-gray-500 hover:text-blue-600 text-left"
                                                    >
                                                        {sub}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white p-5 rounded-lg shadow-md h-fit">
                        <div className="flex flex-col gap-2">
                            <div className='flex flex-row justify-between items-center'>
                                <p className="text3 text-xl mb-2">Filters</p>
                                <button
                                    onClick={() => setToggle(false)}
                                    className="scale-125 text-gray-600 hover:text-black transition duration-200"
                                >
                                    ✖
                                </button>
                            </div>

                            <Separator className="my-2" />

                            {/* Discount */}
                            <div className="flex flex-col mb-2">
                                <p className="text1 text-lg text-gray-800">Discount</p>
                                {discountOptions.map((option) => (
                                    <div key={option.id} className="flex flex-row items-center text0 space-x-2 ml-4 mt-2">
                                        <Checkbox
                                            id={option.id}
                                            checked={selectedDiscounts[option.id]}
                                            onCheckedChange={() => handleDiscountChange(option.id)}
                                        />
                                        <label htmlFor={option.id} className="text-gray-600 text-sm leading-none">
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterMobile