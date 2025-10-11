// Mock data for vendor management pages
// Simplified from database schema for flexibility

export interface MockSPU {
  id: number
  code: string
  name: string
  description: string
  brand: string
  category: string
  is_active: boolean
  date_created: string
  date_updated: string
  skus: MockSKU[]
  images: string[]
  tags: string[]
  views: number
  sales: number
  rating: number
  review_count: number
}

export interface MockSKU {
  id: number
  spu_id: number
  price: number
  stock: number
  can_combine: boolean
  attributes: Record<string, string>
  date_created: string
  date_updated: string
  is_featured: boolean
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
}

export interface MockStock {
  id: number
  sku_id: number
  sku_name: string
  current_stock: number
  sold: number
  last_updated: string
  history: MockStockHistory[]
}

export interface MockStockHistory {
  id: number
  change: number
  date_created: string
}

export interface MockRefund {
  id: number
  order_item_id: number
  customer_name: string
  product_name: string
  method: 'PickUp' | 'DropOff'
  status: 'Pending' | 'Processing' | 'Success' | 'Canceled'
  reason: string
  address?: string
  date_created: string
}

export interface MockComment {
  id: number
  product_name: string
  customer_name: string
  score: number
  body: string
  upvote: number
  downvote: number
  ref_type: 'ProductSpu' | 'Comment'
  ref_id: number
  date_created: string
}

export interface MockPromotion {
  id: number
  code: string
  title: string
  description: string
  type: 'Discount' | 'Bundle' | 'BuyXGetY' | 'Cashback'
  ref_type: 'All' | 'ProductSpu' | 'ProductSku' | 'Category' | 'Brand'
  ref_id?: number
  is_active: boolean
  auto_apply: boolean
  date_started: string
  date_ended?: string
  discount: {
    min_spend: number
    max_discount: number
    discount_percent?: number
    discount_price?: number
  }
}

export interface MockOrder {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  payment_status: 'Pending' | 'Processing' | 'Success' | 'Canceled'
  shipping_status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Returned'
  total_items: number
  total_amount: number
  shipping_address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  billing_address?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  date_created: string
  date_updated: string
  estimated_delivery?: string
  tracking_number?: string
  items: MockOrderItem[]
  notes?: string
  priority: 'Low' | 'Normal' | 'High' | 'Urgent'
}

export interface MockOrderItem {
  id: number
  sku_name: string
  sku_id: number
  product_image?: string
  quantity: number
  price: number
  status: 'Pending' | 'Processing' | 'Success' | 'Canceled'
  confirmed_by_id?: number
  confirmed_at?: string
  shipped_at?: string
  delivered_at?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
}

