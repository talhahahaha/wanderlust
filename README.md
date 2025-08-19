# Wanderlust

Wanderlust is a full-stack Node.js web application for listing, viewing, and reviewing travel accommodations. It uses Express, MongoDB (via Mongoose), EJS templating, and Bootstrap for styling.

## Features

- List all travel accommodations (listings)
- Add, edit, and delete listings
- View details for each listing
- Leave reviews (with rating and comment) for each listing
- Delete reviews
- Server-side validation with Joi
- Error handling and custom error pages
- Responsive UI with Bootstrap

## Tech Stack

- **Backend:** Node.js, Express, Mongoose, MongoDB
- **Frontend:** EJS, Bootstrap, custom CSS
- **Validation:** Joi
- **Templating:** ejs-mate

## Project Structure

```
MAJORPROJECT/
│
├── app.js                # Main Express app
├── package.json
├── schema.js             # Joi validation schemas
│
├── models/
│   ├── listing.js        # Mongoose Listing model
│   └── review.js         # Mongoose Review model
│
├── routes/
│   ├── listing.js        # Listing routes (CRUD)
│   └── review.js         # Review routes (create, delete)
│
├── views/
│   ├── error.ejs
│   ├── includes/
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   ├── layouts/
│   │   └── boilerplate.ejs
│   └── listings/
│       ├── edit.ejs
│       ├── index.ejs
│       ├── new.ejs
│       └── show.ejs
│
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── utils/
│   ├── ExpressError.js   # Custom error class
│   └── wrapAsync.js      # Async error wrapper
│
├── init/
│   ├── data.js           # Sample data for seeding
│   └── index.js          # DB seeding script
```

## Setup Instructions

1. **Clone the repository**
   ```sh
   git clone <repo-url>
   cd MAJORPROJECT
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up MongoDB**
   - Make sure MongoDB is running locally on `mongodb://127.0.0.1:27017/wanderlust`
   - (Optional) Seed the database with sample data:
     ```sh
     node init/index.js
     ```

4. **Run the app**
   ```sh
   node app.js
   ```
   or for development:
   ```sh
   npx nodemon app.js
   ```

5. **Visit in your browser**
   ```
   http://localhost:3000/
   ```

## Usage

- **Home:** Welcome page
- **/listings:** View all listings
- **/listings/new:** Add a new listing
- **/listings/:id:** View a single listing, leave a review, or delete reviews
- **/listings/:id/edit:** Edit a listing

## Validation & Error Handling

- All forms are validated server-side with Joi.
- Custom error pages for 404 and other errors.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
