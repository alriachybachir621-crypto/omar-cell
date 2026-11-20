import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import {
  ADMIN_EMAIL,
  auth,
  db,
  handleFirestoreError,
  OperationType,
  testConnection,
} from './firebase';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_GALLERY,
  DEFAULT_PRODUCTS,
  DEFAULT_SHOP_INFO,
} from './data/defaults';
import {
  CartItem,
  Category,
  GalleryItem,
  Language,
  Product,
  ProductCondition,
  ServiceItem,
  ShopInfo,
} from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { ProductCatalog } from './components/ProductCatalog';
import { ServicesSection } from './components/ServicesSection';
import { WhyOmarCell } from './components/WhyOmarCell';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { PinModal } from './components/PinModal';
import { AdminPanel } from './components/AdminPanel';

const WISHLIST_KEY = 'omarcell_wishlist_v1';
const CART_KEY = 'omarcell_cart_v1';
const LANG_KEY = 'omarcell_lang_v1';

function Storefront() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === 'ar' ? 'ar' : 'en';
  });

  // Firestore Live Data
  const [fsProducts, setFsProducts] = useState<Product[]>([]);
  const [fsCategories, setFsCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [fsGallery, setFsGallery] = useState<GalleryItem[]>([]);
  const [shopInfo, setShopInfo] = useState<ShopInfo>(DEFAULT_SHOP_INFO);

  // Filters & Interactive Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStorage, setSelectedStorage] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // Hidden Admin Auth & Panel State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  // Browser-persisted Wishlist & Cart
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Sync HTML dir & lang attributes for full RTL/LTR support
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Firebase Auth & Firestore Subscriptions
  useEffect(() => {
    void testConnection();

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user || user.email !== ADMIN_EMAIL) {
        setAdminPanelOpen(false);
      }
    });

    const unsubProducts = onSnapshot(
      query(collection(db, 'products'), orderBy('createdAt', 'desc')),
      (snap) => {
        const list: Product[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Product, 'id'>),
        }));
        setFsProducts(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'products');
      }
    );

    const unsubCategories = onSnapshot(
      query(collection(db, 'categories'), orderBy('order', 'asc')),
      (snap) => {
        const list: Category[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Category, 'id'>),
        }));
        setFsCategories(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'categories');
      }
    );

    const unsubServices = onSnapshot(
      query(collection(db, 'services'), orderBy('order', 'asc')),
      (snap) => {
        const list: ServiceItem[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ServiceItem, 'id'>),
        }));
        setServices(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'services');
      }
    );

    const unsubGallery = onSnapshot(
      query(collection(db, 'gallery'), orderBy('order', 'asc')),
      (snap) => {
        const list: GalleryItem[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<GalleryItem, 'id'>),
        }));
        setFsGallery(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'gallery');
      }
    );

    const unsubShopInfo = onSnapshot(
      doc(db, 'config', 'shopInfo'),
      (snap) => {
        if (snap.exists()) {
          setShopInfo({
            ...DEFAULT_SHOP_INFO,
            ...(snap.data() as Partial<ShopInfo>),
          });
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'config/shopInfo');
      }
    );

    return () => {
      unsubAuth();
      unsubProducts();
      unsubCategories();
      unsubServices();
      unsubGallery();
      unsubShopInfo();
    };
  }, []);

  const products = fsProducts.length > 0 ? fsProducts : DEFAULT_PRODUCTS;
  const categories = fsCategories.length > 0 ? fsCategories : DEFAULT_CATEGORIES;
  const gallery = fsGallery.length > 0 ? fsGallery : DEFAULT_GALLERY;

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = ({
    product,
    storage,
    color,
    condition,
  }: {
    product: Product;
    storage?: string;
    color?: string;
    condition: ProductCondition;
  }) => {
    const key = `${product.id}__${storage || ''}__${color || ''}__${condition}`;
    setCartItems((prev) => {
      const existing = prev.find((it) => it.key === key);
      if (existing) {
        return prev.map((it) =>
          it.key === key ? { ...it, quantity: it.quantity + 1 } : it
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          nameAr: product.nameAr,
          brand: product.brand,
          price: product.price,
          image: product.images[0] || 'studio://default',
          storage,
          color,
          condition,
          quantity: 1,
        },
      ];
    });
  };

  const handleQuickAddToCart = (product: Product) => {
    handleAddToCart({
      product,
      storage: product.storageOptions?.[0],
      color: product.colors?.[0],
      condition: product.condition,
    });
    setCartOpen(true);
  };

  const handleUpdateCartQty = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) =>
          it.key === key ? { ...it, quantity: it.quantity + delta } : it
        )
        .filter((it) => it.quantity > 0)
    );
  };

  const handleRemoveCartItem = (key: string) => {
    setCartItems((prev) => prev.filter((it) => it.key !== key));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedStorage('all');
    setSelectedCondition('all');
    setMaxPrice(null);
  };

  // Secret 5-tap trigger on Omar Cell logo
  const handleSecretTrigger = () => {
    if (currentUser && currentUser.email === ADMIN_EMAIL) {
      setAdminPanelOpen(true);
    } else {
      setPinModalOpen(true);
    }
  };

  const totalCartCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F1E8] flex flex-col">
      <Header
        lang={lang}
        onToggleLang={() => setLang((l) => (l === 'en' ? 'ar' : 'en'))}
        hasServices={services.length > 0}
        wishlistCount={wishlistIds.length}
        cartCount={totalCartCount}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onSecretTrigger={handleSecretTrigger}
      />

      <main className="flex-1">
        <Hero
          lang={lang}
          shopInfo={shopInfo}
          onSecretTrigger={handleSecretTrigger}
        />

        <CategoriesSection
          lang={lang}
          categories={categories}
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <ProductCatalog
          lang={lang}
          products={products}
          categories={categories}
          wishlistIds={wishlistIds}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          selectedStorage={selectedStorage}
          onStorageChange={setSelectedStorage}
          selectedCondition={selectedCondition}
          onConditionChange={setSelectedCondition}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          onResetFilters={handleResetFilters}
          onToggleWishlist={handleToggleWishlist}
          onOpenProduct={setActiveProduct}
          onQuickAddToCart={handleQuickAddToCart}
        />

        <ServicesSection lang={lang} services={services} />

        <WhyOmarCell lang={lang} />

        <GallerySection lang={lang} items={gallery} shopInfo={shopInfo} />

        <ContactSection lang={lang} shopInfo={shopInfo} />
      </main>

      <Footer
        lang={lang}
        shopInfo={shopInfo}
        hasServices={services.length > 0}
        onSecretTrigger={handleSecretTrigger}
      />

      <FloatingWhatsApp lang={lang} shopInfo={shopInfo} />

      <ProductModal
        lang={lang}
        product={activeProduct}
        shopInfo={shopInfo}
        isWishlisted={activeProduct ? wishlistIds.includes(activeProduct.id) : false}
        onClose={() => setActiveProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        lang={lang}
        open={cartOpen}
        items={cartItems}
        shopInfo={shopInfo}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClear={() => setCartItems([])}
      />

      <WishlistDrawer
        lang={lang}
        open={wishlistOpen}
        products={products}
        wishlistIds={wishlistIds}
        onClose={() => setWishlistOpen(false)}
        onRemove={handleToggleWishlist}
        onOpenProduct={setActiveProduct}
      />

      <PinModal
        open={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onAuthenticated={() => {
          setPinModalOpen(false);
          setAdminPanelOpen(true);
        }}
      />

      {currentUser?.email === ADMIN_EMAIL && (
        <AdminPanel
          open={adminPanelOpen}
          onClose={() => setAdminPanelOpen(false)}
          products={products}
          categories={categories}
          services={services}
          gallery={gallery}
          shopInfo={shopInfo}
          hasFirestoreProducts={fsProducts.length > 0}
          hasFirestoreCategories={fsCategories.length > 0}
          hasFirestoreGallery={fsGallery.length > 0}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Storefront />
    </ErrorBoundary>
  );
}
