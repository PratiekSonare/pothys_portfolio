import { useRouter } from 'next/navigation'
import React from 'react'
import TemplateCard from '../TemplateCard'


    const images = [
        {
            src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/bh/hp_b&h_m_-makeup_480_250923.webp",
            title: "Makeup",
            alt: "beverages",
            slug: "makeup"
        },
        {
            src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/bh/hp_b&h_m_big-pack-bigger-saving bf_480_250923.webp",
            title: "Perfumes & Deos",
            alt: "beverages",
            slug: "fragrances-deos"
        },
        {
            src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/bh/hp_b&h_m_mens-shaving_480_250923.webp",
            title: "Mens Shaving",
            alt: "beverages",
            slug: "mens-grooming"
        },
        {
            src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/bh/hp_b&h_m_minimum-30-off_480_250923.webp",
            title: "Skin Care",
            alt: "beverages",
            slug: "skin-care"
        },
    ]


const CategoryCardBh = () => {

    return (
        <TemplateCard
            title="Beauty and Hygiene"
            images={images}
            categorySlug="beauty-hygiene"
        />
    )
}

export default CategoryCardBh;