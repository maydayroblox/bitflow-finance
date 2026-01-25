#!/bin/bash
set -e

echo "🚀 Deploying BitFlow Finance to Testnet..."

# Check if clarinet is installed
if ! command -v clarinet &> /dev/null; then
    echo "❌ Clarinet not found. Install from: https://github.com/hirosystems/clarinet"
    exit 1
fi

# Run checks
echo "📋 Running contract checks..."
clarinet check

# Run tests
echo "🧪 Running tests..."
clarinet test

# Generate deployment plan
echo "📝 Generating deployment plan..."
clarinet deployments generate --testnet

# Deploy
echo "🚀 Deploying to testnet..."
clarinet deployments apply --testnet

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Update frontend/.env with contract address"
echo "2. Test the deployment on testnet"
echo "3. Monitor contract interactions"
