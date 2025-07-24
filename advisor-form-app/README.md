# Advisor Form Application

A full-stack web application for collecting advisor information through a tabbed form interface. The application features a React frontend with Bootstrap styling and a Node.js backend that saves form data to Excel files.

## Features

- **Tabbed Form Interface**: Three-tab form for collecting advisor information
  - Tab 1: Personal Details (First Name, Last Name, Email, Phone)
  - Tab 2: Address (Street Address, City, State, ZIP Code)
  - Tab 3: Professional Details (Advisor ID, Department, Start Date, Active Status)

- **Form Validation**: Client-side validation with real-time error feedback
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Excel Export**: Automatically saves submitted data to Excel files
- **Modern UI**: Clean, professional interface using Bootstrap

## Project Structure

```
advisor-form-app/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── AdvisorForm.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.tsx
│   ├── package.json
│   └── public/
├── backend/                  # Node.js Express backend
│   ├── server.js
│   └── package.json
├── data/                     # Excel files storage
│   └── advisor_data.xlsx     # Generated automatically
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation & Setup

### Option 1: Quick Start (Recommended)

**For Linux/macOS:**
```bash
# Navigate to the project directory
cd advisor-form-app

# Run the startup script
./start-dev.sh
```

**For Windows:**
```batch
# Navigate to the project directory
cd advisor-form-app

# Run the startup script
start-dev.bat
```

The scripts will automatically:
- Check for Node.js and npm
- Install dependencies for both frontend and backend
- Start both servers
- Display the application URLs

### Option 2: Manual Setup

### 1. Clone or Download the Project

```bash
# Navigate to the project directory
cd advisor-form-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window/tab and run:

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## Usage

1. **Access the Application**: Open your browser and go to `http://localhost:3000`

2. **Fill Out the Form**: 
   - Complete the "Personal Details" tab and click "Next"
   - Complete the "Address" tab and click "Next"
   - Complete the "Professional Details" tab and click "Submit"

3. **Form Validation**: The form validates required fields and formats (email, ZIP code) before allowing progression to the next tab.

4. **Data Storage**: Upon successful submission, the data is saved to an Excel file in the `/data` directory.

## API Endpoints

### Backend API (`http://localhost:5000`)

- **POST** `/api/submit-advisor` - Submit advisor form data
- **GET** `/api/health` - Health check endpoint
- **GET** `/api/advisors` - Retrieve all submitted advisor data (optional)

### Request/Response Example

**POST /api/submit-advisor**

Request Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phone": "555-123-4567",
  "streetAddress": "123 Main St",
  "city": "Anytown",
  "state": "CA",
  "zipCode": "12345",
  "advisorId": "ADV001",
  "department": "Sales",
  "startDate": "2024-01-15",
  "active": true
}
```

Response:
```json
{
  "message": "Advisor data saved successfully",
  "submissionDate": "2024-01-15",
  "advisorId": "ADV001"
}
```

## Excel File Format

The generated Excel file (`/data/advisor_data.xlsx`) contains the following columns:

| Column | Description |
|--------|-------------|
| Submission Date | Date the form was submitted |
| First Name | Advisor's first name |
| Last Name | Advisor's last name |
| Email | Advisor's email address |
| Phone | Advisor's phone number |
| Street Address | Advisor's street address |
| City | Advisor's city |
| State | Advisor's state |
| ZIP Code | Advisor's ZIP code |
| Advisor ID | Unique advisor identifier |
| Department | Advisor's department |
| Start Date | Advisor's start date |
| Active | Active status (Yes/No) |

## Technologies Used

### Frontend
- **React 18** with TypeScript
- **React Bootstrap** for UI components
- **Bootstrap 5** for styling
- **Axios** for HTTP requests

### Backend
- **Node.js** with Express.js
- **XLSX** library for Excel file manipulation
- **CORS** for cross-origin requests
- **Body-parser** for JSON parsing

## Development Scripts

### Frontend
```bash
npm start          # Start development server
npm test           # Run tests
npm run build      # Build for production
npm run eject      # Eject from Create React App
```

### Backend
```bash
npm start          # Start server
npm run dev        # Start with nodemon (auto-restart)
```

## Customization

### Adding New Form Fields

1. **Update the FormData interface** in `frontend/src/components/AdvisorForm.tsx`
2. **Add the new field to the form state** initialization
3. **Add form input** to the appropriate tab
4. **Update validation logic** if needed
5. **Update the backend** to handle the new field
6. **Update Excel headers** in `backend/server.js`

### Styling Modifications

- Modify `frontend/src/App.css` for global styles
- Update Bootstrap classes in the React components
- Customize the gradient background in `.App` class

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend is running on port 5000 and frontend on port 3000
2. **Excel File Permissions**: Make sure the `/data` directory is writable
3. **Port Conflicts**: Change ports in the respective configuration files if needed

### Backend Not Starting
- Check if port 5000 is available
- Ensure all dependencies are installed (`npm install`)
- Check console for error messages

### Frontend Not Loading
- Ensure React development server is running (`npm start`)
- Check if port 3000 is available
- Clear browser cache and try again

## Production Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy the 'build' folder to your web server
```

### Backend
```bash
cd backend
# Set NODE_ENV=production
# Use PM2 or similar process manager for production
pm2 start server.js --name advisor-form-api
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions, please check the troubleshooting section above or create an issue in the project repository.

---

**Note**: This application is designed for development and testing purposes. For production use, consider adding authentication, input sanitization, database storage, and other security measures.