## SME HealthCheck

▲ Next.js 13.5.4
Nest.js 20.11.1

## Getting Started

First, Install the dependencies:
CD in both Nest and Next repository one by one and run

```bash
npm install --legacy-peer-deps

```

Second, add env variables:
In next.js -
create .env or .env.local file-
add variable

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

In nest.js -
create .env file-
add variable

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your password
DB_NAME=company_application
PORT=3000
UPLOAD_PATH=./uploads
```

Third, then run Nest.js:

```bash
npm run start:dev

```

Fourth, then run Next.js:

```bash
npm run dev

```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

API URL Backend server URL: http://localhost:300

## supported URLs

http://localhost:3001/list
http://localhost:3001/

Used library

- React-hook-form
- Zod
- MUI
