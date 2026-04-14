const API_URL = 'https://dummyjson.com/products';

// Все категории техники
const TECH_CATEGORIES = [
  'smartphones',
  'laptops',
  'tablets',
  'mobile-accessories',
  'laptops-accessories',
  'computer-accessories',
  'audio',
  'headphones',
  'earphones',
  'smart-home',
  'home-automation',
  'gaming',
  'gaming-accessories',
  'tv',
  'televisions',
  'monitors',
  'cameras',
  'drones',
  'wearable-technology',
  'smartwatches',
  'power-banks',
  'chargers',
  'cables',
  'speakers',
  'bluetooth-speakers'
];

function transformProduct(product) {
  // Определяем подкатегорию для отображения
  let displayCategory = product.category;
  
  const categoryMap = {
    'smartphones': 'Смартфоны',
    'laptops': 'Ноутбуки',
    'tablets': 'Планшеты',
    'tv': 'Телевизоры',
    'televisions': 'Телевизоры',
    'monitors': 'Мониторы',
    'headphones': 'Наушники',
    'audio': 'Аудиотехника',
    'speakers': 'Колонки',
    'smart-home': 'Умный дом',
    'gaming': 'Игровые устройства',
    'cameras': 'Фототехника',
    'smartwatches': 'Смарт-часы',
    'wearable-technology': 'Гаджеты',
    'mobile-accessories': 'Аксессуары'
  };
  
  return {
    ...product,
    image: product.thumbnail,
    price: product.price,
    title: product.title,
    category: categoryMap[product.category] || product.category,
    originalCategory: product.category,
    description: product.description,
    rating: product.rating,
    stock: product.stock,
    brand: product.brand
  };
}

export async function fetchItems(limit = 200) {
  try {
    const response = await fetch(`${API_URL}?limit=${limit}`);
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
}

// Получить товары по категории
export async function fetchByCategory(category, limit = 50) {
  try {
    const response = await fetch(`${API_URL}/category/${category}?limit=${limit}`);
    const data = await response.json();
    return data.products.map(transformProduct);
  } catch (error) {
    console.error('Ошибка загрузки категории:', error);
    return [];
  }
}

export async function fetchItemById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const product = await response.json();
    if (!TECH_CATEGORIES.includes(product.category)) {
      return null;
    }
    return transformProduct(product);
  } catch (error) {
    console.error('Ошибка загрузки товара:', error);
    return null;
  }
}

export async function fetchItem(id) {
  return fetchItemById(id);
}

export async function createItem(item) {
  return { ...item, id: Date.now(), image: item.image || item.thumbnail };
}

export async function fetchUsers() {
  return [
    { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' },
    { id: 2, username: 'user1', email: 'user1@example.com', role: 'user' },
    { id: 3, username: 'user2', email: 'user2@example.com', role: 'user' },
  ];
}

export async function deleteItem(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    return await response.json();
  } catch (error) {
    console.error('Ошибка удаления:', error);
    return null;
  }
}

export async function addItem(item) {
  return { ...item, id: Date.now() };
}

export async function updateItem(id, updatedData) {
  return { id, ...updatedData };
}