import { useRouter } from 'next/navigation'
import React from 'react'
import TemplateCard from '../TemplateCard'

const images = [
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/cleaning/hp_c&h_m_cleaners_480_250723.webp",
        title: "Cleaning Material & More",
        alt: "cleaning",
        slug: "all-purpose-cleaners"
    },
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/cleaning/hp_c&h_m_detergents-&-fabric-care_480_250723.webp",
        title: "Detergents & Fabric Care",
        alt: "cleaning",
        slug: "detergents-dishwash"
    },
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/cleaning/hp_c&h_m_freshner_480_250723.webp",
        title: "Room & Air Freshners",
        alt: "cleaning",
        slug: "bins-bathroom-ware"
    },
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/cleaning/hp_c&h_m_paper-disposables-&-garbage-bags_480_250723.webp",
        title: "Garbage & Disposals",
        alt: "cleaning",
        slug: "disposables-garbage-bag"
    },
]


const CategoryCardSn = () => {

    return (
        <TemplateCard
            title="Cleaning and Household"
            images={images}
            categorySlug="cleaning-household"
        />
    )
}

export default CategoryCardSn;