#!/bin/bash
# Script to set up branch protection for main branch
# Requires GitHub CLI (gh) to be installed and authenticated

set -e

REPO_OWNER=$(gh repo view --json owner -q .owner.login)
REPO_NAME=$(gh repo view --json name -q .name)

echo "Setting up branch protection for $REPO_OWNER/$REPO_NAME..."

# Set branch protection rules
gh api repos/$REPO_OWNER/$REPO_NAME/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Backend Tests / backend","Backend Linting / backend-lint","Frontend Tests / frontend"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_conversation_resolution=true \
  --field require_linear_history=false

echo "✅ Branch protection rules have been set up for 'main' branch"
echo ""
echo "Required status checks:"
echo "  - Backend Tests / backend"
echo "  - Backend Linting / backend-lint"
echo "  - Frontend Tests / frontend"
echo ""
echo "Additional protections:"
echo "  - Require pull request reviews (1 approval)"
echo "  - Require conversation resolution"
echo "  - Enforce for administrators"
echo "  - Block force pushes"
echo "  - Block branch deletion"
