import categoryMap from "./categoryMap";

const slugify = (text) =>
  text.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

export async function generateStaticParams() {
  const paths = [];

  for (const [category, subcategories] of Object.entries(categoryMap)) {
    const categorySlug = slugify(category);
    paths.push({ slug: [categorySlug] }); // /category/bakery-cakes-dairy

    for (const subcategory of subcategories) {
      const subcategorySlug = slugify(subcategory);
      paths.push({ slug: [categorySlug, subcategorySlug] }); // /category/bakery-cakes-dairy/dairy
    }
  }

  return paths;
}