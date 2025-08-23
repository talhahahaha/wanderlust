# Wanderlust

Wanderlust is a full-stack Node.js web application for listing, viewing, and reviewing travel accommodations. It uses Express, MongoDB (via Mongoose), EJS templating (with ejs-mate layouts), and Bootstrap for styling. The project features modular routing, robust validation, and a clean, responsive UI.

## Features

- List all travel accommodations (listings)
- Add, edit, and delete listings
- View details for each listing
- Leave reviews (with rating and comment) for each listing
- Delete reviews (with cascade delete on listing removal)
- Modular route structure for listings and reviews
- Server-side validation with Joi for all forms
- Flash messages for user feedback (success/error)
- Custom error handling and error pages (404, validation, etc.)
- Responsive UI with Bootstrap 5
- EJS layouts with ejs-mate
- Bootstrap client-side validation for forms

## Tech Stack

- **Backend:** Node.js, Express (modular routers), Mongoose, MongoDB
- **Frontend:** EJS (with ejs-mate layouts), Bootstrap 5, custom CSS, vanilla JS
- **Validation:** Joi (server-side), Bootstrap (client-side)
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
│   ├── listing.js        # Mongoose Listing model (with reviews as ObjectId refs)
│   └── review.js         # Mongoose Review model
│
├── routes/
│   ├── listing.js        # Listing routes (CRUD, show, populate reviews)
│   └── review.js         # Review routes (create, delete, mergeParams)
│
├── views/
│   ├── error.ejs
│   ├── includes/
│   │   ├── footer.ejs
│   │   ├── navbar.ejs
│   │   └── flash.ejs      # Flash message partial
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
│       └── script.js      # Bootstrap client-side validation
│
├── utils/
│   ├── ExpressError.js   # Custom error class
│   └── wrapAsync.js      # Async error wrapper for routes
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
- **/listings/:id/reviews:** POST to add a review (handled by modular review router)
- **/listings/:id/reviews/:reviewId:** DELETE to remove a review (handled by modular review router)

## Validation & Error Handling

- All forms are validated server-side with Joi (see `schema.js`).
- Bootstrap client-side validation for instant feedback.
- Flash messages for success/error feedback (see `views/includes/flash.ejs`).
- Custom error pages for 404 and other errors (see `views/error.ejs`).

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---


**Recent Updates:**
- Modularized review routes (`routes/review.js`) with `mergeParams` for nested routing.
- Flash messages for all CRUD actions (success/error).
- Bootstrap 5 client-side validation for all forms.
- Improved error handling and custom error page.
- EJS layouts and partials for DRY, maintainable views.
- Updated README.md to reflect all new features and structure.

---

**Recent Update 2:**
- Added direct `/signup` route support for user registration (now accessible at both `/signup` and `/users/signup`).
- Created `views/users/signup.ejs` for user signup page.
- Improved user route modularity and clarity in `routes/user.js`.
- README.md updated with new usage and routing details.
