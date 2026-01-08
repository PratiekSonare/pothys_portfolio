import { LuRouter as Router } from 'react-icons/lu'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import TemplateCard from '../TemplateCard'

const images = [
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/beverages/hp_bev_m_energy-drinks_480_250923.webp",
        title: "Energy Drinks",
        alt: "beverages",
        slug: "energy-soft-drinks"
    },
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/beverages/hp_bev_m_flavoured-&-soya-milk_480_250923.webp",
        title: "Flavoured Milk",
        alt: "beverages",
        slug: "coffee"
    },
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/beverages/hp_bev_m_health-drinks-&-supplements_480_250923.webp",
        title: "Health Drinks",
        alt: "beverages",
        slug: "health-medicine"
    },
    {
        src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/beverages/hp_bev_m_juices_480_250923.webp",
        title: "Juices",
        alt: "beverages",
        slug: "fruit-juices-drinks"
    },
]

const CategoryCardBe = () => {

    return (
        <TemplateCard
            title="Beverages"
            images={images}
            categorySlug="beverages"
        />
    )
}

export default CategoryCardBe;