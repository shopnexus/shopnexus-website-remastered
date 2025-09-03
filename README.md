# ShopNexus - Modern Ecommerce Website

A modern, responsive ecommerce website built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Modern Design**: Clean, responsive design with beautiful UI components
- **Modular Architecture**: Reusable components for easy maintenance and scalability
- **Shopping Cart**: Full cart functionality with context-based state management
- **Product Catalog**: Featured products with ratings, reviews, and pricing
- **Category Navigation**: Organized product categories with icons
- **Customer Testimonials**: Social proof with customer reviews
- **Newsletter Signup**: Email subscription functionality
- **Mobile Responsive**: Optimized for all device sizes
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context API
- **Fonts**: Geist Sans & Geist Mono

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── layout/            # Layout components
│   │   ├── header.tsx     # Navigation header
│   │   └── footer.tsx     # Site footer
│   ├── home/              # Home page components
│   │   ├── hero-section.tsx
│   │   ├── featured-products.tsx
│   │   ├── categories-section.tsx
│   │   ├── testimonials-section.tsx
│   │   └── newsletter-section.tsx
│   ├── products/          # Product-related components
│   │   └── product-card.tsx
│   └── ui/                # shadcn/ui components
├── contexts/              # React contexts
│   └── cart-context.tsx   # Shopping cart state management
├── data/                  # Mock data and constants
│   └── mock-products.ts   # Sample product data
└── core/                  # Business logic (existing structure)
```

## 🎨 Components

### Layout Components

- **Header**: Navigation with search, cart, and user menu
- **Footer**: Company info, links, and contact details

### Home Page Components

- **HeroSection**: Compelling landing section with CTA buttons
- **FeaturedProducts**: Product grid with add-to-cart functionality
- **CategoriesSection**: Category navigation with icons
- **TestimonialsSection**: Customer reviews and ratings
- **NewsletterSection**: Email subscription form

### Product Components

- **ProductCard**: Reusable product display with:
  - Product image with hover effects
  - Rating system
  - Price display with discounts
  - Add to cart/wishlist buttons
  - Sale and new product badges

## 🛒 Shopping Cart Features

- Add/remove items from cart
- Update item quantities
- Real-time cart total calculation
- Persistent cart state across pages
- Cart item count badge in header

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd shopnexus-website-remastered
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Responsive Design

The website is fully responsive and optimized for:

- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

## 🎯 Key Features Implemented

### Home Page

- ✅ Hero section with compelling copy and CTAs
- ✅ Featured products grid
- ✅ Category navigation
- ✅ Customer testimonials
- ✅ Newsletter signup
- ✅ Responsive header and footer

### Shopping Cart

- ✅ Add items to cart
- ✅ Remove items from cart
- ✅ Update quantities
- ✅ Real-time total calculation
- ✅ Cart state persistence

### UI/UX

- ✅ Modern, clean design
- ✅ Hover effects and animations
- ✅ Loading states
- ✅ Error handling
- ✅ Accessibility features

## 🔧 Customization

### Adding New Components

1. Create your component in the appropriate directory
2. Export it from the component file
3. Import and use it in your pages

### Styling

- Use Tailwind CSS classes for styling
- Follow the existing design system
- Use shadcn/ui components for consistency

### Adding Products

1. Add product data to `src/data/mock-products.ts`
2. Use the `ProductCard` component to display them
3. Implement cart functionality using the cart context

## 📈 Performance Optimizations

- Image optimization with Next.js Image component
- Lazy loading for better performance
- Efficient state management with React Context
- Minimal bundle size with tree shaking

## 🔮 Future Enhancements

- [ ] Product detail pages
- [ ] User authentication
- [ ] Payment integration
- [ ] Order management
- [ ] Admin dashboard
- [ ] Search functionality
- [ ] Filtering and sorting
- [ ] Wishlist functionality
- [ ] Product reviews system
- [ ] Inventory management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email <support@shopnexus.com> or create an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
