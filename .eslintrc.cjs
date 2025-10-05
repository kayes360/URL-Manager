module.exports = {
  // Sets the configuration file as the root
  root: true,
  
  // Defines environment globals
  env: { browser: true, es2020: true },
  
  // *** TypeScript-Specific Configuration ***
  // Use the TypeScript parser for all files
  parser: '@typescript-eslint/parser',
  
  // Configuration for the parser, pointing it to your TS configuration files
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // This setting enables rules that require type information
    project: ['./tsconfig.json', './tsconfig.node.json'],
  },
  
  // Extend standard JS rules plus TypeScript and React rules
  extends: [
    'eslint:recommended',
    
    // Add recommended TypeScript rules
    'plugin:@typescript-eslint/recommended', 
    
    // Add React rules
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  
  // Ignore patterns remain the same
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  
  // Add the TypeScript plugin
  plugins: ['react-refresh', '@typescript-eslint'],
  
  settings: { 
    react: { version: '18.2' },
    // Recommended setting to help ESLint resolve imports in TS files
    'import/resolver': {
      typescript: {}
    }
  },
  
  // Custom Rules
  rules: {
    // Disable the base rule, as it clashes with TypeScript's type checking
    'no-unused-vars': 'off',
    
    // Use the TypeScript-specific version of the rule
    '@typescript-eslint/no-unused-vars': 'warn',

    // Prop types are now handled by TypeScript interfaces, so this is safe to disable
    'react/prop-types': 'off', 
    
    // Keep your existing React-refresh rule
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  
  // Overrides to handle non-TypeScript files (like this .cjs file itself)
  overrides: [
    {
      files: ['*.js', '*.cjs'],
      // Use the standard JS parser for these files
      parser: 'espree',
      parserOptions: {
        // Remove the project setting for non-TS files to avoid errors
        project: null,
      },
      // Disable TS-only rules that would cause issues in JS files
      rules: {
        '@typescript-eslint/no-var-requires': 'off', // Allows require() in CJS files
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
};