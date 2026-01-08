import { useRouter } from 'next/navigation'
import React from 'react'
import TemplateCard from '../TemplateCard'

const images = [
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/snacks/hp_sbf_m_biscuits-&-namkeens_480_250923.webp",
        title: "Biscuits & Namkeens",
        alt: "fv",
        slug: "biscuits-cookies"
    },
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/snacks/hp_sbf_m_breakfast-cereals_480_250923.webp",
        title: "Breakfast & Cereals",
        alt: "fv",
        slug: "breakfast-cereals"
    },
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/snacks/hp_sbf_m_pasta-sauces-&-more_480_270723.webp",
        title: "Pasta Sauces & More",
        alt: "fv",
        slug: "spreads-sauces-ketchup"
    },
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/snacks/hp_sbf_m_sweet-cravings_480_250923.webp",
        title: "Sweet Cravings & More",
        alt: "fv",
        slug: "snacks-namkeen"
    },
]

const CategoryCardSn = () => {

    return (
        <TemplateCard
            title="Chai time, snacks and more..."
            images={images}
            categorySlug="snacks-branded-foods"
        />
    )
}

export default CategoryCardSn;