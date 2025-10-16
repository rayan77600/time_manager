# Time Manager Frontend

## Getting Started

This is a clean React + TypeScript + Material-UI setup ready for implementing your Figma designs.

### Project Structure

```
src/
  ├── main.tsx          # App entry point with MUI theme setup
  ├── App.tsx           # Main app component (start here)
  ├── App.css           # Custom styles
  ├── index.css         # Global styles
  ├── assets/           # Images, icons, etc.
  ├── types/            # TypeScript type definitions
  └── [create folders as needed for your Figma implementation]
```

### Recommended Folder Structure for Figma Implementation

```
src/
  ├── components/       # Reusable UI components from Figma
  │   ├── common/       # Buttons, inputs, cards, etc.
  │   └── layout/       # Header, footer, navigation
  ├── pages/            # Page-level components
  ├── hooks/            # Custom React hooks
  ├── services/         # API calls
  ├── theme/            # MUI theme customization based on Figma
  └── utils/            # Helper functions
```

### Implementing Your Figma Design

1. **Define your theme** in `src/theme/index.ts`:

   ```ts
   import { createTheme } from '@mui/material'

   export const theme = createTheme({
     palette: {
       primary: {
         main: '#YOUR_PRIMARY_COLOR',
       },
       // ... add your Figma color palette
     },
     typography: {
       // ... add your Figma typography
     },
     // ... other theme customizations
   })
   ```

2. **Update** `src/main.tsx` to use your custom theme

3. **Build components** matching your Figma components

4. **Create pages** and wire up routing as needed

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Run linter
- `yarn format` - Format code with Prettier

### Dependencies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Material-UI v7** - Component library
- **Vite** - Build tool
- **React Router** - Navigation (already in package.json)
- **Axios** - HTTP client (already in package.json)

### Next Steps

1. Design your MUI theme based on Figma color palette, typography, and spacing
2. Create base components (buttons, inputs, cards, etc.)
3. Build layout components (header, navigation, footer)
4. Implement pages
5. Connect to backend API
