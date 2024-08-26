#!/bin/bash

set -e

echo -e "\033[32m \n"
echo -e "===================================================="
echo -e "        Git Commit Message Helper By Vanisper       "
echo -e "====================================================\n\n"
# type="fix"
# while read -p "Module or scope tag (Default: BUG):" scope; do
#     if [ -n "$scope" ]; then
#         break
#     else
#         scope="BUG"
#         break
#     fi
# done

# read -p "Now,tell me something you've done: " desc

# if [ ! -n "$desc" ]; then
#     desc="修复了一些已知的BUG"
# fi
# git add -A && git commit -S -m $type"($scope): "$desc && git pull && git push

git add -A && pnpm commit

git pull
git push

echo -e "\033[32m"
echo -e "\n\033[0m Ok, thanks for using and bye!\n"
