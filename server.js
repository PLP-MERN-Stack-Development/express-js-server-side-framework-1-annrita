// server.js - Starter Express server for Week 2 assignment

// Task 1: Express.js Setup

// Import required modules
const express = require("express");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Task 3: Middleware Implementation

// Middleware setup
// TODO: Implement custom middleware for:

// -Parsing JSON request bodies
app.use(express.json());

// - Request logging
const logs = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${req.method} ${req.originalUrl} [${timestamp}]`);
  next();
};
app.use(logs);

// - Authentication, checks for an API key in the request headers
const authenticate = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return next(
      new AuthenticationError("Unauthorized: Invalid or missing API key")
    );
  }

  next();
};

// - Validation middleware for the product creation and update routes
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || !price || !category || inStock === undefined) {
    return next(
      new ValidationError(
        "Validation Error: 'name', 'description', 'price', 'category', and 'inStock' are required fields."
      )
    );
  }

  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof price !== "number" ||
    typeof category !== "string" ||
    typeof inStock !== "boolean"
  ) {
    return next(
      new ValidationError(
        "Validation Error: Invalid data types. Ensure name, description, and category are strings; price is a number; and inStock is a boolean."
      )
    );
  }

  next();
};

// Custom Error Classes
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message || "Resource not found", 404);
    this.name = "NotFoundError";
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message || "Validation failed", 400);
    this.name = "ValidationError";
  }
}

class AuthenticationError extends AppError {
  constructor(message) {
    super(message || "Unauthorized access", 401);
    this.name = "AuthenticationError";
  }
}

//Asyc Error Handler Wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Task 2: RESTful API Routes

// Sample in-memory products database
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
  {
    id: "4",
    name: "Lego City Set",
    description: "Creative building toy set for kids aged 6+.",
    price: 4200,
    category: "toys",
    inStock: true,
  },
  {
    id: "5",
    name: "Teddy Bear Plush",
    description: "Soft and cuddly teddy bear perfect for gifting.",
    price: 1500,
    category: "toys",
    inStock: true,
  },
  {
    id: "6",
    name: "Running Shoes",
    description: "Lightweight breathable shoes ideal for running and training.",
    price: 5600,
    category: "fashion",
    inStock: true,
  },
  {
    id: "7",
    name: "Cooking Oil 5L",
    description: "Pure sunflower oil ideal for all types of cooking.",
    price: 1300,
    category: "groceries",
    inStock: true,
  },
];

// Root route
app.get("/", (req, res) => {
  res.send(
    "Hello, World! Welcome to the Product API! Go to /api/products to see all products."
  );
});


// Task 5: Advanced Features

// TODO: Implement the following routes:

// GET /api/products - Get all products
// Category filtering
// Pagination
app.get(
  "/api/products",
  asyncHandler(async (req, res, next) => {
    let { category, page = 1, limit = 5 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return next(
        new ValidationError(
          "Invalid pagination parameters. 'page' and 'limit' must be positive numbers."
        )
      );
    }
    let results = products;

    //  If a category query parameter is present, filter by it
    if (category) {
      results = results.filter(
        (p) => (p.category || "").toLowerCase() === category.toLowerCase()
      );
      // If no matching products found, throw a NotFoundError
      if (results.length === 0) {
        return next(
          new NotFoundError(`No products found in category '${category}'`)
        );
      }
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = results.slice(startIndex, endIndex);
    if (paginatedResults.length === 0) {
      return next(
        new NotFoundError("No products found for the requested page.")
      );
    }
    res.json({
      currentPage: page,
      totalPages: Math.ceil(results.length / limit),
      totalItems: results.length,
      itemsPerPage: limit,
      products: paginatedResults,
    });
  })
);
// GET /api/products/search?name=keyword - Search products by name
app.get(
  "/api/products/search",
  asyncHandler(async (req, res, next) => {
    const { name } = req.query;

    if (!name || name.trim() === "") {
      return next(new ValidationError("Search query parameter 'name' is required."));
    }
    const searchResults = products.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
    if (searchResults.length === 0) {
      return next(new NotFoundError(`No products found matching '${name}'.`));
    }
    res.json({
      totalResults: searchResults.length,
      query: name,
      products: searchResults,
    });
  })
);

// GET /api/products/stats - Get product statistics (e.g., count by category)
app.get(
  "/api/products/stats",
  asyncHandler(async (req, res, next) => {
    if (products.length === 0) {
      return next(new NotFoundError("No products available for statistics."));
    }
    const categoryCounts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    // Other stats (total count, in-stock count, etc.)
    const totalProducts = products.length;
    const inStockCount = products.filter((p) => p.inStock).length;
    const outOfStockCount = totalProducts - inStockCount;

    res.json({
      totalProducts,
      inStockCount,
      outOfStockCount,
      categories: categoryCounts,
    });
  })
);


// GET /api/products/:id - Get a specific product
app.get(
  "/api/products/:id",
  asyncHandler(async (req, res, next) => {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
      return next(new NotFoundError("Product not found"));
    }
    res.json(product);
  })
);


// POST /api/products - Create a new product
app.post(
  "/api/products",
  authenticate,
  validateProduct,
  asyncHandler(async (req, res) => {
    const { name, description, price, category, inStock } = req.body;

    const newProduct = {
      id: uuidv4(), // Generate a unique ID
      name,
      description,
      price,
      category,
      inStock,
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  })
);

// PUT /api/products/:id - Update a product
app.put(
  "/api/products/:id",
  authenticate,
  validateProduct,
  asyncHandler(async (req, res) => {
    const productIndex = products.findIndex((p) => p.id === req.params.id);
    if (productIndex === -1) {
      return next(new NotFoundError("Product not found"));
    }
    Object.assign(products[productIndex], req.body);
    res.json(products[productIndex]);
  })
);

// DELETE /api/products/:id - Delete a product
app.delete(
  "/api/products/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const productIndex = products.findIndex((p) => p.id === req.params.id);
    if (productIndex === -1) {
      return next(new NotFoundError("Product not found"));
    }
    products.splice(productIndex, 1);
    res.json({ message: "Product deleted successfully!" });
  })
);

// Task 4: Error Handling

// -Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(err.status || 500).json({
    error: {
      type: err.constructor.name,
      message: err.message || "Internal Server Error",
    },
  });
};
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
