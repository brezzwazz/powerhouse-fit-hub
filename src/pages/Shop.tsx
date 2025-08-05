import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  Filter,
  Package,
  Truck,
  Shield,
  Zap,
  Plus,
  Minus,
  Loader2,
  AlertCircle,
  Info
} from "lucide-react";
import Navigation from "@/components/Navigation";

// Define TypeScript interfaces
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  features: string[];
  inStock: boolean;
  bestseller?: boolean;
  category: 'suppliments' | 'equipment' | 'apparel';
}

interface CartItem {
  product: number;
  quantity: number;
}

interface CartResponse {
  items: CartItem[];
}

interface OrderData {
  items: CartItem[];
  total: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://powerhousekrd.pythonanywhere.com';

// Helper components
const LoadingPlaceholder = () => (
  <div className="py-12 flex flex-col items-center justify-center">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
    <p className="mt-4 text-foreground">Loading...</p>
  </div>
);

const ErrorPlaceholder = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="py-12 text-center">
    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
    <h3 className="text-xl font-medium text-foreground mb-2">Error</h3>
    <p className="text-muted-foreground mb-6">{message}</p>
    <Button onClick={onRetry}>
      Retry
    </Button>
  </div>
);

const EmptyPlaceholder = ({ message }: { message: string }) => (
  <div className="py-12 text-center">
    <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <p className="text-muted-foreground">{message}</p>
  </div>
);

