export const formatProducts = (rows) => {
  return rows.map(item => ({
    id: item.id,
    brand: item.brand,
    name: item.name,
    image_url: item.image_url,
    product_url: item.product_url,
    shade_note: item.shade_note,
    price_tier: item.price_tier,   
    category: item.category        
  }));
};
