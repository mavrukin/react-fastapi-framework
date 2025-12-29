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

# Run prettier on the files and check if any were modified
if [ ${#files[@]} -gt 0 ]; then
  # Create temporary copies to compare
  temp_dir=$(mktemp -d)
  for file in "${files[@]}"; do
    if [ -f "$file" ]; then
      cp "$file" "$temp_dir/$(basename "$file")"
    fi
  done

  # Run prettier
  npx prettier --write "${files[@]}"

  # Check if any files were modified
  modified=false
  for file in "${files[@]}"; do
    if [ -f "$file" ] && [ -f "$temp_dir/$(basename "$file")" ]; then
      if ! diff -q "$file" "$temp_dir/$(basename "$file")" >/dev/null 2>&1; then
        modified=true
        break
      fi
    fi
  done

  rm -rf "$temp_dir"

  if [ "$modified" = true ]; then
    echo "Prettier made changes to the above files. Please stage them and commit again."
    exit 1
  fi
fi
