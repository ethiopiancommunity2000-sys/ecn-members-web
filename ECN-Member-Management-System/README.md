# ECN Member Management System

A full-stack web application for managing Ethiopian Community Network (ECN) members, built with ASP.NET Core (C#) backend and React (TypeScript) frontend.

## 🚀 Features

- **Member Management**: Complete CRUD operations for member records
- **Authentication & Authorization**: JWT-based authentication with admin-only access
- **Payment Tracking**: Record and manage member payments with receipts
- **Incident Management**: Track community events and incidents
- **Family Members**: Manage family member relationships
- **Address Management**: Store multiple addresses per member
- **File Uploads**: Upload and manage payment receipts and documents
- **Responsive UI**: Modern, responsive design with Material-UI components

## 🛠️ Tech Stack

### Backend
- **.NET 9.0** - ASP.NET Core Web API
- **Entity Framework Core** - ORM for database operations
- **MediatR** - CQRS pattern implementation
- **FluentValidation** - Input validation
- **AutoMapper** - Object-to-object mapping
- **JWT Authentication** - Secure API endpoints
- **SQL Server** - Database

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Material-UI (MUI)** - Component library
- **MobX** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool

## 📁 Project Structure

```
CSharpReactProject/
├── API/                    # ASP.NET Core Web API
│   ├── Controllers/        # API endpoints
│   └── Program.cs          # Application entry point
├── Application/             # Application layer (CQRS, DTOs, Validators)
│   ├── Dtos/               # Data Transfer Objects
│   ├── MediatR/            # Commands and Queries
│   └── Core/               # Core utilities (Mapping, Results)
├── Domain/                 # Domain entities
├── Persistence/            # Data access layer
│   ├── AppDbContext.cs     # EF Core DbContext
│   └── Migrations/         # Database migrations
├── clinet-app/             # React frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/   # Feature modules
│   │   │   ├── stores/     # MobX stores
│   │   │   └── lib/        # API client and types
│   │   └── main.tsx        # React entry point
│   └── package.json
└── README.md
```

## 🏃 Getting Started

### Prerequisites
- .NET 9.0 SDK
- Node.js 18+ and npm
- SQL Server (or SQL Server Express)
- Visual Studio 2022 or VS Code

### Backend Setup

1. Navigate to the project root:
```bash
cd CSharpReactProject
```

2. Update the connection string in `API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "ECNMembersConnection": "Your SQL Server connection string"
  },
  "TokenKey": "Your secret key for JWT (at least 32 characters)"
}
```

3. Run database migrations:
```bash
cd API
dotnet ef database update --project ../Persistence
```

4. Run the API:
```bash
dotnet run
```

The API will be available at `https://localhost:5000` or `http://localhost:5000`

### Frontend Setup

1. Navigate to the client app:
```bash
cd clinet-app
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (if not exists):
```env
VITE_API_URL=https://localhost:5000/api
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` or `http://localhost:5173`

## 🔐 Authentication

- Only admin members can log in
- Admin members are created with `isAdmin: true` flag
- Username format: `firstName_lastName` (automatically generated)
- JWT tokens are stored in localStorage

## 📝 API Endpoints

### Members
- `GET /api/members` - Get all members (requires auth)
- `GET /api/members/{id}` - Get member details (requires auth)
- `POST /api/members` - Create new member
- `PUT /api/members/{id}` - Update member (requires auth)
- `DELETE /api/members/{id}` - Delete member (requires auth)

### Account
- `POST /api/account/login` - User login
- `GET /api/account/current` - Get current user

### Files
- `POST /api/members/{id}/files` - Upload files
- `GET /api/members/files/{memberId}` - Get member files
- `GET /api/members/file/{fileId}` - Get file by ID

## 🗄️ Database Schema

The system manages the following entities:
- **Member** - Main member entity
- **Address** - Member addresses
- **FamilyMember** - Family relationships
- **Payment** - Payment records
- **Incident** - Community events/incidents
- **MemberFile** - Uploaded files/receipts

## 🧪 Development

### Running Tests
```bash
# Backend tests (if available)
dotnet test

# Frontend tests (if available)
npm test
```

### Building for Production
```bash
# Backend
dotnet publish -c Release

# Frontend
cd clinet-app
npm run build
```

## 📄 License

This project is proprietary software for the Ethiopian Community Network.

## 👥 Contributing

This is a private project. For contributions or issues, please contact the project maintainer.

## 📞 Support

For support, please contact the ECN administration team.

---

**Note**: Make sure to configure your connection strings and JWT secret key before running the application in production.