// Mock data
export const mockSpus: MockSPU[] = [
  {
    id: 1,
    code: 'LAPTOP-001',
    name: 'Business Laptop Pro',
    description: 'High-performance laptop for business professionals with advanced security features and long battery life',
    brand: 'TechCorp',
    category: 'Electronics',
    is_active: true,
    date_created: '2024-01-15',
    date_updated: '2024-01-20',
    images: ['/business-laptop-computer.jpg', '/technology-office-equipment.jpg'],
    tags: ['business', 'laptop', 'professional', 'portable'],
    views: 1247,
    sales: 89,
    rating: 4.6,
    review_count: 23,
    skus: [
      {
        id: 1,
        spu_id: 1,
        price: 1299,
        stock: 50,
        can_combine: true,
        attributes: { color: 'Silver', storage: '512GB', ram: '16GB' },
        date_created: '2024-01-15',
        date_updated: '2024-01-20',
        is_featured: true,
        weight: 1.5,
        dimensions: { length: 35, width: 24, height: 2 }
      },
      {
        id: 2,
        spu_id: 1,
        price: 1499,
        stock: 30,
        can_combine: true,
        attributes: { color: 'Black', storage: '1TB', ram: '32GB' },
        date_created: '2024-01-15',
        date_updated: '2024-01-20',
        is_featured: false,
        weight: 1.6,
        dimensions: { length: 35, width: 24, height: 2 }
      }
    ]
  },
  {
    id: 2,
    code: 'CHAIR-001',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable ergonomic chair for long work sessions with lumbar support and adjustable height',
    brand: 'ComfortMax',
    category: 'Furniture',
    is_active: true,
    date_created: '2024-01-20',
    date_updated: '2024-01-25',
    images: ['/professional-office-chair.jpg'],
    tags: ['ergonomic', 'office', 'comfort', 'adjustable'],
    views: 892,
    sales: 156,
    rating: 4.4,
    review_count: 18,
    skus: [
      {
        id: 3,
        spu_id: 2,
        price: 299,
        stock: 100,
        can_combine: true,
        attributes: { color: 'Black', material: 'Mesh' },
        date_created: '2024-01-20',
        date_updated: '2024-01-25',
        is_featured: true,
        weight: 12.5,
        dimensions: { length: 60, width: 60, height: 120 }
      },
      {
        id: 4,
        spu_id: 2,
        price: 349,
        stock: 75,
        can_combine: true,
        attributes: { color: 'Gray', material: 'Leather' },
        date_created: '2024-01-20',
        date_updated: '2024-01-25',
        is_featured: false,
        weight: 15.2,
        dimensions: { length: 60, width: 60, height: 120 }
      }
    ]
  },
  {
    id: 3,
    code: 'DESK-001',
    name: 'Standing Desk Converter',
    description: 'Adjustable standing desk converter with electric height adjustment and spacious work surface',
    brand: 'WorkWell',
    category: 'Furniture',
    is_active: false,
    date_created: '2024-02-01',
    date_updated: '2024-02-05',
    images: ['/standing-desk-converter.png'],
    tags: ['standing', 'desk', 'adjustable', 'health'],
    views: 456,
    sales: 23,
    rating: 4.2,
    review_count: 8,
    skus: [
      {
        id: 5,
        spu_id: 3,
        price: 199,
        stock: 0,
        can_combine: false,
        attributes: { size: 'Large', color: 'White' },
        date_created: '2024-02-01',
        date_updated: '2024-02-05',
        is_featured: false,
        weight: 18.5,
        dimensions: { length: 80, width: 60, height: 20 }
      }
    ]
  },
  {
    id: 4,
    code: 'SUPPLIES-001',
    name: 'Office Supplies Kit',
    description: 'Complete office supplies kit with pens, notebooks, folders, and desk organizers',
    brand: 'OfficePro',
    category: 'Office Supplies',
    is_active: true,
    date_created: '2024-01-10',
    date_updated: '2024-01-15',
    images: ['/office-supplies-kit.png', '/office-supplies-desk.jpg'],
    tags: ['supplies', 'kit', 'office', 'complete'],
    views: 678,
    sales: 234,
    rating: 4.7,
    review_count: 45,
    skus: [
      {
        id: 6,
        spu_id: 4,
        price: 49,
        stock: 200,
        can_combine: true,
        attributes: { size: 'Standard', color: 'Mixed' },
        date_created: '2024-01-10',
        date_updated: '2024-01-15',
        is_featured: true,
        weight: 2.1,
        dimensions: { length: 30, width: 20, height: 8 }
      }
    ]
  },
  {
    id: 5,
    code: 'FURNITURE-001',
    name: 'Modern Office Furniture Set',
    description: 'Complete modern office furniture set including desk, chair, and storage solutions',
    brand: 'ModernOffice',
    category: 'Furniture',
    is_active: true,
    date_created: '2024-01-05',
    date_updated: '2024-01-12',
    images: ['/modern-office-furniture.png', '/modern-business-office-workspace.jpg'],
    tags: ['furniture', 'modern', 'set', 'complete'],
    views: 1023,
    sales: 67,
    rating: 4.5,
    review_count: 12,
    skus: [
      {
        id: 7,
        spu_id: 5,
        price: 899,
        stock: 25,
        can_combine: true,
        attributes: { color: 'White', style: 'Modern' },
        date_created: '2024-01-05',
        date_updated: '2024-01-12',
        is_featured: true,
        weight: 45.0,
        dimensions: { length: 120, width: 80, height: 75 }
      }
    ]
  }
]

