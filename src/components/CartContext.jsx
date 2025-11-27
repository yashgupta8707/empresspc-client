import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Generate cart key based on user
  const getCartKey = (userId = null) => {
    if (userId || (user && user._id)) {
      return `empress_cart_${userId || user._id}`;
    }
    return 'empress_cart_guest';
  };

  // Load cart from localStorage
  const loadCartFromStorage = (userId = null) => {
    try {
      const cartKey = getCartKey(userId);
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        return Array.isArray(parsedCart) ? parsedCart : [];
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return [];
  };

  // Save cart to localStorage
  const saveCartToStorage = (cartData, userId = null) => {
    try {
      const cartKey = getCartKey(userId);
      localStorage.setItem(cartKey, JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  // Sync cart with server (for logged-in users)
  const syncCartWithServer = async (userId) => {
    if (!userId) return;
    
    try {
      setIsSyncing(true);
      
      // Get server cart
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const serverCart = await response.json();
        
        // Get local cart
        const localCart = loadCartFromStorage();
        
        // Merge carts (server takes precedence for conflicts)
        const mergedCart = mergeCartItems(localCart, serverCart.items || []);
        
        // Update local state and storage
        setCart(mergedCart);
        saveCartToStorage(mergedCart, userId);
        
        // Update server with merged cart
        await updateServerCart(userId, mergedCart);
      } else if (response.status === 404) {
        // No server cart exists, upload local cart
        const localCart = loadCartFromStorage();
        if (localCart.length > 0) {
          await updateServerCart(userId, localCart);
        }
        setCart(localCart);
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
      // Fallback to local cart if server sync fails
      const localCart = loadCartFromStorage(userId);
      setCart(localCart);
    } finally {
      setIsSyncing(false);
    }
  };

  // Update cart on server
  const updateServerCart = async (userId, cartItems) => {
    if (!userId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cartItems }),
      });

      if (!response.ok) {
        console.error('Failed to update server cart:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating server cart:', error);
    }
  };

  // Merge cart items (handles duplicates and conflicts)
  const mergeCartItems = (localCart, serverCart) => {
    const merged = [...serverCart]; // Start with server cart (more authoritative)
    
    // Add local items that don't exist on server
    localCart.forEach(localItem => {
      const existsOnServer = merged.find(serverItem => 
        serverItem.cartItemId === localItem.cartItemId
      );
      
      if (!existsOnServer) {
        merged.push(localItem);
      }
    });
    
    return merged;
  };

  // Transfer guest cart to user cart
  const transferGuestCartToUser = async (userId) => {
    try {
      const guestCart = loadCartFromStorage(null); // Load guest cart
      
      if (guestCart.length > 0) {
        // Get current user cart
        const userCart = loadCartFromStorage(userId);
        
        // Merge guest cart with user cart
        const mergedCart = mergeCartItems(guestCart, userCart);
        
        // Save merged cart to user storage
        saveCartToStorage(mergedCart, userId);
        
        // Update server
        await updateServerCart(userId, mergedCart);
        
        // Clear guest cart
        localStorage.removeItem('empress_cart_guest');
        
        // Update state
        setCart(mergedCart);
      }
    } catch (error) {
      console.error('Error transferring guest cart:', error);
    }
  };

  // Initialize cart on mount and auth changes
  useEffect(() => {
    const initializeCart = async () => {
      setIsLoading(true);
      
      if (isAuthenticated() && user?._id) {
        // User is logged in
        
        // First, transfer any guest cart items
        await transferGuestCartToUser(user._id);
        
        // Then sync with server
        await syncCartWithServer(user._id);
      } else {
        // Guest user - load from local storage
        const guestCart = loadCartFromStorage();
        setCart(guestCart);
      }
      
      setIsLoading(false);
    };

    initializeCart();
  }, [user, isAuthenticated]);

  // Save cart whenever it changes
  useEffect(() => {
    if (!isLoading && !isSyncing) {
      const userId = isAuthenticated() && user?._id ? user._id : null;
      saveCartToStorage(cart, userId);
      
      // Also update server for logged-in users
      if (userId) {
        updateServerCart(userId, cart);
      }
    }
  }, [cart, isLoading, isSyncing, user, isAuthenticated]);

  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    setCart((prev) => {
      // Create a unique identifier for the cart item including color and size
      const itemId = `${product._id || product.id}_${selectedColor || 'default'}_${selectedSize || 'default'}`;
      
      const existingItem = prev.find((item) => item.cartItemId === itemId);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prev.map((item) =>
          item.cartItemId === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        const newItem = { 
          ...product, 
          quantity,
          selectedColor,
          selectedSize,
          cartItemId: itemId,
          // Ensure we have the correct ID field
          id: product._id || product.id,
          // Store the original product data
          originalProduct: product,
          // Add timestamp for sorting
          addedAt: new Date().toISOString(),
          // Add user reference for server sync
          userId: user?._id || null
        };
        
        return [...prev, newItem];
      }
    });
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = async () => {
    setCart([]);
    
    // Also clear from server for logged-in users
    if (isAuthenticated() && user?._id) {
      await updateServerCart(user._id, []);
    }
  };

  const isInCart = (productId, selectedColor = null, selectedSize = null) => {
    const itemId = `${productId}_${selectedColor || 'default'}_${selectedSize || 'default'}`;
    return cart.some(item => item.cartItemId === itemId);
  };

  const getCartItemQuantity = (productId, selectedColor = null, selectedSize = null) => {
    const itemId = `${productId}_${selectedColor || 'default'}_${selectedSize || 'default'}`;
    const item = cart.find(item => item.cartItemId === itemId);
    return item ? item.quantity : 0;
  };

  // Get total items count
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const itemPrice = item.price || 0;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  // Get total original price (before discounts)
  const getTotalOriginalPrice = () => {
    return cart.reduce((total, item) => {
      const originalPrice = item.originalPrice || item.price || 0;
      return total + (originalPrice * item.quantity);
    }, 0);
  };

  // Get total savings
  const getTotalSavings = () => {
    return getTotalOriginalPrice() - getTotalPrice();
  };

  // Get cart item count (unique items)
  const getCartItemCount = () => {
    return cart.length;
  };

  // Get cart summary
  const getCartSummary = () => {
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const totalOriginalPrice = getTotalOriginalPrice();
    const totalSavings = getTotalSavings();
    const itemCount = getCartItemCount();

    return {
      totalItems,
      totalPrice,
      totalOriginalPrice,
      totalSavings,
      itemCount,
      isEmpty: cart.length === 0,
      hasDiscounts: totalSavings > 0
    };
  };

  // Update item options (color, size) without changing quantity
  const updateItemOptions = (cartItemId, selectedColor, selectedSize) => {
    setCart((prev) => {
      const item = prev.find(item => item.cartItemId === cartItemId);
      if (!item) return prev;

      // Create new item ID with updated options
      const newItemId = `${item.id}_${selectedColor || 'default'}_${selectedSize || 'default'}`;
      
      // Check if item with new options already exists
      const existingItem = prev.find(item => item.cartItemId === newItemId);
      
      if (existingItem) {
        // Merge quantities and remove old item
        return prev
          .filter(item => item.cartItemId !== cartItemId)
          .map(item => 
            item.cartItemId === newItemId 
              ? { ...item, quantity: item.quantity + existingItem.quantity }
              : item
          );
      } else {
        // Update the item with new options
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, cartItemId: newItemId, selectedColor, selectedSize }
            : item
        );
      }
    });
  };

  // Force sync with server (useful for manual refresh)
  const forceSync = async () => {
    if (isAuthenticated() && user?._id) {
      await syncCartWithServer(user._id);
    }
  };

  // Get cart history from server
  const getCartHistory = async () => {
    if (!isAuthenticated() || !user?._id) return [];
    
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${user._id}/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const history = await response.json();
        return history;
      }
    } catch (error) {
      console.error('Error fetching cart history:', error);
    }
    return [];
  };

  const contextValue = {
    cart,
    isLoading,
    isSyncing,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    getCartItemQuantity,
    getTotalItems,
    getTotalPrice,
    getTotalOriginalPrice,
    getTotalSavings,
    getCartItemCount,
    getCartSummary,
    updateItemOptions,
    forceSync,
    getCartHistory
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};