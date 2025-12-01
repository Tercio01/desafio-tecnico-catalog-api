# Guia de Deployment - Catalog API na AWS

## Pré-requisitos
- AWS Account
- AWS CLI configurado
- Docker instalado
- ECR (Elastic Container Registry) configurado

## Etapas

### 1. Build da imagem Docker

docker build -t catalog-api:latest .

text

### 2. Login no ECR

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

text

### 3. Tag e Push

docker tag catalog-api:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/catalog-api:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/catalog-api:latest

text

### 4. Deploy com ECS/Fargate
- Use CloudFormation ou Terraform
- Configure RDS para MongoDB Atlas ou DocumentDB
- Configure ALB (Application Load Balancer)

## Variáveis de Ambiente (AWS)
- `PORT=3001`
- `MONGODB_URI=<RDS_CONNECTION_STRING>`
- `NODE_ENV=production`

## Monitoramento
- CloudWatch Logs
- X-Ray Tracing
- CloudWatch Metrics

