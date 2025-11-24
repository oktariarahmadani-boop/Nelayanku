let editMode = false;
let currentEditId = null;

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  
  // Form submit handler
  document.getElementById('productForm').addEventListener('submit', handleSubmit);
  
  // Cancel button
  document.getElementById('cancelBtn').addEventListener('click', resetForm);
});

// Load all products
async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
    alert('Gagal memuat produk. Pastikan server berjalan.');
  }
}

// Display products in table
function displayProducts(products) {
  const tbody = document.getElementById('productsTableBody');
  
  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Belum ada produk</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(product => `
    <tr>
      <td>${product.id}</td>
      <td>${product.nama}</td>
      <td>${product.kategori}</td>
      <td>${formatPrice(product.harga)}/kg</td>
      <td><span class="card-badge">${product.stok}</span></td>
      <td>
        <button class="btn-edit" onclick="editProduct(${product.id})">Edit</button>
        <button class="btn-delete" onclick="deleteProduct(${product.id})">Hapus</button>
      </td>
    </tr>
  `).join('');
}

// Handle form submit (Add or Update)
async function handleSubmit(e) {
  e.preventDefault();
  
  const productData = {
    nama: document.getElementById('productName').value,
    kategori: document.getElementById('productCategory').value,
    harga: parseInt(document.getElementById('productPrice').value),
    stok: document.getElementById('productStock').value
  };

  try {
    let response;
    if (editMode) {
      // Update product
      response = await fetch(`/api/products/${currentEditId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
    } else {
      // Add new product
      response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
    }

    const result = await response.json();
    
    if (response.ok) {
      alert(editMode ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!');
      resetForm();
      loadProducts();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Gagal menyimpan produk. Pastikan server berjalan.');
  }
}

// Edit product
async function editProduct(id) {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    const product = products.find(p => p.id === id);
    
    if (product) {
      editMode = true;
      currentEditId = id;
      
      document.getElementById('productId').value = product.id;
      document.getElementById('productName').value = product.nama;
      document.getElementById('productCategory').value = product.kategori;
      document.getElementById('productPrice').value = product.harga;
      document.getElementById('productStock').value = product.stok;
      
      document.getElementById('submitBtn').textContent = 'Update Produk';
      document.getElementById('cancelBtn').style.display = 'inline-block';
      
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Gagal memuat data produk');
  }
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Yakin ingin menghapus produk ini?')) {
    return;
  }

  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    
    if (response.ok) {
      alert('Produk berhasil dihapus!');
      loadProducts();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Gagal menghapus produk');
  }
}

// Reset form
function resetForm() {
  editMode = false;
  currentEditId = null;
  
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  document.getElementById('submitBtn').textContent = 'Tambah Produk';
  document.getElementById('cancelBtn').style.display = 'none';
}

// Format price to IDR
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
}