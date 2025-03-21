# React E-Commerce Admin Panel

This is a React-based admin panel for managing products in an e-commerce application. It allows users to add products with images, categorize them using AI, view product recommendations based on sentiment analysis, and add customer reviews.

## Features
- Add new products with images
- AI-based product categorization (MobileNetV2)
- Fetch and display product list
- Add customer reviews
- Sentiment analysis for reviews (Hugging Face API)
- Filter products based on positive sentiment
- Recommendation page suggests products with "POSITIVE" reviews

## Tech Stack
- React (Next.js)
- Ant Design UI
- Axios for API requests
- Tailwind CSS for styling

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/ecommerce-admin.git
   cd ecommerce-admin
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env.local` file and set the API URL:
   ```sh
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Run the development server:
   ```sh
   npm run dev
   ```

## Usage

### Adding a Product
1. Enter the product name and price.
2. Upload an image.
3. Click "Add Product" to submit the product.

### Viewing Products
- All products are displayed on the main screen.
- Products with positive reviews appear under "Recommendations".

### Adding a Review
1. Click "Add Review" on a product.
2. Enter a comment.
3. Submit the review to analyze its sentiment.

## API Endpoints
This application interacts with a Flask backend providing the following endpoints:

- `GET /products` - Fetch all products.
- `POST /products` - Add a new product (with image upload).
- `POST /reviews` - Submit a product review and analyze sentiment.

## License
MIT License

