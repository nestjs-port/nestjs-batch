#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

usage() {
  cat <<'USAGE'
Usage: ./scripts/check-missing-ts.sh <absolute-path-to-spring-batch-module-root>

Examples:
  ./scripts/check-missing-ts.sh /path/to/spring-batch-core
  ./scripts/check-missing-ts.sh /path/to/spring-batch-infrastructure
USAGE
}

camel_to_kebab() {
  printf '%s' "$1" \
    | sed -E 's/([A-Z]+)([A-Z][a-z])/\1-\2/g; s/([a-z0-9])([A-Z])/\1-\2/g' \
    | tr '[:upper:]' '[:lower:]'
}

strip_prefix_dir() {
  local dir="$1"
  local prefix="$2"

  if [[ -z "$prefix" ]]; then
    printf '%s\n' "$dir"
    return 0
  fi

  if [[ -z "$dir" ]]; then
    return 1
  fi

  if [[ "$dir" == "$prefix" ]]; then
    printf '\n'
    return 0
  fi

  if [[ "$dir" == "$prefix/"* ]]; then
    printf '%s\n' "${dir#"$prefix/"}"
    return 0
  fi

  return 1
}

resolve_expected_ts_dir() {
  local spring_module_name="$1"
  local spring_module_suffix="$2"
  local rel_dir="$3"
  local dir="$rel_dir"

  if [[ "$dir" == "." ]]; then
    dir=""
  fi

  if [[ -n "$spring_module_suffix" ]] && strip_prefix_dir "$dir" "$spring_module_suffix" >/dev/null 2>&1; then
    strip_prefix_dir "$dir" "$spring_module_suffix"
    return
  fi

  case "$spring_module_name" in
    spring-batch-core)
      strip_prefix_dir "$dir" "core"
      ;;
    *)
      printf '%s\n' "$dir"
      ;;
  esac
}

resolve_nest_package_dir() {
  local spring_module_name="$1"
  local mapped=""

  case "$spring_module_name" in
    spring-batch-core) mapped="core" ;;
    spring-batch-infrastructure) mapped="infrastructure" ;;
    spring-batch-integration) mapped="platform" ;;
    spring-batch-test) mapped="commons" ;;
    spring-batch-*)
      mapped="${spring_module_name#spring-batch-}"
      ;;
    *)
      mapped="$spring_module_name"
      ;;
  esac

  if [[ -d "$ROOT_DIR/packages/$mapped" ]]; then
    printf '%s\n' "$ROOT_DIR/packages/$mapped"
    return 0
  fi

  return 1
}

if [[ $# -ne 1 ]]; then
  usage
  exit 1
fi

spring_module_dir="$1"

if [[ "$spring_module_dir" != /* ]]; then
  echo "[ERROR] Please pass an absolute path: $spring_module_dir" >&2
  usage
  exit 1
fi

if [[ ! -d "$spring_module_dir" ]]; then
  echo "[ERROR] Spring Batch module root not found: $spring_module_dir" >&2
  exit 1
fi

spring_module_name="$(basename "$spring_module_dir")"
spring_module_suffix=""
if [[ "$spring_module_name" == spring-batch-* ]]; then
  spring_module_suffix="${spring_module_name#spring-batch-}"
else
  echo "[ERROR] Directory does not look like a spring-batch module: $spring_module_dir" >&2
  exit 1
fi

if ! nest_package_dir="$(resolve_nest_package_dir "$spring_module_name")"; then
  echo "[ERROR] Matching NestJS package not found for module: $spring_module_name" >&2
  exit 1
fi

java_base="$spring_module_dir/src/main/java/org/springframework/batch"
if [[ ! -d "$java_base" ]]; then
  java_base="$spring_module_dir/src/main/java"
fi

if [[ ! -d "$java_base" ]]; then
  echo "[ERROR] Java source directory not found in: $spring_module_name" >&2
  exit 1
fi

tmp_file="$(mktemp)"
trap 'rm -f "$tmp_file"' EXIT

while IFS= read -r java_file; do
  imports_count="$(grep -cE '^[[:space:]]*import[[:space:]]+' "$java_file" || true)"

  rel_path="${java_file#"$java_base/"}"
  rel_no_ext="${rel_path%.java}"
  rel_dir="$(dirname "$rel_no_ext")"
  java_name="$(basename "$rel_no_ext")"
  ts_name="$(camel_to_kebab "$java_name")"

  if ! expected_dir="$(resolve_expected_ts_dir "$spring_module_name" "$spring_module_suffix" "$rel_dir")"; then
    echo "[WARN] Package path rule mismatch: ${java_file#"$spring_module_dir/"}" >&2
    continue
  fi

  if [[ -n "$expected_dir" ]]; then
    candidate_a="$nest_package_dir/src/$expected_dir/$ts_name.ts"
    candidate_b="$nest_package_dir/src/$expected_dir/$ts_name.interface.ts"
    candidate_c="$nest_package_dir/src/$expected_dir/$ts_name.enum.ts"
  else
    candidate_a="$nest_package_dir/src/$ts_name.ts"
    candidate_b="$nest_package_dir/src/$ts_name.interface.ts"
    candidate_c="$nest_package_dir/src/$ts_name.enum.ts"
  fi

  if [[ ! -f "$candidate_a" && ! -f "$candidate_b" && ! -f "$candidate_c" ]]; then
    printf '%s\t%s\t%s\n' \
      "$imports_count" \
      "$java_file" \
      "$candidate_a" \
      >> "$tmp_file"
  fi
done < <(find "$java_base" -type f -name '*.java' ! -name 'package-info.java' | sort)

if [[ ! -s "$tmp_file" ]]; then
  echo "No missing TS files found for module: $spring_module_name"
  exit 0
fi

echo "Missing TS files for module: $spring_module_name"
echo "(sorted by Java import count asc)"
sort -t $'\t' -n -k1,1 -k2,2 "$tmp_file" | while IFS=$'\t' read -r count java_file expected_ts; do
  java_display="${java_file#"$spring_module_dir/"}"
  ts_display="${expected_ts#"$ROOT_DIR/"}"
  printf '[imports=%s] %s -> %s\n' "$count" "$java_display" "$ts_display"
done
