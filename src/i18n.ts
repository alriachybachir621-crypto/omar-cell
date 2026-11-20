import { Language } from './types';

export const translations: Record<Language, {
  nav: {
    categories: string;
    catalog: string;
    services: string;
    whyUs: string;
    gallery: string;
    contact: string;
    bag: string;
    wishlist: string;
  };
  hero: {
    locationLabel: string;
    headline: string;
    subtitle: string;
    shopNow: string;
    contactUs: string;
    trustItems: string[];
  };
  categories: {
    kicker: string;
    title: string;
    subtitle: string;
    explore: string;
    all: string;
  };
  catalog: {
    kicker: string;
    title: string;
    searchPlaceholder: string;
    allCategories: string;
    allBrands: string;
    allStorage: string;
    allConditions: string;
    maxPrice: string;
    anyPrice: string;
    resetFilters: string;
    available: string;
    soldOut: string;
    badgeNew: string;
    badgeUsed: string;
    badgeSale: string;
    addToBag: string;
    viewDetails: string;
    noResults: string;
    noResultsHint: string;
    resultsCount: string;
  };
  modal: {
    storage: string;
    color: string;
    condition: string;
    newCond: string;
    usedCond: string;
    availability: string;
    inStock: string;
    outOfStock: string;
    orderWhatsapp: string;
    addToBag: string;
    addedToBag: string;
    saveWishlist: string;
    savedWishlist: string;
    close: string;
  };
  services: {
    kicker: string;
    title: string;
    subtitle: string;
  };
  whyUs: {
    kicker: string;
    title: string;
    cards: {
      num: string;
      title: string;
      body: string;
    }[];
  };
  gallery: {
    kicker: string;
    title: string;
    subtitle: string;
    facebookCta: string;
  };
  contact: {
    kicker: string;
    title: string;
    subtitle: string;
    whatsappLabel: string;
    phoneLabel: string;
    addressLabel: string;
    hoursLabel: string;
    chatWhatsapp: string;
    callNow: string;
    openMaps: string;
  };
  cart: {
    title: string;
    empty: string;
    emptyHint: string;
    subtotal: string;
    noteLabel: string;
    notePlaceholder: string;
    sendWhatsapp: string;
    clearBag: string;
    remove: string;
  };
  wishlist: {
    title: string;
    empty: string;
    emptyHint: string;
    viewProduct: string;
    remove: string;
  };
  footer: {
    tagline: string;
    rights: string;
    location: string;
  };
  whatsapp: {
    singleOrder: (p: {
      name: string;
      storage?: string;
      color?: string;
      condition: string;
      price: number;
    }) => string;
    cartOrder: (items: {
      name: string;
      storage?: string;
      color?: string;
      condition: string;
      price: number;
      quantity: number;
    }[], total: number, note?: string) => string;
    generalGreeting: string;
  };
}> = {
  en: {
    nav: {
      categories: 'Categories',
      catalog: 'Catalog',
      services: 'Services',
      whyUs: 'Why Us',
      gallery: 'Gallery',
      contact: 'Contact',
      bag: 'Bag',
      wishlist: 'Saved',
    },
    hero: {
      locationLabel: 'Qab Elias Road · Zahle Area, Lebanon',
      headline: 'Your Next Phone, Perfectly Chosen',
      subtitle: 'Curated genuine smartphones, inspected pre-owned flagships, and original accessories — served in person with transparent USD pricing.',
      shopNow: 'Shop Now',
      contactUs: 'Visit or Message',
      trustItems: ['Genuine Devices', 'Best Prices', 'Fast Service'],
    },
    categories: {
      kicker: 'Collections',
      title: 'Browse by Category',
      subtitle: 'Select a collection to filter our current inventory.',
      explore: 'Explore',
      all: 'All Devices',
    },
    catalog: {
      kicker: 'Inventory',
      title: 'Curated Devices & Accessories',
      searchPlaceholder: 'Search model, brand, or accessory...',
      allCategories: 'All Categories',
      allBrands: 'All Brands',
      allStorage: 'Any Storage',
      allConditions: 'All Conditions',
      maxPrice: 'Max Price',
      anyPrice: 'Any Price',
      resetFilters: 'Reset',
      available: 'Available',
      soldOut: 'Sold out',
      badgeNew: 'New',
      badgeUsed: 'Used',
      badgeSale: 'Sale',
      addToBag: 'Add to Bag',
      viewDetails: 'Details',
      noResults: 'No matching items found',
      noResultsHint: 'Try clearing one of your active filters or search terms.',
      resultsCount: 'items',
    },
    modal: {
      storage: 'Storage',
      color: 'Finish / Color',
      condition: 'Condition',
      newCond: 'New',
      usedCond: 'Used',
      availability: 'Availability',
      inStock: 'Available Now',
      outOfStock: 'Sold out',
      orderWhatsapp: 'Order on WhatsApp',
      addToBag: 'Add to Bag',
      addedToBag: 'Added to Bag',
      saveWishlist: 'Save to Wishlist',
      savedWishlist: 'Saved in Wishlist',
      close: 'Close',
    },
    services: {
      kicker: 'Care & Craft',
      title: 'In-Shop Services',
      subtitle: 'Dedicated device support at our Qab Elias showroom.',
    },
    whyUs: {
      kicker: 'The Omar Cell Standard',
      title: 'Why Omar Cell',
      cards: [
        {
          num: '01',
          title: 'Genuine Devices',
          body: 'Every new and pre-owned phone is verified for original parts, clean IMEI, and full battery & hardware health.',
        },
        {
          num: '02',
          title: 'Honest Prices',
          body: 'Clear USD pricing updated daily with zero hidden surprises—fair value whether upgrading or buying your first flagship.',
        },
        {
          num: '03',
          title: 'Local Shop You Can Visit',
          body: 'Located right on the Qab Elias road in the Zahle area. Inspect any device in hand before you decide.',
        },
      ],
    },
    gallery: {
      kicker: 'Showroom',
      title: 'Inside Omar Cell',
      subtitle: 'Latest arrivals, curated setups, and daily highlights from our Facebook page.',
      facebookCta: 'Follow Omar Cell on Facebook',
    },
    contact: {
      kicker: 'Visit & Direct Order',
      title: 'Connect With Omar Cell',
      subtitle: 'Questions about trade-ins, stock availability, or reservations? Reach us directly.',
      whatsappLabel: 'WhatsApp',
      phoneLabel: 'Phone',
      addressLabel: 'Address',
      hoursLabel: 'Opening Hours',
      chatWhatsapp: 'Message on WhatsApp',
      callNow: 'Call 71 569 568',
      openMaps: 'Open in Google Maps',
    },
    cart: {
      title: 'Your Selection',
      empty: 'Your bag is empty',
      emptyHint: 'Add phones or accessories to build your WhatsApp order.',
      subtotal: 'Estimated Total',
      noteLabel: 'Delivery / Pickup Note (Optional)',
      notePlaceholder: 'e.g. Pickup in Qab Elias today, or delivery to Zahle...',
      sendWhatsapp: 'Order via WhatsApp',
      clearBag: 'Clear Bag',
      remove: 'Remove',
    },
    wishlist: {
      title: 'Saved Devices',
      empty: 'No saved devices yet',
      emptyHint: 'Tap the heart on any product to bookmark it here.',
      viewProduct: 'View',
      remove: 'Remove',
    },
    footer: {
      tagline: 'Curated smartphones and accessories on the Qab Elias road, Zahle area.',
      rights: 'Omar Cell. All rights reserved.',
      location: 'Qab Elias Road · Zahle Area, Lebanon',
    },
    whatsapp: {
      singleOrder: ({ name, storage, color, condition, price }) => {
        const lines = [
          'Hello Omar Cell, I would like to order:',
          `• Product: ${name}`,
          storage ? `• Storage: ${storage}` : null,
          color ? `• Color: ${color}` : null,
          `• Condition: ${condition}`,
          `• Price: $${price.toLocaleString()}`,
        ].filter(Boolean);
        return lines.join('\n');
      },
      cartOrder: (items, total, note) => {
        const lines = [
          'Hello Omar Cell, here is my order:',
          '',
          ...items.map((item, idx) => {
            const specs = [item.storage, item.color, item.condition].filter(Boolean).join(' · ');
            return `${idx + 1}. ${item.name} (${specs}) × ${item.quantity} — $${(item.price * item.quantity).toLocaleString()}`;
          }),
          '',
          `Total: $${total.toLocaleString()} USD`,
          note?.trim() ? `Note: ${note.trim()}` : null,
        ].filter((v) => v !== null);
        return lines.join('\n');
      },
      generalGreeting: 'Hello Omar Cell, I would like to inquire about a phone.',
    },
  },
  ar: {
    nav: {
      categories: 'الفئات',
      catalog: 'الأجهزة',
      services: 'الخدمات',
      whyUs: 'لماذا عمر سيل',
      gallery: 'المعرض',
      contact: 'تواصل معنا',
      bag: 'السلة',
      wishlist: 'المفضلة',
    },
    hero: {
      locationLabel: 'طريق قب إلياس · قضاء زحلة، لبنان',
      headline: 'هاتفك القادم، مختار بعناية',
      subtitle: 'أجهزة ذكية أصلية جديدة ومستعملة مفحوصة بدقة، مع إكسسوارات أصلية وأسعار واضحة بالدولار الأمريكي.',
      shopNow: 'تصفح الأجهزة',
      contactUs: 'زرنا أو راسلنا',
      trustItems: ['أجهزة أصلية', 'أفضل الأسعار', 'خدمة سريعة'],
    },
    categories: {
      kicker: 'الأقسام',
      title: 'تصفح حسب الفئة',
      subtitle: 'اختر الفئة المناسبة لاستعراض الأجهزة المتوفرة حالياً.',
      explore: 'استعراض',
      all: 'جميع الأجهزة',
    },
    catalog: {
      kicker: 'المخزون',
      title: 'الهواتف والإكسسوارات المختارة',
      searchPlaceholder: 'ابحث عن جهاز، ماركة، أو إكسسوار...',
      allCategories: 'كل الفئات',
      allBrands: 'كل الماركات',
      allStorage: 'كل السعات',
      allConditions: 'كل الحالات',
      maxPrice: 'الحد الأقصى للسعر',
      anyPrice: 'كل الأسعار',
      resetFilters: 'إعادة ضبط',
      available: 'متوفر',
      soldOut: 'نفذت الكمية',
      badgeNew: 'جديد',
      badgeUsed: 'مستعمل',
      badgeSale: 'عرض',
      addToBag: 'أضف للسلة',
      viewDetails: 'التفاصيل',
      noResults: 'لم يتم العثور على نتائج مطابقة',
      noResultsHint: 'جرّب تعديل خيارات البحث أو إزالة الفلاتر.',
      resultsCount: 'منتج',
    },
    modal: {
      storage: 'السعة التخزينية',
      color: 'اللون',
      condition: 'الحالة',
      newCond: 'جديد',
      usedCond: 'مستعمل',
      availability: 'التوفر',
      inStock: 'متوفر الآن',
      outOfStock: 'نفذت الكمية',
      orderWhatsapp: 'اطلب عبر واتساب',
      addToBag: 'أضف إلى السلة',
      addedToBag: 'تمت الإضافة للسلة',
      saveWishlist: 'حفظ في المفضلة',
      savedWishlist: 'محفوظ في المفضلة',
      close: 'إغلاق',
    },
    services: {
      kicker: 'عناية واحتراف',
      title: 'خدماتنا في المتجر',
      subtitle: 'دعم متكامل لهاتفك في فرعنا على طريق قب إلياس.',
    },
    whyUs: {
      kicker: 'معيار عمر سيل',
      title: 'لماذا عمر سيل',
      cards: [
        {
          num: '01',
          title: 'أجهزة أصلية مضمونة',
          body: 'كل هاتف جديد أو مستعمل يخضع لفحص شامل للتأكد من القطع الأصلية وحالة البطارية والرقم التسلسلي.',
        },
        {
          num: '02',
          title: 'أسعار صادقة وواضحة',
          body: 'تسعير شفاف بالدولار الأمريكي يتم تحديثه باستمرار بدون أي تكاليف مخفية.',
        },
        {
          num: '03',
          title: 'متجر محلي يمكنك زيارته',
          body: 'موقعنا على طريق قب إلياس – زحلة يتيح لك معاينة الهاتف بنفسك قبل الشراء بكل ثقة.',
        },
      ],
    },
    gallery: {
      kicker: 'المعرض',
      title: 'من داخل عمر سيل',
      subtitle: 'أحدث الأجهزة الواصلة ولقطات يومية من صفحتنا على فيسبوك.',
      facebookCta: 'تابع صفحة عمر سيل على فيسبوك',
    },
    contact: {
      kicker: 'الزيارة والطلب المباشر',
      title: 'تواصل مع عمر سيل',
      subtitle: 'للاستفسار عن التوفر، البدل، أو الحجز، تواصل معنا مباشرة.',
      whatsappLabel: 'واتساب',
      phoneLabel: 'الهاتف',
      addressLabel: 'العنوان',
      hoursLabel: 'ساعات العمل',
      chatWhatsapp: 'راسلنا على واتساب',
      callNow: 'اتصل على 71 569 568',
      openMaps: 'افتح في خرائط غوغل',
    },
    cart: {
      title: 'سلة الطلبات',
      empty: 'السلة فارغة حالياً',
      emptyHint: 'أضف الهواتف أو الإكسسوارات لإرسال طلبك عبر واتساب.',
      subtotal: 'المجموع التقديري',
      noteLabel: 'ملاحظة الاستلام أو التوصيل (اختياري)',
      notePlaceholder: 'مثال: استلام من المحل في قب إلياس اليوم، أو توصيل إلى زحلة...',
      sendWhatsapp: 'إرسال الطلب عبر واتساب',
      clearBag: 'إفراغ السلة',
      remove: 'حذف',
    },
    wishlist: {
      title: 'الأجهزة المحفوظة',
      empty: 'لا توجد أجهزة محفوظة بعد',
      emptyHint: 'اضغط على أيقونة القلب لحفظ أي جهاز هنا.',
      viewProduct: 'عرض',
      remove: 'إزالة',
    },
    footer: {
      tagline: 'أجهزة ذكية مختارة وإكسسوارات أصلية على طريق قب إلياس، منطقة زحلة.',
      rights: 'عمر سيل. جميع الحقوق محفوظة.',
      location: 'طريق قب إلياس · منطقة زحلة، لبنان',
    },
    whatsapp: {
      singleOrder: ({ name, storage, color, condition, price }) => {
        const lines = [
          'مرحباً عمر سيل، أرغب بطلب الجهاز التالي:',
          `• المنتج: ${name}`,
          storage ? `• السعة: ${storage}` : null,
          color ? `• اللون: ${color}` : null,
          `• الحالة: ${condition === 'New' ? 'جديد' : 'مستعمل'}`,
          `• السعر: $${price.toLocaleString()}`,
        ].filter(Boolean);
        return lines.join('\n');
      },
      cartOrder: (items, total, note) => {
        const lines = [
          'مرحباً عمر سيل، هذا طلبي:',
          '',
          ...items.map((item, idx) => {
            const cond = item.condition === 'New' ? 'جديد' : 'مستعمل';
            const specs = [item.storage, item.color, cond].filter(Boolean).join(' · ');
            return `${idx + 1}. ${item.name} (${specs}) × ${item.quantity} — $${(item.price * item.quantity).toLocaleString()}`;
          }),
          '',
          `المجموع: $${total.toLocaleString()} USD`,
          note?.trim() ? `ملاحظة: ${note.trim()}` : null,
        ].filter((v) => v !== null);
        return lines.join('\n');
      },
      generalGreeting: 'مرحباً عمر سيل، أود الاستفسار عن هاتف.',
    },
  },
};
