# BookNest MongoDB schema

Database: `libraryDB`

## Collections

### users
- `name`: string
- `email`: unique, normalized string
- `passwordHash`: bcrypt password hash (never returned by API)
- `role`: `user` or `admin`
- `studentProfile`: reference to the matching `students` document

### students
- `userId`: optional reference to a login account
- `studentCode`: generated unique ID
- `name`, `email`, `phone`, `course`, `year`
- `enrollmentStatus`: `Active`, `Completed`, or `On hold`

During sign-up, BookNest creates a `users` document and a linked `students` document. During login, it checks the stored password hash and fetches the already existing profile. Login does not insert a second student.

### books
- `title`, `author`, `category`, `isbn`
- `price`, `totalCopies`, `availableCopies`
- `description`

## Example MongoDB filters used by the book search API

- `$gt`: `price: { $gt: 300 }` when `minPrice=300` is supplied.
- `$lt`: `price: { $lt: 800 }` when `maxPrice=800` is supplied.
- `$in`: `category: { $in: ['Fiction', 'Technology'] }` when multiple categories are supplied.
- `$and`: combines active search filters.
- `$or`: matches title, author or category in the text search.
- `$exists`: checks whether ISBN is present when `hasIsbn=true` is supplied.

Example API: `GET /api/books?search=habits&minPrice=100&maxPrice=700&available=true`
