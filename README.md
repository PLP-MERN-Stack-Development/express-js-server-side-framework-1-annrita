# Express.js RESTful API Assignment

This assignment focuses on building a RESTful API using Express.js, implementing proper routing, middleware, and error handling.

## Assignment Overview

You will:
1. Set up an Express.js server
2. Create RESTful API routes for a product resource
3. Implement custom middleware for logging, authentication, and validation
4. Add comprehensive error handling
5. Develop advanced features like filtering, pagination, and search

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Install dependencies:
   ```
   npm install
   ```
4. Run the server:
   ```
   npm start
   ```

## Files Included

- `Week2-Assignment.md`: Detailed assignment instructions
- `server.js`: Starter Express.js server file
- `.env.example`: Example environment variables file

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Postman, Insomnia, or curl for API testing

## API Endpoints

The API will have the following endpoints:

- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get a specific product
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete all the required API endpoints
2. Implement the middleware and error handling
3. Document your API in the README.md
4. Include examples of requests and responses

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) 







## How to Run the Server

1. **Install Node.js** (v18 or higher) and npm or yarn.
2. **Clone the repository** and navigate to the project directory.

```
git clone <your-repo-url>
cd express-js-server-side-framework-1-annrita
```
3. **Install dependencies:**
   ```
   npm install
   ```
4. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values.
5. **Start the server:**
   ```
   npm start
   ```
   The server will run on `http://localhost:3000` by default.

---

## API Documentation

## 🔒 Authentication

All endpoints require an `x-api-key` header with a valid API key.

---

### Endpoints

#### 1. Get All Products

- **GET** `/api/products`
- **Query Parameters:**
  - `category` (string): Filter by category
  - `search` (string): Search by product name **GET** `api/products/search?name=coffee`
  - `page` (number): Page number (pagination)
  - `limit` (number): Items per page (pagination)

**Example Request:**
```http
GET /api/products?category=groceries&page=1&limit=5

```

**Example Response:**
```json
{
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 5,
    "products": [
        {
            "id": "7",
            "name": "Cooking Oil 5L",
            "description": "Pure sunflower oil ideal for all types of cooking.",
            "price": 1300,
            "category": "groceries",
            "inStock": true
        }
    ]
}
```

---

#### 2. Get a Specific Product

- **GET** `/api/products/:id`

**Example Request:**
```http
GET /api/products/7
```

**Example Response:**
```json
{
    "id": "7",
    "name": "Cooking Oil 5L",
    "description": "Pure sunflower oil ideal for all types of cooking.",
    "price": 1300,
    "category": "groceries",
    "inStock": true
}
```

---

#### 3. Create a New Product

- **POST** `/api/products`
- **Headers:** `Content-Type: application/json`, `x-api-key: your_api_key_here`
- **Body:**
  - `name` (string, required)
  - `description` (string, required)
  - `price` (number, required)
  - `category` (string)
  - `inStock` (boolean, required)

**Example Request:**
```http
POST /api/products
Content-Type: application/json
x-api-key: your_api_key_here

 {
    "name": "Lego City Toy",
    "description": "Creative building toy set for kids aged 6+.",
    "price": 8400,
    "category": "toys",
    "inStock": true
  }
```

**Example Response:**
```json
{
    "id": "2d28314d-b9e7-4480-9b7c-3600f6bd4143",
    "name": "Lego City Toy",
    "description": "Creative building toy set for kids aged 6+.",
    "price": 8400,
    "category": "toys",
    "inStock": true
}
```

---

#### 4. Update a Product

- **PUT** `/api/products/:id`
- **Headers:** `Content-Type: application/json`, `x-api-key: your_api_key_here`
- **Body:** Any updatable product fields

**Example Request:**
```http
PUT /api/products/1
Content-Type: application/json
x-api-key: your_api_key_here

{
    "name": "Smartphone",
    "description": "Latest model with 128GB storage",
    "price": 66000,
    "category": "electronics",
    "inStock": false
}
```

**Example Response:**
```json
{
    "id": "2",
    "name": "Smartphone",
    "description": "Latest model with 128GB storage",
    "price": 66000,
    "category": "electronics",
    "inStock": false
}
```

---

#### 5. Delete a Product

- **DELETE** `/api/products/:id`
- **Headers:** `x-api-key: usesecretkey`

**Example Request:**
```http
DELETE /api/products/5
x-api-key: your_api_key_here
```

**Example Response:**
```json
{
    "message": "Product deleted successfully!"
}
```

---

#### 6. Product Statistics
**Request**
```http
GET /api/products/stats
```
```json
{
    "totalProducts": 7,
    "inStockCount": 5,
    "outOfStockCount": 2,
    "categories": {
        "electronics": 2,
        "kitchen": 1,
        "toys": 2,
        "fashion": 1,
        "groceries": 1
    }
}
```

## Error Handling

Errors are returned in the following format:

```json
{
    "error": {
        "type": "ValidationError",
        "message": "Validation Error: Invalid data types. Ensure name, description, and category are strings; price is a number; and inStock is a boolean."
    }
}
```

---

## Testing

You can use [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), or `curl` to test the API endpoints.

---
