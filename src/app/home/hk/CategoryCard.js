import { useRouter } from 'next/navigation'
import React from 'react'
import TemplateCard from '../TemplateCard'

const images = [
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/hk/hp_GM-cleaning-needs_m_250723_06.webp",
        title: "Cleaning Needs",
        alt: "gardening",
        slug: "gardening"
    },
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/hk/hp_GM-storage-container_m_250723_05.webp",
        title: "Storage & More",
        alt: "flask-casserole",
        slug: "flask-casserole"
    },
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/hk/hp_GM100-199_m_250723_02.webp",
        title: "Broomsticks",
        alt: "home-furnishing",
        slug: "home-furnishing"
    },
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/hk/hp_GMStorefront-pressure-cooker_m_250723_03.webp",
        title: "Pressure Cookers",
        alt: "kitchen-accessories",
        slug: "kitchen-accessories"
    }
]

const CategoryCardHk = () => {

    return (
        <TemplateCard
            title="Home and Kitchen"
            images={images}
            categorySlug="kitchen-garden-pets"
        />
    )
}

export default CategoryCardHk;