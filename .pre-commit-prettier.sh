#!/bin/bash
# Pre-commit hook script for prettier
# This matches the GitHub Actions workflow: runs prettier on all frontend files

set -e

if [ ! -d "frontend/node_modules" ]; then
  echo "ERROR: frontend/node_modules not found. Run 'npm install' in frontend/ first."
  echo "Prettier check cannot run without dependencies."
  exit 1
fi

cd frontend || exit 1

# Process each file, stripping the frontend/ prefix if present
files=()
for file in "$@"; do
  if [[ "$file" == frontend/* ]]; then
    files+=("${file#frontend/}")
  elif [[ "$file" == /* ]]; then
    # Absolute path - try to make it relative to frontend
    rel_path="${file#*frontend/}"
    if [ "$rel_path" != "$file" ]; then
      files+=("$rel_path")
    fi
  else
    files+=("$file")
  fi
done

# If no files provided, check all files (shouldn't happen with pass_filenames: true)
if [ ${#files[@]} -eq 0 ]; then
  echo "No files provided to prettier hook"
  exit 0
fi

# Run prettier on the files and check if any were modified
modified_files=()
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Create a temporary copy to compare
    temp_file=$(mktemp)
    cp "$file" "$temp_file"

    # Run prettier on the file
    npx prettier --write "$file" >/dev/null 2>&1

    # Check if file was modified
    if ! diff -q "$file" "$temp_file" >/dev/null 2>&1; then
      modified_files+=("$file")
    fi

    rm -f "$temp_file"
  fi
done

if [ ${#modified_files[@]} -gt 0 ]; then
  echo "Prettier made changes to the above files. Please stage them and commit again."
  exit 1
fi