export const mockStock: MockStock[] = [
  {
    id: 1,
    sku_id: 1,
    sku_name: 'Business Laptop Pro - Silver 512GB',
    current_stock: 50,
    sold: 25,
    last_updated: '2024-01-20',
    history: [
      { id: 1, change: 100, date_created: '2024-01-15' },
      { id: 2, change: -25, date_created: '2024-01-20' }
    ]
  },
  {
    id: 2,
    sku_id: 2,
    sku_name: 'Business Laptop Pro - Black 1TB',
    current_stock: 30,
    sold: 20,
    last_updated: '2024-01-20',
    history: [
      { id: 3, change: 50, date_created: '2024-01-15' },
      { id: 4, change: -20, date_created: '2024-01-20' }
    ]
  }
]

export const mockRefunds: MockRefund[] = [
  {
    id: 1,
    order_item_id: 101,
    customer_name: 'John Doe',
    product_name: 'Business Laptop Pro - Silver',
    method: 'PickUp',
    status: 'Pending',
    reason: 'Product arrived damaged',
    address: '123 Main St, City, State',
    date_created: '2024-01-25'
  },
  {
    id: 2,
    order_item_id: 102,
    customer_name: 'Jane Smith',
    product_name: 'Ergonomic Office Chair - Black',
    method: 'DropOff',
    status: 'Processing',
    reason: 'Wrong color received',
    date_created: '2024-01-26'
  }
]

export const mockComments: MockComment[] = [
  {
    id: 1,
    product_name: 'Business Laptop Pro',
    customer_name: 'Mike Johnson',
    score: 5,
    body: 'Excellent laptop, fast performance and great build quality. Highly recommended!',
    upvote: 12,
    downvote: 0,
    ref_type: 'ProductSpu',
    ref_id: 1,
    date_created: '2024-01-22'
  },
  {
    id: 2,
    product_name: 'Ergonomic Office Chair',
    customer_name: 'Sarah Wilson',
    score: 4,
    body: 'Very comfortable chair, good for long work sessions. Minor issue with assembly instructions.',
    upvote: 8,
    downvote: 1,
    ref_type: 'ProductSpu',
    ref_id: 2,
    date_created: '2024-01-23'
  }
]

export const mockPromotions: MockPromotion[] = [
  {
    id: 1,
    code: 'SAVE20',
    title: '20% Off Electronics',
    description: 'Get 20% off all electronics',
    type: 'Discount',
    ref_type: 'Category',
    ref_id: 1,
    is_active: true,
    auto_apply: true,
    date_started: '2024-01-01',
    date_ended: '2024-12-31',
    discount: {
      min_spend: 100,
      max_discount: 500,
      discount_percent: 20
    }
  },
  {
    id: 2,
    code: 'BUNDLE50',
    title: 'Buy 2 Get 1 Free',
    description: 'Buy any 2 items, get 1 free',
    type: 'BuyXGetY',
    ref_type: 'All',
    is_active: true,
    auto_apply: false,
    date_started: '2024-02-01',
    date_ended: '2024-02-29',
    discount: {
      min_spend: 0,
      max_discount: 0
    }
  }
]

