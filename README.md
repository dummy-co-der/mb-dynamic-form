# Dynamic Form Builder

A full-stack dynamic form builder application that allows you to create and manage forms dynamically based on JSON schemas. The application features a modern React frontend with a TypeScript Express backend, supporting various field types, validation, and a beautiful dark/light theme toggle.

## 🚀 Features

- **Dynamic Form Rendering**: Forms are generated dynamically from JSON schemas
- **Multiple Field Types**: Supports text, email, number, select, date, switch, and textarea fields
- **Client & Server-Side Validation**: Comprehensive validation on both frontend and backend
- **Form Submissions Management**: View and manage all form submissions with pagination
- **Dark/Light Theme**: Beautiful UI with theme toggle that persists user preference
- **Responsive Design**: Fully responsive design that works on all devices
- **Type-Safe**: Built with TypeScript for type safety across the stack

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Form** - Form state management
- **TanStack React Query** - Data fetching and caching
- **TanStack Table** - Table component for submissions
- **Tailwind CSS 4** - Styling with dark mode support
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **UUID** - Unique ID generation

## 📁 Project Structure

```
mb-dynamic-form/
├── frontend/
│   ├── src/
│   │   ├── api/           # API client and types
│   │   ├── pages/         # Page components
│   │   │   ├── form-page.tsx
│   │   │   └── submission-page.tsx
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── data/          # Data layer (schema, submissions, validation)
│   │   ├── routes/        # API routes
│   │   │   ├── form-schema.ts
│   │   │   └── submissions.ts
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dummy-co-der/mb-dynamic-form.git
   cd mb-dynamic-form
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:4000` by default.

#### Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port Vite assigns).

### Building for Production

#### Build Backend

```bash
cd backend
npm run build
npm start
```

#### Build Frontend

```bash
cd frontend
npm run build
npm run preview
```

## 📡 API Endpoints

### Form Schema

- **GET** `/api/form-schema` - Get the form schema definition

### Submissions

- **POST** `/api/submissions` - Submit a new form entry

  - Body: Form data matching the schema
  - Returns: `{ id: string, createdAt: string }`

- **GET** `/api/submissions` - Get paginated submissions
  - Query Parameters:
    - `page` (default: 1) - Page number
    - `limit` (default: 10) - Items per page
    - `sortDirection` (default: "desc") - Sort order ("asc" or "desc")
  - Returns: Paginated submissions with metadata

## 📝 Form Schema Structure

The form schema is defined in `backend/src/data/schema.data.ts`. Here's an example structure:

```typescript
{
  name: "form-name",
  title: "Form Title",
  description: "Form description",
  fields: [
    {
      name: "fieldName",
      label: "Field Label",
      type: "text" | "email" | "number" | "select" | "date" | "switch" | "textarea",
      placeholder: "Placeholder text",
      required: true | false,
      defaultValue: any,
      inputType: "email" | "password" | "tel", // For text fields
      options: [{ label: string, value: string }],
      validations: {
        minLength?: number,
        maxLength?: number,
        min?: number,
        max?: number,
        pattern?: string,
        message?: string,
        minSelected?: number
      }
    }
  ]
}
```

### Supported Field Types

- **text** - Text input with optional `inputType` (email, password, tel)
- **number** - Number input with min/max validation
- **select** - Single selection dropdown
- **date** - Date picker
- **switch** - Toggle switch (boolean)
- **textarea** - Multi-line text input

## 🎨 Features in Detail

### Dynamic Form Generation

Forms are automatically generated from the JSON schema, including:

- Field labels and placeholders
- Required field indicators
- Validation rules
- Default values
- Help text and error messages

### Validation

- **Client-side**: Real-time validation using TanStack Form
- **Server-side**: Validation before saving submissions
- **Error Display**: Field-level error messages with visual indicators

### Theme Toggle

- Persistent theme preference (stored in localStorage)
- Smooth transitions between light and dark modes
- System-aware with manual override

### Submissions View

- Paginated table view of all submissions
- Sortable by creation date
- Responsive table design
- Dark mode support

## 🧪 Development

### Backend Scripts

- `npm run dev` - Start development server with hot reload (nodemon)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build

### Frontend Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 Configuration

### Environment Variables

Backend:

- `PORT` - Server port (default: 4000)

### Tailwind Configuration

The project uses Tailwind CSS 4 with class-based dark mode. Configuration is in `frontend/tailwind.config.ts`.

## 📦 Dependencies

### Frontend Key Dependencies

- `@tanstack/react-form` - Form state management
- `@tanstack/react-query` - Server state management
- `@tanstack/react-table` - Table component
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - CSS framework

### Backend Key Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `morgan` - HTTP logger
- `uuid` - ID generation
