import React, { useState } from 'react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
} from 'firebase/auth';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import {
  ImagePlus,
  KeyRound,
  LogOut,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  ADMIN_EMAIL,
  auth,
  db,
  handleFirestoreError,
  OperationType,
  PASSCODE_SUFFIX,
  uploadImageToStorage,
} from '../firebase';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_GALLERY,
  DEFAULT_PRODUCTS,
} from '../data/defaults';
import {
  Category,
  GalleryItem,
  Product,
  ProductCondition,
  ServiceItem,
  ShopInfo,
} from '../types';
import { DeviceVisual } from './DeviceVisual';
import { SERVICE_ICONS } from './ServicesSection';

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  services: ServiceItem[];
  gallery: GalleryItem[];
  shopInfo: ShopInfo;
  hasFirestoreProducts: boolean;
  hasFirestoreCategories: boolean;
  hasFirestoreGallery: boolean;
}

type AdminTab = 'products' | 'categories' | 'services' | 'heroGallery' | 'shopInfo';

const makeSafeId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`.replace(
    /[^a-zA-Z0-9_-]/g,
    ''
  );

export const AdminPanel: React.FC<AdminPanelProps> = ({
  open,
  onClose,
  products,
  categories,
  services,
  gallery,
  shopInfo,
  hasFirestoreProducts,
  hasFirestoreCategories,
  hasFirestoreGallery,
}) => {
  const [tab, setTab] = useState<AdminTab>('products');
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  // Change PIN modal state
  const [showChangePin, setShowChangePin] = useState(false);
  const [currPin, setCurrPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [pinMsg, setPinMsg] = useState('');

  // Product Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [pName, setPName] = useState('');
  const [pNameAr, setPNameAr] = useState('');
  const [pBrand, setPBrand] = useState('');
  const [pCategory, setPCategory] = useState('iphone');
  const [pPrice, setPPrice] = useState('');
  const [pOldPrice, setPOldPrice] = useState('');
  const [pStorage, setPStorage] = useState('');
  const [pColors, setPColors] = useState('');
  const [pCondition, setPCondition] = useState<ProductCondition>('New');
  const [pImages, setPImages] = useState<string[]>([]);
  const [pImageUrlInput, setPImageUrlInput] = useState('');
  const [pInStock, setPInStock] = useState(true);
  const [pIsNew, setPIsNew] = useState(true);
  const [pIsSale, setPIsSale] = useState(false);
  const [pDesc, setPDesc] = useState('');
  const [pDescAr, setPDescAr] = useState('');

  // Category Form State
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [cSlug, setCSlug] = useState('');
  const [cName, setCName] = useState('');
  const [cNameAr, setCNameAr] = useState('');
  const [cSub, setCSub] = useState('');
  const [cSubAr, setCSubAr] = useState('');
  const [cImage, setCImage] = useState('');
  const [cOrder, setCOrder] = useState('1');

  // Service Form State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [sTitle, setSTitle] = useState('');
  const [sTitleAr, setSTitleAr] = useState('');
  const [sDesc, setSDesc] = useState('');
  const [sDescAr, setSDescAr] = useState('');
  const [sIcon, setSIcon] = useState('Wrench');
  const [sOrder, setSOrder] = useState('1');

  // Gallery Form State
  const [gImage, setGImage] = useState('');
  const [gCaption, setGCaption] = useState('');
  const [gCaptionAr, setGCaptionAr] = useState('');

  // Hero & Shop Info Form State
  const [heroImages, setHeroImages] = useState<string[]>(shopInfo.heroImages);
  const [heroImgInput, setHeroImgInput] = useState('');
  const [heroTitle, setHeroTitle] = useState(shopInfo.heroTitle || '');
  const [heroTitleAr, setHeroTitleAr] = useState(shopInfo.heroTitleAr || '');
  const [heroSub, setHeroSub] = useState(shopInfo.heroSubtitle || '');
  const [heroSubAr, setHeroSubAr] = useState(shopInfo.heroSubtitleAr || '');

  const [waNumber, setWaNumber] = useState(shopInfo.whatsappNumber);
  const [phoneDisplay, setPhoneDisplay] = useState(shopInfo.phoneDisplay);
  const [address, setAddress] = useState(shopInfo.address);
  const [addressAr, setAddressAr] = useState(shopInfo.addressAr || '');
  const [hours, setHours] = useState(shopInfo.hours || '');
  const [hoursAr, setHoursAr] = useState(shopInfo.hoursAr || '');
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState(shopInfo.mapsEmbedUrl || '');
  const [mapsLink, setMapsLink] = useState(shopInfo.mapsLink || '');
  const [facebookUrl, setFacebookUrl] = useState(shopInfo.facebookUrl || '');

  if (!open) return null;

  const flashStatus = (msg: string) => {
    setErrorMsg('');
    setStatusMsg(msg);
    window.setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinMsg('');
    if (!/^\d{4}$/.test(currPin) || !/^\d{4}$/.test(newPin)) {
      setPinMsg('Codes must be exactly 4 digits.');
      return;
    }
    if (newPin !== confirmNewPin) {
      setPinMsg('New codes do not match.');
      return;
    }
    const user = auth.currentUser;
    if (!user) return;
    try {
      const cred = EmailAuthProvider.credential(
        ADMIN_EMAIL,
        currPin + PASSCODE_SUFFIX
      );
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPin + PASSCODE_SUFFIX);
      setCurrPin('');
      setNewPin('');
      setConfirmNewPin('');
      setShowChangePin(false);
      flashStatus('4-digit code updated.');
    } catch {
      setPinMsg('Current code is incorrect.');
    }
  };

  // --- Product Handlers ---
  const openNewProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPNameAr('');
    setPBrand('Apple');
    setPCategory(categories[0]?.slug || 'iphone');
    setPPrice('');
    setPOldPrice('');
    setPStorage('128GB, 256GB');
    setPColors('Black, Natural');
    setPCondition('New');
    setPImages([]);
    setPImageUrlInput('');
    setPInStock(true);
    setPIsNew(true);
    setPIsSale(false);
    setPDesc('');
    setPDescAr('');
    setShowProductForm(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name);
    setPNameAr(p.nameAr || '');
    setPBrand(p.brand);
    setPCategory(p.category);
    setPPrice(String(p.price));
    setPOldPrice(p.oldPrice ? String(p.oldPrice) : '');
    setPStorage((p.storageOptions || []).join(', '));
    setPColors((p.colors || []).join(', '));
    setPCondition(p.condition);
    setPImages(p.images || []);
    setPImageUrlInput('');
    setPInStock(p.inStock);
    setPIsNew(p.isNew);
    setPIsSale(p.isSale);
    setPDesc(p.description || '');
    setPDescAr(p.descriptionAr || '');
    setShowProductForm(true);
  };

  const handleUploadProductImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setErrorMsg('');
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImageToStorage(files[i], 'products');
        urls.push(url);
      }
      setPImages((prev) => [...prev, ...urls].slice(0, 10));
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? `Upload failed: ${err.message}. You can also paste an image URL.`
          : 'Upload failed.'
      );
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingProduct ? editingProduct.id : makeSafeId('prod');
    const now = Date.now();
    const priceNum = Math.max(0, Number(pPrice) || 0);
    const oldPriceNum = pOldPrice ? Math.max(0, Number(pOldPrice) || 0) : 0;

    const payload: Omit<Product, 'id'> = {
      name: pName.trim().slice(0, 140),
      nameAr: pNameAr.trim().slice(0, 140),
      brand: pBrand.trim().slice(0, 60) || 'Apple',
      category: pCategory.trim().slice(0, 60) || 'iphone',
      price: priceNum,
      ...(oldPriceNum > 0 ? { oldPrice: oldPriceNum } : {}),
      storageOptions: pStorage
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 12),
      colors: pColors
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 12),
      condition: pCondition,
      images: (pImages.length > 0 ? pImages : ['studio://default']).slice(0, 10),
      inStock: pInStock,
      isNew: pIsNew,
      isSale: pIsSale,
      description: pDesc.trim().slice(0, 1200),
      descriptionAr: pDescAr.trim().slice(0, 1200),
      createdAt: editingProduct ? editingProduct.createdAt : now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'products', id), payload);
      setShowProductForm(false);
      flashStatus('Product saved.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `products/${id}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      flashStatus('Product deleted.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  const importStarterProducts = async () => {
    try {
      for (const item of DEFAULT_PRODUCTS) {
        const { id, ...rest } = item;
        await setDoc(doc(db, 'products', id), rest);
      }
      flashStatus('Starter catalog imported.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'products');
    }
  };

  // --- Category Handlers ---
  const handleUploadCategoryImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToStorage(file, 'categories');
      setCImage(url);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = (cSlug || cName)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60);
    if (!cleanSlug || !cName.trim()) return;
    const id = editingCat ? editingCat.id : cleanSlug;
    try {
      await setDoc(doc(db, 'categories', id), {
        slug: cleanSlug,
        name: cName.trim().slice(0, 80),
        nameAr: cNameAr.trim().slice(0, 80),
        subtitle: cSub.trim().slice(0, 160),
        subtitleAr: cSubAr.trim().slice(0, 160),
        image: cImage.trim().slice(0, 2048),
        order: Number(cOrder) || 1,
      });
      setEditingCat(null);
      setCSlug('');
      setCName('');
      setCNameAr('');
      setCSub('');
      setCSubAr('');
      setCImage('');
      setCOrder('1');
      flashStatus('Category saved.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `categories/${id}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      flashStatus('Category removed.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
    }
  };

  const importDefaultCategories = async () => {
    try {
      for (const cat of DEFAULT_CATEGORIES) {
        const { id, ...rest } = cat;
        await setDoc(doc(db, 'categories', id), rest);
      }
      flashStatus('Default categories saved.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'categories');
    }
  };

  // --- Service Handlers ---
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sTitle.trim()) return;
    const id = editingService ? editingService.id : makeSafeId('srv');
    try {
      await setDoc(doc(db, 'services', id), {
        title: sTitle.trim().slice(0, 100),
        titleAr: sTitleAr.trim().slice(0, 100),
        description: sDesc.trim().slice(0, 400),
        descriptionAr: sDescAr.trim().slice(0, 400),
        icon: sIcon,
        order: Number(sOrder) || services.length + 1,
      });
      setEditingService(null);
      setSTitle('');
      setSTitleAr('');
      setSDesc('');
      setSDescAr('');
      setSIcon('Wrench');
      setSOrder('1');
      flashStatus('Service saved.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `services/${id}`);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      flashStatus('Service removed.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
    }
  };

  // --- Hero & Gallery Handlers ---
  const handleUploadHeroImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToStorage(file, 'hero');
      setHeroImages((prev) => [...prev, url].slice(0, 6));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleUploadGalleryImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToStorage(file, 'gallery');
      setGImage(url);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gImage.trim()) return;
    const id = makeSafeId('gal');
    try {
      await setDoc(doc(db, 'gallery', id), {
        image: gImage.trim().slice(0, 2048),
        caption: gCaption.trim().slice(0, 160),
        captionAr: gCaptionAr.trim().slice(0, 160),
        order: gallery.length + 1,
      });
      setGImage('');
      setGCaption('');
      setGCaptionAr('');
      flashStatus('Gallery image added.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `gallery/${id}`);
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gallery', id));
      flashStatus('Gallery item removed.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
    }
  };

  const importDefaultGallery = async () => {
    try {
      for (const item of DEFAULT_GALLERY) {
        const { id, ...rest } = item;
        await setDoc(doc(db, 'gallery', id), rest);
      }
      flashStatus('Starter gallery imported.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
    }
  };

  // --- Save ShopInfo (Hero + Contact) ---
  const handleSaveShopInfo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await setDoc(doc(db, 'config', 'shopInfo'), {
        heroImages: (heroImages.length > 0
          ? heroImages
          : ['studio://hero-flagship']
        ).slice(0, 6),
        heroTitle: heroTitle.trim().slice(0, 140),
        heroTitleAr: heroTitleAr.trim().slice(0, 140),
        heroSubtitle: heroSub.trim().slice(0, 280),
        heroSubtitleAr: heroSubAr.trim().slice(0, 280),
        whatsappNumber: waNumber.trim().slice(0, 30) || '96171569568',
        phoneDisplay: phoneDisplay.trim().slice(0, 30) || '71 569 568',
        address: address.trim().slice(0, 200) || 'Qab Elias Road, Zahle Area, Lebanon',
        addressAr: addressAr.trim().slice(0, 200),
        mapsEmbedUrl: mapsEmbedUrl.trim().slice(0, 2048),
        mapsLink: mapsLink.trim().slice(0, 2048),
        hours: hours.trim().slice(0, 160),
        hoursAr: hoursAr.trim().slice(0, 160),
        facebookUrl: facebookUrl.trim().slice(0, 2048),
        updatedAt: Date.now(),
      });
      flashStatus('Store settings saved.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'config/shopInfo');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] text-[#F5F1E8] overflow-y-auto" dir="ltr">
      {/* Top Studio Header */}
      <div className="sticky top-0 z-20 bg-[#111111] border-b border-[#C9A13B]/30 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#C9A13B]" />
          <h1 className="font-display text-2xl font-semibold text-[#E8D08A]">
            Omar Cell Studio
          </h1>
          {statusMsg && (
            <span className="text-xs px-2.5 py-1 bg-[#C9A13B]/15 border border-[#C9A13B]/40 text-[#E8D08A]">
              {statusMsg}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setPinMsg('');
              setShowChangePin(true);
            }}
            className="h-9 px-3.5 flex items-center gap-1.5 border border-[#C9A13B]/35 text-xs text-[#E8D08A] hover:border-[#C9A13B] hover:bg-[#1A1A1A] transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Change code</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="h-9 px-3.5 flex items-center gap-1.5 border border-[#C9A13B]/35 text-xs text-[#F5F1E8]/85 hover:border-[#C9A13B] hover:text-[#E8D08A] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-9 px-3.5 flex items-center gap-1.5 bg-[#C9A13B] text-[#0A0A0A] text-xs font-semibold uppercase tracking-wider hover:bg-[#E8D08A] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-4">
          <div className="p-3 bg-[#1A1412] border border-[#C9A13B]/60 text-xs text-[#E8D08A]">
            {errorMsg}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-[#C9A13B]/20 pb-3">
          {(
            [
              ['products', `Products (${products.length})`],
              ['categories', `Categories (${categories.length})`],
              ['services', `Services (${services.length})`],
              ['heroGallery', 'Hero & Gallery'],
              ['shopInfo', 'Shop Info'],
            ] as [AdminTab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border transition-colors ${
                tab === key
                  ? 'bg-[#C9A13B] text-[#0A0A0A] border-[#C9A13B]'
                  : 'bg-[#141414] text-[#F5F1E8]/75 border-[#C9A13B]/20 hover:border-[#C9A13B]/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* TAB 1: PRODUCTS */}
        {tab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#F5F1E8]/65">
                Manage devices & accessories. Changes appear live on the storefront.
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                {!hasFirestoreProducts && (
                  <button
                    type="button"
                    onClick={importStarterProducts}
                    className="h-10 px-4 border border-[#C9A13B]/45 text-xs text-[#E8D08A] hover:bg-[#1A1A1A]"
                  >
                    Import Starter Catalog to Database
                  </button>
                )}
                <button
                  type="button"
                  onClick={openNewProduct}
                  className="h-10 px-4 flex items-center gap-2 bg-[#C9A13B] text-[#0A0A0A] text-xs font-semibold uppercase tracking-wider hover:bg-[#E8D08A]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#1A1A1A] border border-[#C9A13B]/25 p-4 flex gap-3.5"
                >
                  <div className="w-20 h-20 shrink-0 bg-[#0A0A0A] border border-[#C9A13B]/15 overflow-hidden">
                    <DeviceVisual src={p.images[0]} alt={p.name} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-[#C9A13B]">
                        {p.brand} · {p.condition} ·{' '}
                        {p.inStock ? 'Available' : 'Sold out'}
                      </p>
                      <h3 className="text-sm font-semibold text-[#F5F1E8] truncate mt-0.5">
                        {p.name}
                      </h3>
                      <p className="text-sm font-semibold text-[#E8D08A] tabular-nums mt-1">
                        ${p.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => openEditProduct(p)}
                        className="px-2.5 py-1 text-xs border border-[#C9A13B]/30 text-[#E8D08A] hover:border-[#C9A13B] flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      {hasFirestoreProducts && (
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="px-2.5 py-1 text-xs border border-[#C9A13B]/20 text-[#F5F1E8]/60 hover:text-[#E8D08A] flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES */}
        {tab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleSaveCategory}
              className="lg:col-span-5 bg-[#1A1A1A] border border-[#C9A13B]/25 p-5 space-y-4 self-start"
            >
              <h2 className="font-display text-xl text-[#E8D08A]">
                {editingCat ? 'Edit Category' : 'Add Category'}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                    Name (EN) *
                  </label>
                  <input
                    required
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    placeholder="iPhone"
                    className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                    Name (AR)
                  </label>
                  <input
                    dir="rtl"
                    value={cNameAr}
                    onChange={(e) => setCNameAr(e.target.value)}
                    placeholder="آيفون"
                    className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                    Slug (e.g. iphone)
                  </label>
                  <input
                    value={cSlug}
                    onChange={(e) => setCSlug(e.target.value)}
                    placeholder="iphone"
                    className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={cOrder}
                    onChange={(e) => setCOrder(e.target.value)}
                    className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Subtitle (EN)
                </label>
                <input
                  value={cSub}
                  onChange={(e) => setCSub(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Subtitle (AR)
                </label>
                <input
                  dir="rtl"
                  value={cSubAr}
                  onChange={(e) => setCSubAr(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Image URL or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    value={cImage}
                    onChange={(e) => setCImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-xs"
                  />
                  <label className="h-10 px-3 flex items-center gap-1.5 border border-[#C9A13B]/40 text-xs text-[#E8D08A] cursor-pointer hover:bg-[#0A0A0A]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadCategoryImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-10 bg-[#C9A13B] text-[#0A0A0A] text-xs font-semibold uppercase tracking-wider hover:bg-[#E8D08A]"
                >
                  Save Category
                </button>
                {editingCat && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCat(null);
                      setCSlug('');
                      setCName('');
                      setCNameAr('');
                      setCSub('');
                      setCSubAr('');
                      setCImage('');
                    }}
                    className="px-4 h-10 border border-[#C9A13B]/30 text-xs"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 space-y-4">
              {!hasFirestoreCategories && (
                <button
                  type="button"
                  onClick={importDefaultCategories}
                  className="h-10 px-4 border border-[#C9A13B]/45 text-xs text-[#E8D08A] hover:bg-[#1A1A1A]"
                >
                  Import Default Categories to Database
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-[#1A1A1A] border border-[#C9A13B]/20 p-4 flex gap-3 items-center"
                  >
                    <div className="w-16 h-16 shrink-0 bg-[#0A0A0A] overflow-hidden border border-[#C9A13B]/15">
                      <DeviceVisual src={cat.image} alt={cat.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#F5F1E8] truncate">
                        {cat.name}
                      </p>
                      <p className="text-xs text-[#F5F1E8]/55 truncate">
                        slug: {cat.slug}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCat(cat);
                            setCSlug(cat.slug);
                            setCName(cat.name);
                            setCNameAr(cat.nameAr || '');
                            setCSub(cat.subtitle || '');
                            setCSubAr(cat.subtitleAr || '');
                            setCImage(cat.image || '');
                            setCOrder(String(cat.order));
                          }}
                          className="text-xs text-[#E8D08A] hover:underline"
                        >
                          Edit
                        </button>
                        {hasFirestoreCategories && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-xs text-[#F5F1E8]/55 hover:text-[#E8D08A]"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES */}
        {tab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleSaveService}
              className="lg:col-span-5 bg-[#1A1A1A] border border-[#C9A13B]/25 p-5 space-y-4 self-start"
            >
              <h2 className="font-display text-xl text-[#E8D08A]">
                {editingService ? 'Edit Service' : 'Add Service'}
              </h2>
              <p className="text-xs text-[#F5F1E8]/60">
                When 0 services are saved, the Services section is hidden from the public site.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                    Title (EN) *
                  </label>
                  <input
                    required
                    value={sTitle}
                    onChange={(e) => setSTitle(e.target.value)}
                    placeholder="Screen & Battery Care"
                    className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                    Title (AR)
                  </label>
                  <input
                    dir="rtl"
                    value={sTitleAr}
                    onChange={(e) => setSTitleAr(e.target.value)}
                    placeholder="صيانة الشاشة والبطارية"
                    className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                    Icon
                  </label>
                  <select
                    value={sIcon}
                    onChange={(e) => setSIcon(e.target.value)}
                    className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-xs"
                  >
                    {Object.keys(SERVICE_ICONS).map((iconName) => (
                      <option key={iconName} value={iconName}>
                        {iconName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={sOrder}
                    onChange={(e) => setSOrder(e.target.value)}
                    className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Description (EN)
                </label>
                <textarea
                  rows={2}
                  value={sDesc}
                  onChange={(e) => setSDesc(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#C9A13B]/25 p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Description (AR)
                </label>
                <textarea
                  dir="rtl"
                  rows={2}
                  value={sDescAr}
                  onChange={(e) => setSDescAr(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#C9A13B]/25 p-3 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 h-10 bg-[#C9A13B] text-[#0A0A0A] text-xs font-semibold uppercase tracking-wider hover:bg-[#E8D08A]"
                >
                  Save Service
                </button>
                {editingService && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingService(null);
                      setSTitle('');
                      setSTitleAr('');
                      setSDesc('');
                      setSDescAr('');
                    }}
                    className="px-4 h-10 border border-[#C9A13B]/30 text-xs"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {services.length === 0 ? (
                <div className="bg-[#1A1A1A] border border-[#C9A13B]/20 p-8 text-center">
                  <p className="text-sm text-[#E8D08A]">No services added yet.</p>
                  <p className="text-xs text-[#F5F1E8]/60 mt-1">
                    Add your first service on the left to display the Services section publicly.
                  </p>
                </div>
              ) : (
                services.map((srv) => {
                  const Icon = SERVICE_ICONS[srv.icon] || SERVICE_ICONS.Wrench;
                  return (
                    <div
                      key={srv.id}
                      className="bg-[#1A1A1A] border border-[#C9A13B]/20 p-4 flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-[#C9A13B]/35 bg-[#0A0A0A] text-[#E8D08A]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-[#F5F1E8]">
                            {srv.title}
                          </h3>
                          {srv.description && (
                            <p className="text-xs text-[#F5F1E8]/65 mt-1">
                              {srv.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingService(srv);
                            setSTitle(srv.title);
                            setSTitleAr(srv.titleAr || '');
                            setSDesc(srv.description || '');
                            setSDescAr(srv.descriptionAr || '');
                            setSIcon(srv.icon);
                            setSOrder(String(srv.order));
                          }}
                          className="text-xs text-[#E8D08A] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(srv.id)}
                          className="text-xs text-[#F5F1E8]/55 hover:text-[#E8D08A]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 4: HERO & GALLERY */}
        {tab === 'heroGallery' && (
          <div className="space-y-10">
            {/* Hero Settings */}
            <div className="bg-[#1A1A1A] border border-[#C9A13B]/25 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-[#E8D08A]">
                  Hero Showcase Images & Copy
                </h2>
                <button
                  type="button"
                  onClick={() => handleSaveShopInfo()}
                  className="h-9 px-4 bg-[#C9A13B] text-[#0A0A0A] text-xs font-semibold uppercase tracking-wider hover:bg-[#E8D08A]"
                >
                  Save Hero
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                    Headline (EN)
                  </label>
                  <input
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                    Headline (AR)
                  </label>
                  <input
                    dir="rtl"
                    value={heroTitleAr}
                    onChange={(e) => setHeroTitleAr(e.target.value)}
                    className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                    Subtitle (EN)
                  </label>
                  <input
                    value={heroSub}
                    onChange={(e) => setHeroSub(e.target.value)}
                    className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                    Subtitle (AR)
                  </label>
                  <input
                    dir="rtl"
                    value={heroSubAr}
                    onChange={(e) => setHeroSubAr(e.target.value)}
                    className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-2">
                  Hero Images (up to 6)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <input
                    value={heroImgInput}
                    onChange={(e) => setHeroImgInput(e.target.value)}
                    placeholder="Paste image URL..."
                    className="flex-1 min-w-[200px] h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!heroImgInput.trim()) return;
                      setHeroImages((prev) =>
                        [...prev, heroImgInput.trim()].slice(0, 6)
                      );
                      setHeroImgInput('');
                    }}
                    className="h-10 px-4 border border-[#C9A13B]/40 text-xs text-[#E8D08A]"
                  >
                    Add URL
                  </button>
                  <label className="h-10 px-4 flex items-center gap-1.5 bg-[#C9A13B]/15 border border-[#C9A13B]/45 text-xs text-[#E8D08A] cursor-pointer">
                    <ImagePlus className="w-4 h-4" />
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadHeroImage}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {heroImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[4/3] bg-[#0A0A0A] border border-[#C9A13B]/25 overflow-hidden"
                    >
                      <DeviceVisual src={img} alt={`Hero ${idx + 1}`} />
                      <button
                        type="button"
                        onClick={() =>
                          setHeroImages((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="absolute top-1.5 end-1.5 w-7 h-7 bg-[#0A0A0A]/85 border border-[#C9A13B]/40 flex items-center justify-center text-[#E8D08A]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gallery Management */}
            <div className="bg-[#1A1A1A] border border-[#C9A13B]/25 p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-2xl text-[#E8D08A]">
                  Showroom Gallery
                </h2>
                {!hasFirestoreGallery && (
                  <button
                    type="button"
                    onClick={importDefaultGallery}
                    className="h-9 px-4 border border-[#C9A13B]/40 text-xs text-[#E8D08A]"
                  >
                    Import Default Gallery
                  </button>
                )}
              </div>

              <form
                onSubmit={handleAddGalleryItem}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
              >
                <div className="md:col-span-2">
                  <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                    Image URL or Upload *
                  </label>
                  <div className="flex gap-2">
                    <input
                      required
                      value={gImage}
                      onChange={(e) => setGImage(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-xs"
                    />
                    <label className="h-10 px-3 flex items-center gap-1 border border-[#C9A13B]/40 text-xs text-[#E8D08A] cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadGalleryImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                    Caption (EN)
                  </label>
                  <input
                    value={gCaption}
                    onChange={(e) => setGCaption(e.target.value)}
                    className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-xs"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full h-10 bg-[#C9A13B] text-[#0A0A0A] text-xs font-semibold uppercase tracking-wider hover:bg-[#E8D08A]"
                  >
                    Add Photo
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#0A0A0A] border border-[#C9A13B]/20 overflow-hidden"
                  >
                    <div className="relative aspect-[4/3]">
                      <DeviceVisual src={item.image} alt={item.caption || 'Gallery'} />
                      {hasFirestoreGallery && (
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="absolute top-2 end-2 w-7 h-7 bg-[#0A0A0A]/85 border border-[#C9A13B]/40 flex items-center justify-center text-[#E8D08A]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {item.caption && (
                      <p className="p-2 text-xs text-[#F5F1E8]/70 truncate">
                        {item.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SHOP INFO */}
        {tab === 'shopInfo' && (
          <form
            onSubmit={handleSaveShopInfo}
            className="bg-[#1A1A1A] border border-[#C9A13B]/25 p-6 space-y-5 max-w-3xl"
          >
            <h2 className="font-display text-2xl text-[#E8D08A]">
              Shop Contact, Maps & Hours
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  WhatsApp Number (digits with country code)
                </label>
                <input
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  placeholder="96171569568"
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Phone Display
                </label>
                <input
                  value={phoneDisplay}
                  onChange={(e) => setPhoneDisplay(e.target.value)}
                  placeholder="71 569 568"
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Address (EN)
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Address (AR)
                </label>
                <input
                  dir="rtl"
                  value={addressAr}
                  onChange={(e) => setAddressAr(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Opening Hours (EN)
                </label>
                <input
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Opening Hours (AR)
                </label>
                <input
                  dir="rtl"
                  value={hoursAr}
                  onChange={(e) => setHoursAr(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                Google Maps Embed URL (iframe src)
              </label>
              <input
                value={mapsEmbedUrl}
                onChange={(e) => setMapsEmbedUrl(e.target.value)}
                className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                Google Maps Direct Link
              </label>
              <input
                value={mapsLink}
                onChange={(e) => setMapsLink(e.target.value)}
                className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                Facebook Page URL
              </label>
              <input
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-xs"
              />
            </div>

            <button
              type="submit"
              className="h-11 px-7 bg-[#C9A13B] text-[#0A0A0A] text-xs font-bold uppercase tracking-wider hover:bg-[#E8D08A]"
            >
              Save Shop Info
            </button>
          </form>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {showProductForm && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowProductForm(false)}
        >
          <form
            onSubmit={handleSaveProduct}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#141414] border border-[#C9A13B]/45 p-6 space-y-4 my-auto"
          >
            <div className="flex items-center justify-between border-b border-[#C9A13B]/20 pb-3">
              <h3 className="font-display text-2xl text-[#E8D08A]">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductForm(false)}
                className="p-1 text-[#F5F1E8]/70 hover:text-[#E8D08A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Product Name (EN) *
                </label>
                <input
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Product Name (AR)
                </label>
                <input
                  dir="rtl"
                  value={pNameAr}
                  onChange={(e) => setPNameAr(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Brand *
                </label>
                <input
                  required
                  value={pBrand}
                  onChange={(e) => setPBrand(e.target.value)}
                  placeholder="Apple, Samsung, Xiaomi..."
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Category *
                </label>
                <select
                  value={pCategory}
                  onChange={(e) => setPCategory(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Price (USD) *
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  step="any"
                  value={pPrice}
                  onChange={(e) => setPPrice(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Old Price (USD, optional)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={pOldPrice}
                  onChange={(e) => setPOldPrice(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Storage Options (comma-separated)
                </label>
                <input
                  value={pStorage}
                  onChange={(e) => setPStorage(e.target.value)}
                  placeholder="128GB, 256GB, 512GB"
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Colors (comma-separated)
                </label>
                <input
                  value={pColors}
                  onChange={(e) => setPColors(e.target.value)}
                  placeholder="Natural Titanium, Black"
                  className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#F5F1E8]/65">Condition:</span>
                <select
                  value={pCondition}
                  onChange={(e) =>
                    setPCondition(e.target.value as ProductCondition)
                  }
                  className="h-9 bg-[#0A0A0A] border border-[#C9A13B]/25 px-2.5 text-xs"
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={pInStock}
                  onChange={(e) => setPInStock(e.target.checked)}
                  className="accent-[#C9A13B]"
                />
                <span>In Stock</span>
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={pIsNew}
                  onChange={(e) => setPIsNew(e.target.checked)}
                  className="accent-[#C9A13B]"
                />
                <span>New Badge</span>
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={pIsSale}
                  onChange={(e) => setPIsSale(e.target.checked)}
                  className="accent-[#C9A13B]"
                />
                <span>Sale Badge</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Description (EN)
                </label>
                <textarea
                  rows={2}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#C9A13B]/25 p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                  Description (AR)
                </label>
                <textarea
                  dir="rtl"
                  rows={2}
                  value={pDescAr}
                  onChange={(e) => setPDescAr(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#C9A13B]/25 p-2.5 text-xs"
                />
              </div>
            </div>

            {/* Product Images */}
            <div>
              <label className="block text-xs text-[#F5F1E8]/65 mb-1.5">
                Images (Upload or URL, up to 10)
              </label>
              <div className="flex flex-wrap gap-2 mb-2.5">
                <input
                  value={pImageUrlInput}
                  onChange={(e) => setPImageUrlInput(e.target.value)}
                  placeholder="Paste image URL..."
                  className="flex-1 min-w-[180px] h-9 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!pImageUrlInput.trim()) return;
                    setPImages((prev) =>
                      [...prev, pImageUrlInput.trim()].slice(0, 10)
                    );
                    setPImageUrlInput('');
                  }}
                  className="h-9 px-3 border border-[#C9A13B]/40 text-xs text-[#E8D08A]"
                >
                  Add URL
                </button>
                <label className="h-9 px-3 flex items-center gap-1.5 bg-[#C9A13B]/15 border border-[#C9A13B]/45 text-xs text-[#E8D08A] cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUploadProductImages}
                    className="hidden"
                  />
                </label>
              </div>
              {pImages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {pImages.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-16 h-16 bg-[#0A0A0A] border border-[#C9A13B]/25 overflow-hidden"
                    >
                      <DeviceVisual src={img} alt={`Preview ${i + 1}`} />
                      <button
                        type="button"
                        onClick={() =>
                          setPImages((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="absolute top-0.5 end-0.5 w-5 h-5 bg-black/80 text-[#E8D08A] flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-[#C9A13B]/20">
              <button
                type="button"
                onClick={() => setShowProductForm(false)}
                className="h-10 px-5 border border-[#C9A13B]/30 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-6 bg-[#C9A13B] text-[#0A0A0A] text-xs font-bold uppercase tracking-wider hover:bg-[#E8D08A]"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Change Code Modal */}
      {showChangePin && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowChangePin(false)}
        >
          <form
            onSubmit={handleChangePin}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-[#141414] border border-[#C9A13B]/45 p-6 space-y-4"
          >
            <h3 className="font-display text-2xl text-[#E8D08A]">
              Change 4-digit code
            </h3>
            <div>
              <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                Current 4-digit code
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                required
                value={currPin}
                onChange={(e) => setCurrPin(e.target.value.replace(/\D/g, ''))}
                className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/30 px-3 text-center tracking-[0.5em]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                New 4-digit code
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/30 px-3 text-center tracking-[0.5em]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#F5F1E8]/65 mb-1">
                Confirm new code
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                required
                value={confirmNewPin}
                onChange={(e) =>
                  setConfirmNewPin(e.target.value.replace(/\D/g, ''))
                }
                className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/30 px-3 text-center tracking-[0.5em]"
              />
            </div>
            {pinMsg && <p className="text-xs text-[#E8D08A]">{pinMsg}</p>}
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 h-10 bg-[#C9A13B] text-[#0A0A0A] text-xs font-bold uppercase"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setShowChangePin(false)}
                className="px-4 h-10 border border-[#C9A13B]/30 text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
