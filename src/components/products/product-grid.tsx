import { ProductCard } from "./product-card"

const sampleProducts = [
  {
    id: "1",
    name: "Professional Office Chair - Ergonomic Design",
    description: "High-quality ergonomic office chair with lumbar support and adjustable height",
    price: 299.99,
    originalPrice: 399.99,
    image: "/professional-office-chair.jpg",
    category: "Furniture",
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    minOrderQuantity: 5,
  },
  {
    id: "2",
    name: "Wireless Business Laptop - 16GB RAM",
    description: "High-performance laptop perfect for business applications and productivity",
    price: 1299.99,
    image: "/business-laptop-computer.jpg",
    category: "Technology",
    rating: 4.8,
    reviewCount: 89,
    inStock: true,
    minOrderQuantity: 1,
  },
  {
    id: "3",
    name: "Premium Paper Pack - 5000 Sheets",
    description: "High-quality copy paper suitable for all office printing needs",
    price: 49.99,
    originalPrice: 59.99,
    image: "/office-paper-stack.jpg",
    category: "Office Supplies",
    rating: 4.2,
    reviewCount: 256,
    inStock: true,
    minOrderQuantity: 10,
  },
  {
    id: "4",
    name: "Standing Desk Converter",
    description: "Adjustable standing desk converter for healthier work habits",
    price: 199.99,
    image: "/standing-desk-converter.png",
    category: "Furniture",
    rating: 4.6,
    reviewCount: 74,
    inStock: false,
    minOrderQuantity: 2,
  },
  {
    id: "5",
    name: "Wireless Conference System",
    description: "Professional wireless conference system for meeting rooms",
    price: 899.99,
    image: "/conference-room-system.jpg",
    category: "Technology",
    rating: 4.7,
    reviewCount: 45,
    inStock: true,
    minOrderQuantity: 1,
  },
  {
    id: "6",
    name: "Office Supply Starter Kit",
    description: "Complete starter kit with pens, notebooks, and essential supplies",
    price: 79.99,
    originalPrice: 99.99,
    image: "/office-supplies-kit.png",
    category: "Office Supplies",
    rating: 4.3,
    reviewCount: 167,
    inStock: true,
    minOrderQuantity: 5,
  },
]

export function ProductGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sampleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