const Shop = () => {
  // State for products organized by category
  const [products, setProducts] = useState<{
    supplements: Product[],
    equipment: Product[],
    apparel: Product[]
  }>({ supplements: [], equipment: [], apparel: [] });
  
  // Individual loading states
  const [loading, setLoading] = useState({
    products: true,
    cart: true,
    order: false
  });
  
  // Individual error states
  const [errors, setErrors] = useState({
    products: null as string | null,
    cart: null as string | null,
    order: null as string | null
  });
  
  const [cartItems, setCartItems] = useState<{[key: number]: number}>({});
  const [cartOperation, setCartOperation] = useState({
    loading: false,
    productId: null as number | null
  });

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      setErrors(prev => ({ ...prev, products: null }));
      
      const response = await axios.get(`${API_BASE_URL}/products/`);
      const data = response.data;
      
      // Organize products by category
      const organizedProducts = {
        supplements: data.filter((p: Product) => p.category === 'suppliments'),
        equipment: data.filter((p: Product) => p.category === 'equipment'),
        apparel: data.filter((p: Product) => p.category === 'apparel')
      };
      
      setProducts(organizedProducts);
    } catch (err) {
      setErrors(prev => ({ ...prev, products: 'Failed to load products' }));
      console.error('Error fetching products:', err);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      setLoading(prev => ({ ...prev, cart: true }));
      setErrors(prev => ({ ...prev, cart: null }));
      
      const response = await axios.get<CartResponse>(`${API_BASE_URL}/cart/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      // Convert cart items to object format {productId: quantity}
      const cartItemsObj = response.data.items.reduce((acc, item) => {
        acc[item.product] = item.quantity;
        return acc;
      }, {} as {[key: number]: number});
      
      setCartItems(cartItemsObj);
    } catch (err) {
      setErrors(prev => ({ ...prev, cart: 'Failed to load cart' }));
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(prev => ({ ...prev, cart: false }));
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  // Add to cart with API sync
  const addToCart = async (productId: number) => {
    const prevCart = { ...cartItems };
    const newQuantity = (prevCart[productId] || 0) + 1;
    
    // Optimistic UI update
    setCartItems(prev => ({ ...prev, [productId]: newQuantity }));
    setCartOperation({ loading: true, productId });
    
    try {
      await axios.post(`${API_BASE_URL}/cart/add/`, {
        product: productId,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
    } catch (err) {
      // Revert on error
      setCartItems(prevCart);
      console.error('Error adding to cart:', err);
    } finally {
      setCartOperation({ loading: false, productId: null });
    }
  };

  // Remove from cart with API sync
  const removeFromCart = async (productId: number) => {
    const prevCart = { ...cartItems };
    const newQuantity = Math.max(0, (prevCart[productId] || 0) - 1);
    
    // Optimistic UI update
    setCartItems(prev => ({ ...prev, [productId]: newQuantity }));
    setCartOperation({ loading: true, productId });
    
    try {
      await axios.post(`${API_BASE_URL}/cart/remove/`, {
        product: productId,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
    } catch (err) {
      // Revert on error
      setCartItems(prevCart);
      console.error('Error removing from cart:', err);
    } finally {
      setCartOperation({ loading: false, productId: null });
    }
  };

  // Place order
  const placeOrder = async () => {
    try {
      setLoading(prev => ({ ...prev, order: true }));
      setErrors(prev => ({ ...prev, order: null }));
      
      // Convert cart items to API format
      const orderItems = Object.entries(cartItems)
        .filter(([_, quantity]) => quantity > 0)
        .map(([productId, quantity]) => ({
          product: parseInt(productId),
          quantity
        }));
      
      if (orderItems.length === 0) {
        setErrors(prev => ({ ...prev, order: 'Your cart is empty' }));
        return;
      }
      
      // Calculate total
      const allProducts = [
        ...products.supplements,
        ...products.equipment,
        ...products.apparel
      ];
      
      const total = orderItems.reduce((sum, item) => {
        const product = allProducts.find(p => p.id === item.product);
        return sum + (product?.price || 0) * item.quantity;
      }, 0);
      
      // Prepare order data
      const orderData: OrderData = {
        items: orderItems,
        total
      };
      
      // Submit order
      await axios.post(`${API_BASE_URL}/orders/`, orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      // Clear cart after successful order
      setCartItems({});
      await axios.delete(`${API_BASE_URL}/cart/clear/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      alert('Order placed successfully!');
    } catch (err) {
      setErrors(prev => ({ ...prev, order: 'Failed to place order' }));
      console.error('Error placing order:', err);
    } finally {
      setLoading(prev => ({ ...prev, order: false }));
    }
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const isCartOperationLoading = cartOperation.loading && cartOperation.productId === product.id;
    
    return (
      <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 relative">
        {product.bestseller && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground z-10">
            Bestseller
          </Badge>
        )}
        {product.originalPrice && (
          <Badge className="absolute top-3 right-3 bg-green-500/20 text-green-400 z-10">
            Sale
          </Badge>
        )}
        
        <CardHeader>
          <div className="text-center space-y-2">
            <span className="text-5xl">{product.image}</span>
            <CardTitle className="text-lg text-foreground">{product.name}</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                ({product.reviews})
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {product.description}
          </p>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Features:</p>
            <ul className="space-y-1">
              {product.features.slice(0, 3).map((feature: string, index: number) => (
                <li key={index} className="text-xs text-muted-foreground flex items-center">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 space-y-2">
            {cartItems[product.id] > 0 ? (
              <div className="flex items-center justify-center space-x-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeFromCart(product.id)}
                  disabled={isCartOperationLoading}
                >
                  {isCartOperationLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Minus className="h-4 w-4" />
                  )}
                </Button>
                <span className="font-semibold text-foreground">
                  {cartItems[product.id]}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addToCart(product.id)}
                  disabled={isCartOperationLoading}
                >
                  {isCartOperationLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={() => addToCart(product.id)}
                disabled={!product.inStock || isCartOperationLoading}
              >
                {isCartOperationLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </>
                )}
              </Button>
            )}
            
            <Button className="w-full" variant="outline">
              <Heart className="h-4 w-4 mr-2" />
              Add to Wishlist
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const totalItems = Object.values(cartItems).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Powerhouse Shop
            </h1>
            <p className="text-xl text-muted-foreground">
              Premium fitness gear, supplements, and apparel
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <div className="flex flex-col items-end">
              <Button 
                className="relative"
                onClick={placeOrder}
                disabled={totalItems === 0 || loading.order}
              >
                {loading.order ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart ({totalItems})
                  </>
                )}
              </Button>
              {errors.order && (
                <p className="text-red-500 text-xs mt-1">{errors.order}</p>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-card border-border text-center">
            <CardContent className="pt-6">
              <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On orders over $75</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border text-center">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground">30-day money back</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border text-center">
            <CardContent className="pt-6">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">2-3 business days</p>
            </CardContent>
          </Card>
        </div>

        {/* Product Categories */}
        <Tabs defaultValue="supplements" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="supplements">Supplements</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="apparel">Apparel</TabsTrigger>
          </TabsList>

          <TabsContent value="supplements">
            {loading.products ? (
              <LoadingPlaceholder />
            ) : errors.products ? (
              <ErrorPlaceholder 
                message={errors.products} 
                onRetry={fetchProducts} 
              />
            ) : products.supplements.length === 0 ? (
              <EmptyPlaceholder message="No supplements available" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.supplements.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="equipment">
            {loading.products ? (
              <LoadingPlaceholder />
            ) : errors.products ? (
              <ErrorPlaceholder 
                message={errors.products} 
                onRetry={fetchProducts} 
              />
            ) : products.equipment.length === 0 ? (
              <EmptyPlaceholder message="No equipment available" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.equipment.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="apparel">
            {loading.products ? (
              <LoadingPlaceholder />
            ) : errors.products ? (
              <ErrorPlaceholder 
                message={errors.products} 
                onRetry={fetchProducts} 
              />
            ) : products.apparel.length === 0 ? (
              <EmptyPlaceholder message="No apparel available" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.apparel.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-primary border-0 text-primary-foreground">
            <CardContent className="py-12">
              <Zap className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Join Our VIP Program</h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Get exclusive discounts, early access to new products, and free shipping on all orders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/login" className="flex items-center">
                  Join VIP Program
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-white/20 text-white hover:bg-white/10">
                  <Link to="/login" className="flex items-center">
                  Learn More
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Shop;