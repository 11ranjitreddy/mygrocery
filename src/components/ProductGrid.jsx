import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from './ProductCard';

const ProductGrid = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Get search query from URL params
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
    
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (query) {
       const searchTerm = query.toLowerCase().trim();
      filtered = filtered.filter(product => {
        const name = product.name.toLowerCase();
        const description = product.description.toLowerCase();
        const category = product.category.toLowerCase();
        
        // Check if any field starts with the search term (highest priority)
        const startsWithMatch = 
          name.startsWith(searchTerm) ||
          description.startsWith(searchTerm) ||
          category.startsWith(searchTerm);
        
        // Check if any field contains the search term
        const containsMatch = 
          name.includes(searchTerm) ||
          description.includes(searchTerm) ||
          category.includes(searchTerm);
        
        // Check for word boundary matches (words that start with search term)
        const wordBoundaryMatch = 
          name.split(' ').some(word => word.startsWith(searchTerm)) ||
          description.split(' ').some(word => word.startsWith(searchTerm)) ||
          category.split(' ').some(word => word.startsWith(searchTerm));
        
        return startsWithMatch || containsMatch || wordBoundaryMatch;
      });
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchParams]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shop by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-6">
          <p className="text-gray-600">
            Search results for "{searchQuery}" - {filteredProducts.length} products found
          </p>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} searchQuery={searchQuery} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-600">
            {searchQuery 
              ? `No products match your search for "${searchQuery}"`
              : `No products available in ${selectedCategory} category`
            }
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 btn-primary"
          >
            View All Products
          </button>
        </div>
      )}

      {/* Load More Button (if needed) */}
      {filteredProducts.length > 8 && (
        <div className="text-center mt-8">
          <button className="btn-secondary">
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;