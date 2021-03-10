#!/bin/bash

echo "Taking Root Project Pull"
git pull

CURRENT=`pwd`
SOURCE_DEP="$CURRENT/dependency-source"
for i in $(ls "$SOURCE_DEP"); do
  echo "Taking pull of $i";
  REPO="$SOURCE_DEP/$i"
  cd "$REPO"
  git pull
done

APP_DEP="$CURRENT/application/module"
if [ -d "$APP_DEP" ]; then
  for i in $(ls "$APP_DEP"); do
    echo "Taking pull of $i";
    REPO="$APP_DEP/$i"
    cd "$REPO"
    git pull
  done
fi

