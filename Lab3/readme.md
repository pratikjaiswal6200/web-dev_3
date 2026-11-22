# Inventory Management System

## Setup

1. Install Node.js and MongoDB.
2. Install dependencies with `npm ci`.
3. Copy `.env.example` to `.env` and set `MONGO_URI` to your MongoDB connection string.
4. Start the API with `npm start`.

The API listens on port `5000` by default. Set `PORT` in `.env` to use a different port.

## Product API

All product routes use the `/api/products` prefix:

- `POST /` creates a product.
- `GET /` lists products. Optional query parameters: `search`, `category`, `sort` (`price_asc` or `price_desc`), `page`, and `limit`.
- `GET /:id` retrieves a product.
- `PUT /:id` updates a product.
- `DELETE /:id` deletes a product.
