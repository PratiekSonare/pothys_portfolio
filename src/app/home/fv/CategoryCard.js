// pages/components/FruitsAndVeggies.jsx
import TemplateCard from '../TemplateCard';

const fvImages = [
    { src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/fv/hp_f&v_m_cuts-&-exotics_480_250923.webp", title: "Cuts & Exotics", alt: "fv", slug: "cuts-sprouts" },
    { src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/fv/hp_f&v_m_fresh-fruits_480_250923.webp", title: "Fresh Fruits", alt: "fv", slug: "fresh-fruits" },
    { src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/fv/hp_f&v_m_fresh-vegetables_480_250923.webp", title: "Fresh Vegetables", alt: "fv", slug: "fresh-vegetables" },
    { src: "https://cdn.jsdelivr.net/gh/PratiekSonare/test_deploy_pothys@main/public/category_images/fv/hp_f&v_m_herbs-&-seasoning_480_250923.webp", title: "Herbs, Seasoning", alt: "fv", slug: "herbs-seasonings" },
];

const CategoryCardFv = () => (
    <TemplateCard
        title="Fruits and Vegetables"
        images={fvImages}
        categorySlug="fruits-vegetables"
    />
);

export default CategoryCardFv;
