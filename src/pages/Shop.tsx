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
  Minus
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { useState } from "react";

const Shop = () => {
  const [cartItems, setCartItems] = useState<{[key: number]: number}>({});

  const products = {
    supplements: [
      {
        id: 1,
        name: "Premium Whey Protein",
        price: 49.99,
        originalPrice: 59.99,
        rating: 4.8,
        reviews: 234,
        image: "🥤",
        description: "High-quality whey protein isolate for muscle building and recovery.",
        features: ["25g protein per serving", "Fast absorption", "Great taste", "No artificial fillers"],
        inStock: true,
        bestseller: true
      },
      {
        id: 2,
        name: "Pure Creatine Monohydrate",
        price: 29.99,
        rating: 4.9,
        reviews: 156,
        image: "💊",
        description: "Micronized creatine for increased strength and power output.",
        features: ["5g per serving", "Unflavored", "No loading required", "Third-party tested"],
        inStock: true
      },
      {
        id: 3,
        name: "BCAA Energy Drink",
        price: 39.99,
        rating: 4.6,
        reviews: 89,
        image: "⚡",
        description: "Branched-chain amino acids with natural caffeine for workout energy.",
        features: ["2:1:1 BCAA ratio", "Natural caffeine", "Zero sugar", "Tropical flavor"],
        inStock: false
      },
      {
        id: 4,
        name: "Multivitamin Complex",
        price: 24.99,
        rating: 4.7,
        reviews: 201,
        image: "🌿",
        description: "Complete daily vitamin and mineral support for active lifestyles.",
        features: ["25 essential nutrients", "Easy to digest", "Non-GMO", "90-day supply"],
        inStock: true
      }
    ],
    equipment: [
      {
        id: 5,
        name: "Adjustable Dumbbells",
        price: 299.99,
        originalPrice: 349.99,
        rating: 4.8,
        reviews: 78,
        image: "🏋️",
        description: "Space-saving adjustable dumbbells for home workouts.",
        features: ["5-50 lbs per dumbbell", "Quick weight change", "Compact design", "Includes stand"],
        inStock: true,
        bestseller: true
      },
      {
        id: 6,
        name: "Resistance Band Set",
        price: 49.99,
        rating: 4.5,
        reviews: 167,
        image: "🎯",
        description: "Complete resistance band system for full-body workouts.",
        features: ["5 resistance levels", "Door anchor included", "Exercise guide", "Travel-friendly"],
        inStock: true
      },
      {
        id: 7,
        name: "Yoga Mat Pro",
        price: 79.99,
        rating: 4.9,
        reviews: 234,
        image: "🧘",
        description: "Premium non-slip yoga mat for all types of workouts.",
        features: ["6mm thickness", "Non-slip surface", "Eco-friendly", "Alignment lines"],
        inStock: true
      },
      {
        id: 8,
        name: "Kettlebell Set",
        price: 159.99,
        rating: 4.7,
        reviews: 92,
        image: "⚖️",
        description: "Cast iron kettlebell set for strength and conditioning.",
        features: ["15, 25, 35 lb bells", "Wide handle", "Flat bottom", "Rust-resistant coating"],
        inStock: true
      }
    ],
    apparel: [
      {
        id: 9,
        name: "Powerhouse Gym Tee",
        price: 24.99,
        rating: 4.6,
        reviews: 156,
        image: "👕",
        description: "Comfortable cotton blend t-shirt with Powerhouse logo.",
        features: ["Cotton blend", "Moisture-wicking", "Multiple colors", "Preshrunk"],
        inStock: true
      },
      {
        id: 10,
        name: "Training Shorts",
        price: 34.99,
        rating: 4.5,
        reviews: 89,
        image: "🩳",
        description: "Lightweight training shorts with built-in compression liner.",
        features: ["Quick-dry fabric", "Compression liner", "Side pockets", "Reflective details"],
        inStock: true
      },
      {
        id: 11,
        name: "Gym Towel Set",
        price: 19.99,
        rating: 4.8,
        reviews: 201,
        image: "🧻",
        description: "Absorbent microfiber towels perfect for gym workouts.",
        features: ["Set of 3 towels", "Microfiber material", "Quick-dry", "Antimicrobial"],
        inStock: true
      },
      {
        id: 12,
        name: "Training Gloves",
        price: 29.99,
        rating: 4.4,
        reviews: 134,
        image: "🧤",
        description: "Padded training gloves for better grip and protection.",
        features: ["Breathable material", "Wrist support", "Non-slip grip", "Multiple sizes"],
        inStock: true
      }
    ]
  };

  const addToCart = (productId: number) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1)
    }));
  };

  const ProductCard = ({ product }: { product: any }) => (
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
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                ${product.originalPrice}
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
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-foreground">
                {cartItems[product.id]}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addToCart(product.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={() => addToCart(product.id)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
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
            <Button className="relative">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart ({totalItems})
            </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.supplements.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="equipment">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.equipment.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="apparel">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.apparel.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
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
                  Join VIP Program
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-white/20 text-white hover:bg-white/10">
                  Learn More
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