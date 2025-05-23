# Environment Setup

## Configuration Files

The application uses environment-specific configuration files that are excluded from git for security reasons. To set up your environment:

1. Copy the template file:
   ```bash
   cp src/environments/environment.template.ts src/environments/environment.ts
   cp src/environments/environment.template.ts src/environments/environment.development.ts
   ```

2. Update the environment files with your specific configuration:
   - `environment.ts` - Production settings
   - `environment.development.ts` - Development settings

3. Required environment variables:
   - `backend`: Your backend API URL
   - `monitorApi`: Your monitoring API URL
   - `useDatabase`: Set to true for production, false for development

Note: Never commit the actual environment files to git. Only the template file (`environment.template.ts`) should be committed.

### Installation
* `npm install` (installing dependencies)
* `npm outdated` (verifying dependencies)

### Developpement
* `npm run start`
* in your browser [http://localhost:4200](http://localhost:4200) 

## Linter
* `npm run lint`

## Tests
* `npm run test`
* `npm run coverage`

### Compilation
* `npm run build`       

### Production
* `npm run serve`
* in your browser [http://localhost:4000](http://localhost:4000) 


### Author
* Author  : danny
