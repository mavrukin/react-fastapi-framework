# Branch Protection Setup

This document explains how to configure branch protection rules to require GitHub Actions to pass before merging into `main`.

## Setting Up Branch Protection via GitHub UI

1. Go to your repository on GitHub
2. Click on **Settings** (in the repository, not your account settings)
3. Click on **Branches** in the left sidebar
4. Under **Branch protection rules**, click **Add rule** or edit the existing rule for `main`
5. Configure the following settings:

### Required Settings

- **Branch name pattern**: `main`
- **Require a pull request before merging**: ✅ Enabled
  - **Require approvals**: 1 (or more as needed)
  - **Dismiss stale pull request approvals when new commits are pushed**: ✅ Enabled
- **Require status checks to pass before merging**: ✅ Enabled
  - **Require branches to be up to date before merging**: ✅ Enabled
  - **Status checks that are required**:
    - `Backend Tests / backend`
    - `Backend Linting / backend-lint`
    - `Frontend Tests / frontend`
    - `Pre-commit / pre-commit` (if you want to require it)

### Recommended Additional Settings

- **Require conversation resolution before merging**: ✅ Enabled
- **Require linear history**: ✅ Enabled (optional, for cleaner git history)
- **Include administrators**: ✅ Enabled (applies rules to admins too)
- **Do not allow bypassing the above settings**: ✅ Enabled (recommended for security)

## Setting Up Branch Protection via GitHub CLI

If you have GitHub CLI installed, you can run:

```bash
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Backend Tests / backend","Backend Linting / backend-lint","Frontend Tests / frontend"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null
```

Replace `:owner` and `:repo` with your repository owner and name.

## Setting Up Branch Protection via Terraform (if using Infrastructure as Code)

```hcl
resource "github_branch_protection" "main" {
  repository_id = github_repository.repo.id
  pattern       = "main"

  required_status_checks {
    strict   = true
    contexts = [
      "Backend Tests / backend",
      "Backend Linting / backend-lint",
      "Frontend Tests / frontend"
    ]
  }

  required_pull_request_reviews {
    required_approving_review_count = 1
    dismiss_stale_reviews           = true
  }

  enforce_admins = true
}
```

## Verifying Status Checks

After setting up branch protection, you can verify the required status checks by:

1. Creating a test pull request
2. The PR will show which checks are required and their status
3. The merge button will be disabled until all required checks pass

## Status Check Names

The status check names in GitHub Actions correspond to:
- **Backend Tests / backend**: From `.github/workflows/ci.yml` - `backend` job
- **Backend Linting / backend-lint**: From `.github/workflows/ci.yml` - `backend-lint` job
- **Frontend Tests / frontend**: From `.github/workflows/ci.yml` - `frontend` job
- **Pre-commit / pre-commit**: From `.github/workflows/pre-commit.yml` - `pre-commit` job

Note: The format is `{workflow_name} / {job_name}`. You can find the exact names by looking at the workflow files or by checking a recent PR's status checks.
