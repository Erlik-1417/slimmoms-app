import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../redux/auth/axiosConfig';
import { addProductOperation } from '../../redux/diary/diaryOperations';
import toast from 'react-hot-toast';
import { getLocalizedFoodName } from '../../utils/foodTranslations';
import './DiaryAddProductForm.css';

const DiaryAddProductForm = ({ date }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [weight, setWeight] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const getProductTitle = (product) => {
    if (!product) return '';
    return getLocalizedFoodName(product, i18n.language) || (typeof product.title === 'string' ? product.title : (product.title?.tr || product.title?.en || 'Ürün'));
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    const matched = products.find(p => {
      const title = getProductTitle(p).toLowerCase();
      const input = value.toLowerCase();
      return title === input;
    });

    if (matched) {
      setSelectedProduct(matched);
    } else {
      setSelectedProduct(null);
    }

    if (value.length > 2) {
      try {
        const { data } = await axiosInstance.get(`products?search=${encodeURIComponent(value)}`);
        setProducts(data);
        
        if (data.length > 0) {
          setSelectedProduct(data[0]);
        } else {
          setSelectedProduct(null);
        }
      } catch (err) {
        console.error('Product search error:', err.message);
      }
    } else {
      setProducts([]);
      setSelectedProduct(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && products.length > 0) {
      setSelectedProduct(products[0]);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    let productToSelect = selectedProduct;

    if (!productToSelect && products.length > 0) {
      productToSelect = products[0];
    }

    if (!productToSelect) {
      toast.error(t('diary.selectProduct'));
      return;
    }
    if (!weight) {
      toast.error(t('diary.enterGrams'));
      return;
    }

    setIsAdding(true);
    try {
      const resultAction = await dispatch(addProductOperation({
        date,
        productId: productToSelect._id,
        weight: Number(weight)
      }));
      
      if (addProductOperation.fulfilled.match(resultAction)) {
        toast.success(t('diary.added'));
        setSearchQuery('');
        setWeight('');
        setSelectedProduct(null);
        setProducts([]);
      } else {
        toast.error(t('diary.connectionError'));
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="add-product-form">
      <input
        placeholder={t('diary.productPlaceholder')}
        value={searchQuery}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        list="product-suggestions"
        className="product-input"
        required
      />
      {selectedProduct && searchQuery.length > 2 && (
        <div className="selected-product-hint">
          {i18n.language?.startsWith('tr') ? 'Seçildi: ' : 'Selected: '} 
          <strong>{getProductTitle(selectedProduct)}</strong>
        </div>
      )}
      <datalist id="product-suggestions">
        {products.map(p => (
          <option key={p._id} value={getProductTitle(p)} />
        ))}
      </datalist>

      <input
        placeholder={t('diary.gramPlaceholder')}
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="weight-input"
        required
      />
      <button type="submit" className="add-btn" disabled={isAdding}>
        {isAdding ? '...' : t('diary.addBtn')}
      </button>
    </form>
  );
};

export default DiaryAddProductForm;
