#!/bin/bash
set -e

echo "🚀 Deploying BitFlow Finance to MAINNET..."
echo ""
echo "⚠️  WARNING: This will deploy to MAINNET!"
echo "⚠️  This action is IRREVERSIBLE!"
echo ""
read -p "Are you sure you want to deploy to MAINNET? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
read -p "Type 'DEPLOY TO MAINNET' to confirm: " final_confirm

if [ "$final_confirm" != "DEPLOY TO MAINNET" ]; then
    echo "❌ Deployment cancelled - confirmation text did not match"
    exit 1
fi

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

# Run security audit (if available)
echo "🔒 Running security checks..."
# Add security audit tools here

# Generate deployment plan
echo "📝 Generating deployment plan..."
clarinet deployments generate --mainnet

# Show deployment plan
echo ""
echo "📋 Deployment Plan:"
cat deployments/default.mainnet-plan.yaml

echo ""
read -p "Proceed with deployment? (yes/no): " deploy_confirm

if [ "$deploy_confirm" != "yes" ]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Deploy
echo "🚀 Deploying to MAINNET..."
clarinet deployments apply --mainnet

echo ""
echo "✅ MAINNET Deployment complete!"
echo ""
echo "⚠️  IMPORTANT - Next steps:"
echo "1. Save the contract address immediately"
echo "2. Update frontend/.env with MAINNET contract address"
echo "3. Test all contract functions on MAINNET"
echo "4. Monitor contract activity closely"
echo "5. Announce deployment to users"
