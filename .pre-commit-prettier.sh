#!/bin/bash
# Pre-commit hook script for prettier

if [ ! -d "frontend/node_modules" ]; then
  echo "Skipping prettier: frontend/node_modules not found. Run 'npm install' in frontend/ first."
  exit 0
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

# Run prettier on the files
if [ ${#files[@]} -gt 0 ]; then
  npx prettier --write "${files[@]}"
fi
