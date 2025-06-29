# DV01 Frontend Challenge - Loan Data Visualization Dashboard

A React/Redux application that visualizes loan data through interactive tables and charts with advanced filtering capabilities.

## 📊 Features

- **Data Visualization**: Interactive bar chart showing loan balances aggregated by grade
- **Dynamic Filtering**: Filter data by home ownership, quarter, term, and year
- **Data Table**: Horizontal table displaying aggregated loan balances by grade
- **Real-time Updates**: Filters apply to both chart and table simultaneously
- **Responsive Design**: Material-UI components with modern, clean interface
- **Data Processing**: CSV parsing, normalization, and transformation pipeline
- **State Management**: Redux for centralized state management
- **Comprehensive Testing**: Unit tests for all major components and utilities

## 🏗️ Project Structure

```
src/
├── components/
│   ├── DataLoader.tsx          # Loading state component
│   ├── FilterPanel.tsx         # Extracted filter controls
│   ├── LoanDataTable.tsx       # Main data table and chart component
│   └── ReduxProvider.tsx       # Redux store provider wrapper
├── request/
│   ├── api.ts                  # CSV data fetching and processing
│   └── api.test.ts             # API layer tests
├── store/
│   ├── dataSlice.ts            # Redux slice for loan data management
│   ├── hooks.ts                # Typed Redux hooks
│   └── store.ts                # Redux store configuration
├── utils/
│   ├── dataTransformer.ts      # Data normalization and transformation
│   └── dataTransformer.test.ts # Data transformation tests
├── App.tsx                     # Main application component
├── App.test.tsx                # App integration tests
└── index.tsx                   # Application entry point

public/
├── loansize.csv                # Source CSV data file
└── index.html                  # HTML template
```

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **UI Components**: Material-UI (MUI)
- **Charts**: Recharts
- **CSV Parsing**: PapaParse
- **Testing**: Jest + React Testing Library
- **Build Tool**: Create React App

## 📋 Data Pipeline

### 1. CSV Loading (`api.ts`)
- Fetches CSV data from multiple URL patterns with fallback strategies
- Handles network errors gracefully
- Supports both development and production environments

### 2. Data Normalization (`dataTransformer.ts`)
- **String Normalization**: Trims whitespace, converts to lowercase
- **Value Standardization**: Maps inconsistent values to standard formats
- **Special Character Removal**: Cleans data while preserving allowed characters

### 3. Data Transformation
- Converts CSV rows to strongly-typed `LoanData` objects
- Parses currency strings to numeric values
- Maps CSV column names to application properties

### 4. Data Aggregation
- Groups loan data by grade
- Calculates total balances per grade
- Applies real-time filtering

## 🎯 Key Components

### LoanDataTable.tsx
Main dashboard component featuring:
- **Interactive Bar Chart**: Recharts-powered visualization with tooltips
- **Grade Aggregation Table**: Horizontal layout showing totals by grade
- **Multi-Filter System**: Home ownership, quarter, term, and year filters
- **Real-time Updates**: Instant filtering of both chart and table data
- **Currency Formatting**: Proper USD formatting with locale support

### DataSlice (Redux)
Centralized state management:
```typescript
interface DataState {
  loanData: LoanData[];
  isLoading: boolean;
  error: string | null;
}
```

### Data Types
```typescript
interface LoanData {
  currentBalance: number;
  grade: string;
  homeOwnership: string;
  quarter: string;
  term: string;
  year: string;
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "dv01 Frontend Challenge 202103"
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   yarn start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🧪 Testing

### Run all tests
```bash
yarn test
```

### Run tests in watch mode
```bash
yarn test --watch
```

### Run specific test files
```bash
yarn test src/utils/dataTransformer.test.ts
yarn test src/request/api.test.ts
yarn test src/App.test.tsx
```

### Test Coverage
- **Data Transformation**: 100% coverage of normalization and transformation logic
- **API Layer**: Complete testing of CSV loading, parsing, and error scenarios
- **Integration**: App-level testing with mock Redux store

## 📊 Data Flow

```
CSV File → API Fetch → Parse → Normalize → Transform → Redux Store → UI Components
```

1. **CSV Loading**: Multiple URL strategies ensure reliable data access
2. **Parsing**: PapaParse converts CSV to JavaScript objects
3. **Normalization**: Data cleaning and standardization
4. **Transformation**: Type-safe conversion to application models
5. **State Management**: Redux manages application state
6. **UI Rendering**: React components display filtered and aggregated data

## 🎨 UI Features

### Filter Panel
- **Home Ownership**: Mortgage, Rent, Own
- **Quarter**: Q1, Q2, Q3, Q4
- **Term**: 36 months, 60 months
- **Year**: Dynamic list from data
- **Reset**: Clear all filters

### Bar Chart
- **Responsive Design**: Adapts to container size
- **Interactive Tooltips**: Hover for detailed information
- **Currency Formatting**: Y-axis shows millions format ($1.5M)
- **Real-time Updates**: Reflects current filter state

### Data Table
- **Grade Headers**: Dynamic columns based on available grades
- **Currency Display**: Formatted USD amounts
- **Summary Statistics**: Shows filtered vs total record counts

## 🔧 Configuration

### Environment Variables
- `PUBLIC_URL`: Base URL for static assets (auto-configured by CRA)

### CSV Data Format
Expected CSV structure:
```csv
v_year,v_quarter,grade_2,home_ownership,term,V1
2016,1,"1","MORTGAGE"," 36 months",15875.2950167058
```

## 🚨 Error Handling

- **Network Failures**: Multiple URL fallback strategies
- **Invalid Data**: Graceful handling of malformed CSV data
- **Parse Errors**: User-friendly error messages
- **Missing Data**: Default values and null checks

## 🔄 State Management

### Redux Actions
- `setLoading(boolean)`: Manage loading state
- `setLoanData(LoanData[])`: Store processed loan data
- `setError(string)`: Handle error states

### Selectors
- Access loan data: `state.data.loanData`
- Check loading state: `state.data.isLoading`
- Get errors: `state.data.error`

## 📈 Performance Considerations

- **Memoization**: React.useMemo for expensive calculations
- **Efficient Filtering**: Optimized data filtering algorithms
- **Component Splitting**: Separated concerns for better code organization
- **Bundle Optimization**: Tree-shaking and code splitting via CRA

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📝 License

This project is part of the DV01 Frontend Challenge.

---

**Built with ❤️ using React, TypeScript, and Material-UI**
