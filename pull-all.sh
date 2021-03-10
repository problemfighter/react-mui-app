#!/bin/bash

echo "Taking Root Project Pull"
git pull

CURRENT=`pwd`
SOURCE_DEP="$CURRENT/dependency-source"
echo "$SOURCE_DEP"
for i in $(ls "$SOURCE_DEP"); do
  echo "Taking pull of $i";
  REPO="$SOURCE_DEP/$i"
  cd "$REPO"
  git pull
done