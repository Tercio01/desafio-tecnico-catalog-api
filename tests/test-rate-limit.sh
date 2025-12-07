#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Rate Limiting Test ===${NC}"
echo "Making 55 rapid requests to http://localhost:3000/api/products"
echo ""

blocked_count=0
success_count=0

for i in {1..55}; do
  response=$(curl -s -w "\n%{http_code}" http://localhost:3000/api/products)
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$http_code" = "200" ]; then
    success_count=$((success_count + 1))
    # Extract RateLimit-Remaining if available
    remaining=$(echo "$response" | grep -o '"RateLimit-Remaining": [0-9]*' | head -1)
    echo -e "${GREEN}✓${NC} Request $i: HTTP 200 $remaining"
  elif [ "$http_code" = "429" ]; then
    blocked_count=$((blocked_count + 1))
    echo -e "${RED}✗${NC} Request $i: HTTP 429 (RATE LIMITED!) $body"
  else
    echo -e "${YELLOW}?${NC} Request $i: HTTP $http_code"
  fi
done

echo ""
echo "=== Summary ==="
echo -e "${GREEN}Successful requests (HTTP 200): $success_count${NC}"
echo -e "${RED}Blocked requests (HTTP 429): $blocked_count${NC}"

if [ $blocked_count -gt 0 ]; then
  echo -e "${GREEN}✓ Rate limiting is WORKING!${NC}"
else
  echo -e "${YELLOW}⚠ Rate limiting might not be working (no 429 responses)${NC}"
fi
