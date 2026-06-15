#!/usr/bin/env python3

import re
import sys

if len(sys.argv) != 2:
    print("comment_only=false")
    sys.exit(1)

diff_file = sys.argv[1]

COMMENT_PATTERNS = [
    r'^\s*//',        # JS, TS, Java, C#
    r'^\s*#',         # Python, Shell
    r'^\s*/\*',       # block comment start
    r'^\s*\*/',       # block comment end
    r'^\s*\*[^/=*]',  # inside block comment, exclude */, *=, **
    r'^\s*\*$',       # standalone * (empty block comment line)
]

def is_comment_or_blank(line):
    stripped = line.strip()

    if stripped == "":
        return True

    for pattern in COMMENT_PATTERNS:
        if re.match(pattern, stripped):
            return True

    return False

comment_only = True
inside_block = False

with open(diff_file, encoding="utf-8", errors="ignore") as f:
    for line in f:

        if line.startswith(("+++", "---", "@@")):
            continue

        if not line.startswith(("+", "-")):
            continue

        content = line[1:]
        stripped = content.strip()

        if inside_block:
            if '*/' in stripped:
                inside_block = False
            continue

        if re.match(r'^\s*/\*', stripped):
            if '*/' not in stripped[2:]:
                inside_block = True
            else:
                # cek apakah ada kode setelah */
                after_close = stripped[stripped.index('*/') + 2:].strip()
                if after_close:
                    comment_only = False
                    break
            continue
        
        if is_comment_or_blank(content):
            continue

        comment_only = False
        break

print(f"comment_only={'true' if comment_only else 'false'}")