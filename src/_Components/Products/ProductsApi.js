export async function getProducts(search = "") {
  const url = search 
    ? `http://localhost:8080/api/products?search=${encodeURIComponent(search)}` 
    : 'http://localhost:8080/api/products';

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`http://localhost:8080/api/products/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product with id: ${id}`);
  }

  return response.json();
}