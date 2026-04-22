const API_URL = 'https://dummyjson.com/products';


// Все категории техники из API
const TECH_CATEGORIES = [
  'smartphones', 'laptops', 'tablets', 'tv', 'headphones', 
  'smartwatches', 'speakers', 'gaming', 'mobile-accessories',
  'audio', 'cameras', 'monitors', 'wearable-technology'
];

function transformProduct(product) {
  // Определяем категорию для отображения
  const reverseMap = {
    'smartphones': 'Смартфоны', 'laptops': 'Ноутбуки', 'tablets': 'Планшеты',
    'tv': 'Телевизоры', 'headphones': 'Наушники', 'smartwatches': 'Смарт-часы',
    'speakers': 'Колонки', 'gaming': 'Игры и гаджеты', 'mobile-accessories': 'Аксессуары',
    'audio': 'Аудиотехника', 'cameras': 'Фототехника', 'monitors': 'Мониторы'
  };
  
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    category: reverseMap[product.category] || product.category,
    image: product.thumbnail,
    description: product.description,
    rating: { rate: product.rating || 4.5 },
    stock: product.stock
  };
}

export const fetchItems = async () => {
  try {
    const response = await fetch(`${API_URL}?limit=150`);
    const data = await response.json();
    // Фильтруем только технику
    const techProducts = data.products.filter(product => 
      TECH_CATEGORIES.includes(product.category)
    );
    return techProducts.map(transformProduct);
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    return [];
  }
};

export const fetchItem = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const product = await response.json();
    if (!TECH_CATEGORIES.includes(product.category)) return null;
    return transformProduct(product);
  } catch (error) {
    console.error('Ошибка загрузки товара:', error);
    return null;
  }
};

export const createItem = async (data) => {
  return { ...data, id: Date.now() };
};

export const updateItem = async (id, data) => {
  return { ...data, id };
};

export const deleteItem = async (id) => {
  return { success: true };
};

export const fetchUsers = async () => {
  return [
    { id: 1, name: { firstname: 'Admin', lastname: '' }, email: 'admin@shop.com', address: { city: 'Moscow' } },
    { id: 2, name: { firstname: 'John', lastname: 'Doe' }, email: 'user@mail.com', address: { city: 'SPb' } },
  ];
};

