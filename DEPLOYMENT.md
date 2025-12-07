# Deployment Notes

## Node.js Version

This project is developed and tested with Node.js 18.19.1 and 22.x.

### Known Warnings

When running with Node.js 18.x, you may see `EBADENGINE` warnings for:
- mongodb@7.0.0
- mongoose@9.0.1

**These are non-critical warnings.** The application works perfectly.

### Recommended Setup

**Development (local):**

npm install
npm run dev

text

**Production (Docker - recommended):**

docker-compose up --build
Uses Node.js 22.x (no warnings)

text

## Health Check

curl http://localhost:3000/health

text

Expected response:

{
"success": true,
"status": "OK",
"rateLimitingStatus": "active"
}

text
