
# ClearPath Backend API Documentation

Welcome to the backend API for **ClearPath** — a map-based web app that helps wheelchair users find and rate accessible public locations.

This documentation lists all available endpoints with descriptions, expected inputs, and example `fetch()` usage.

---

## Endpoints Overview

| Method | URL                                               |Description                                                  |
|--------|---------------------------------------------------|-------------------------------------------------------------|
| POST   | `/signup`                                         | Registers a new user                                        |
| POST   | `/login`                                          | Authenticates user credentials                              |
| POST   | `/forgot-password`                                | Sends a password reset link to the user's email             |
| POST   | `/reset-password`                                 | Updates password using a reset token                        |
| GET    | `/profile`                                        | Retrieves logged-in user's information                      |
| PATCH  | `/edit-user`                                      | Updates user profile, including avatar                      |
| POST   | `/locations`                                      | Submits a new accessible location                           |
| GET    | `/locations`                                      | Retrieves all accessible locations                          |
| GET    | `/my-submissions`                                 | Retrieves locations submitted by the current user           |
| POST   | `/locations/:locationId/toggle-favorite`          | Adds/removes location from user's favorites                 |
| GET    | `/my-favorites`                                   | Returns the user's favorited locations                      |
| POST   | `/locations/:locationId/reviews`                  | Adds a review to a specific location                        |
| GET    | `/locations/:id/reviews`                          | Gets all reviews for a location                             |
| GET    | `/my-reviews`                                     | Retrieves reviews created by the current user               |
| POST   | `/reviews/:id/toggle-like`                        | Likes or unlikes a review                                   |
| PATCH  | `/reviews/:id`                                    | Edits a review                                              |
| DELETE | `/reviews/:id`                                    | Deletes a review                                            |
| POST   | `/reviews/:reviewId/replies`                      | Adds a reply to a review                                    |
| PATCH  | `/reviews/:reviewId/replies/:replyId`             | Edits a reply to a review                                   |
| DELETE | `/reviews/:reviewId/replies/:replyId`             | Deletes a reply to a review                                 |
| POST   | `/reviews/:reviewId/replies/:replyId/like`        | Likes or unlikes a reply                                    |

---

## Response Format

### Success
```json
{
  "status": 200,
  "message": "Operation successful",
  "data": { /* optional */ }
}
```

### Error
```json
{
  "status": 400,
  "message": "Error message"
}
```

---

## Authentication Endpoints

### POST `/signup`

Registers a new user.

**Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secure123"
}
```

**Fetch Example:**
```js
fetch("/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "johndoe",
    email: "john@example.com",
    password: "secure123"
  }),
});
```

---

### POST `/login`

Logs a user in.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "secure123"
}
```

**Fetch Example:**
```js
fetch("/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@example.com",
    password: "secure123"
  }),
});
```

---

### POST `/forgot-password`

Sends a password reset link.

**Body:**
```json
{
  "email": "john@example.com"
}
```

---

### POST `/reset-password`

Resets password using token.

**Body:**
```json
{
  "token": "reset-token",
  "newPassword": "newPass123"
}
```

---

## User Endpoints

### GET `/profile`

Returns current user's profile.

---

### PATCH `/edit-user`

Updates profile info or avatar.

**Form Data Example:**
- `username`: string (optional)
- `email`: string (optional)
- `avatar`: file (optional)

**Fetch Example:**
```js
  const formData = new FormData();
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName?.trim() || "");
      formData.append("username", username.trim());
      formData.append("about", about?.trim() || "");

      if (fileInputRef.current.files[0]) {
        formData.append("profilePic", fileInputRef.current.files[0]);
      }

      const res = await fetch("/edit-user", {
        method: "PATCH",
        credentials: "include",
        body: formData,

      });
```

---

## Location Endpoints

### POST `/locations`

Adds a new accessible location.

**Body:**
```json
{
  "name": "Accessible Café",
  "address": "123 Main St",
  "description": "Wheelchair-friendly coffee shop"
}
```

---

### GET `/locations`

Returns all accessible locations.

---

### GET `/my-submissions`

Returns the locations submitted by the current user.

---

### POST `/locations/:locationId/toggle-favorite`

Favorites/unfavorites a location.

---

### GET `/my-favorites`

Returns user's favorited locations.

---

## Review Endpoints

### POST `/locations/:locationId/reviews`

Adds a review to a location.

**Body:**
```json
{
  "rating": 5,
  "text": "Great wheelchair access and clean bathroom!"
}
```

---

### GET `/locations/:id/reviews`

Gets reviews for a location.

---

### GET `/my-reviews`

Returns the current user's reviews.

---

### PATCH `/reviews/:id`

Edits a review.

**Body:**
```json
{
  "rating": 4,
  "text": "Updated review text."
}
```

---

### DELETE `/reviews/:id`

Deletes a review.

---

### POST `/reviews/:id/toggle-like`

Likes or unlikes a review.

---

## Reply Endpoints

### POST `/reviews/:reviewId/replies`

Adds a reply to a review.

**Body:**
```json
{
  "text": "Thanks for the feedback!"
}
```

---

### PATCH `/reviews/:reviewId/replies/:replyId`

Edits a reply.

**Body:**
```json
{
  "text": "Updated reply content"
}
```

---

### DELETE `/reviews/:reviewId/replies/:replyId`

Deletes a reply.

---

### POST `/reviews/:reviewId/replies/:replyId/like`

Likes or unlikes a reply.

---

## Server Info

- **Port:** `5000`
- **Uploads Dir:** `/uploads`
- **Middleware:**  
  - `express.json()`  
  - `express.urlencoded()`  
  - `cookie-parser`  
  - static files via `express.static`

---