export const mockOrders: MockOrder[] = [
  {
    id: 1,
    order_number: 'ORD-2024-001',
    customer_name: 'John Doe',
    customer_email: 'john.doe@email.com',
    customer_phone: '+1 (555) 123-4567',
    payment_status: 'Success',
    shipping_status: 'Delivered',
    total_items: 2,
    total_amount: 1598,
    shipping_address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    billing_address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    date_created: '2024-01-20',
    date_updated: '2024-01-22',
    estimated_delivery: '2024-01-25',
    tracking_number: 'TRK123456789',
    priority: 'Normal',
    notes: 'Customer requested morning delivery',
    items: [
      {
        id: 1,
        sku_name: 'Business Laptop Pro - Silver 512GB',
        sku_id: 1,
        product_image: '/business-laptop-computer.jpg',
        quantity: 1,
        price: 1299,
        status: 'Success',
        confirmed_by_id: 1,
        confirmed_at: '2024-01-20T10:30:00Z',
        shipped_at: '2024-01-21T14:00:00Z',
        delivered_at: '2024-01-22T09:15:00Z',
        weight: 1.5,
        dimensions: { length: 35, width: 24, height: 2 }
      },
      {
        id: 2,
        sku_name: 'Ergonomic Office Chair - Black',
        sku_id: 3,
        product_image: '/professional-office-chair.jpg',
        quantity: 1,
        price: 299,
        status: 'Success',
        confirmed_by_id: 1,
        confirmed_at: '2024-01-20T10:30:00Z',
        shipped_at: '2024-01-21T14:00:00Z',
        delivered_at: '2024-01-22T09:15:00Z',
        weight: 12.5,
        dimensions: { length: 60, width: 60, height: 120 }
      }
    ]
  },
  {
    id: 2,
    order_number: 'ORD-2024-002',
    customer_name: 'Jane Smith',
    customer_email: 'jane.smith@email.com',
    customer_phone: '+1 (555) 987-6543',
    payment_status: 'Processing',
    shipping_status: 'Processing',
    total_items: 1,
    total_amount: 1499,
    shipping_address: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90210',
      country: 'USA'
    },
    date_created: '2024-01-25',
    date_updated: '2024-01-25',
    estimated_delivery: '2024-01-30',
    priority: 'High',
    items: [
      {
        id: 3,
        sku_name: 'Business Laptop Pro - Black 1TB',
        sku_id: 2,
        product_image: '/business-laptop-computer.jpg',
        quantity: 1,
        price: 1499,
        status: 'Pending',
        weight: 1.6,
        dimensions: { length: 35, width: 24, height: 2 }
      }
    ]
  },
  {
    id: 3,
    order_number: 'ORD-2024-003',
    customer_name: 'Mike Johnson',
    customer_email: 'mike.johnson@email.com',
    customer_phone: '+1 (555) 456-7890',
    payment_status: 'Success',
    shipping_status: 'Shipped',
    total_items: 3,
    total_amount: 1247,
    shipping_address: {
      street: '789 Pine Street',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    },
    date_created: '2024-01-22',
    date_updated: '2024-01-24',
    estimated_delivery: '2024-01-28',
    tracking_number: 'TRK987654321',
    priority: 'Normal',
    items: [
      {
        id: 4,
        sku_name: 'Office Supplies Kit - Standard',
        sku_id: 6,
        product_image: '/office-supplies-kit.png',
        quantity: 2,
        price: 49,
        status: 'Success',
        confirmed_by_id: 1,
        confirmed_at: '2024-01-22T11:00:00Z',
        shipped_at: '2024-01-24T16:30:00Z',
        weight: 2.1,
        dimensions: { length: 30, width: 20, height: 8 }
      },
      {
        id: 5,
        sku_name: 'Modern Office Furniture Set - White',
        sku_id: 7,
        product_image: '/modern-office-furniture.png',
        quantity: 1,
        price: 899,
        status: 'Success',
        confirmed_by_id: 1,
        confirmed_at: '2024-01-22T11:00:00Z',
        shipped_at: '2024-01-24T16:30:00Z',
        weight: 45.0,
        dimensions: { length: 120, width: 80, height: 75 }
      }
    ]
  },
  {
    id: 4,
    order_number: 'ORD-2024-004',
    customer_name: 'Sarah Wilson',
    customer_email: 'sarah.wilson@email.com',
    payment_status: 'Pending',
    shipping_status: 'Pending',
    total_items: 1,
    total_amount: 199,
    shipping_address: {
      street: '321 Elm Street',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'USA'
    },
    date_created: '2024-01-26',
    date_updated: '2024-01-26',
    estimated_delivery: '2024-02-02',
    priority: 'Low',
    items: [
      {
        id: 6,
        sku_name: 'Standing Desk Converter - Large White',
        sku_id: 5,
        product_image: '/standing-desk-converter.png',
        quantity: 1,
        price: 199,
        status: 'Pending',
        weight: 18.5,
        dimensions: { length: 80, width: 60, height: 20 }
      }
    ]
  }
]
