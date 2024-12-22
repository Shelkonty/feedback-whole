# Feedback Management System

A full-stack application for managing user feedback and suggestions with voting capabilities.

## Features

- 👤 User Authentication (Register/Login)
- 📝 Create, Read, Update, Delete Feedback
- 🗳️ Vote System
- 🏷️ Categories and Status Management
- 🔍 Search and Filter Functionality
- 📱 Responsive Design
- 🎨 Modern UI with Tailwind CSS

## Technology Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- TypeScript
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React
- TypeScript
- Tailwind CSS
- Axios
- React Router
- Radix UI Components
- Lucide Icons

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Docker (optional)
- npm or yarn

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.tsx
│   └── package.json
└── docker-compose.yml
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/feedback_db"
JWT_SECRET="your-secret-key"
PORT=3000
```

### Frontend (.env)
```env
VITE_API_URL="http://localhost:3000/api"
```

## Installation & Setup

### Without Docker

1. Clone the repository
```bash
git clone [repository-url]
cd feedback-system
```

2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### With Docker

1. Build and run using docker-compose
```bash
docker-compose up --build
```

This will set up:
- PostgreSQL database on port 5432
- Backend service on port 3000
- Frontend service on port 5173

### Docker Individual Services

Backend:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ../OneDrive/Рабочий%20стол .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

Frontend:
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
```

Docker Compose:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: feedback_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/feedback_db
      JWT_SECRET: your-secret-key
      PORT: 3000

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## API Testing

You can test the backend API using Postman or curl commands:

### Authentication

1. Register a new user:
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

2. Login:
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Feedback Operations

1. Create feedback (requires authentication):
```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Feedback","description":"This is a test","categoryId":"1","statusId":"1"}'
```

2. Get all feedback:
```bash
curl http://localhost:3000/api/feedback
```

3. Vote on feedback (requires authentication):
```bash
curl -X POST http://localhost:3000/api/feedback/1/vote \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Setup

1. Create the database:
```bash
createdb feedback_db
```

2. Run migrations:
```bash
npx prisma migrate dev
```

3. Seed the database:
```bash
npx prisma db seed
```

## Common Issues & Troubleshooting

1. Database Connection Issues:
   - Check if PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Ensure correct permissions

2. Authentication Issues:
   - Check JWT_SECRET in .env
   - Verify token expiration
   - Check token format in requests

3. CORS Issues:
   - Verify frontend URL in backend CORS configuration
   - Check request headers

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

### Linting
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Production Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Build the backend:
```bash
cd backend
npm run build
```

3. Start production servers:
```bash
# Backend
cd backend
npm start

# Frontend (using a static file server)
cd frontend
npm run serve
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.