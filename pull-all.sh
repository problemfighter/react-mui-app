#!/bin/bash
git pull

CURRENT=`pwd`
SOURCE_DEP="$CURRENT/dependency-source"
for i in $(ls SOURCE_DEP); do
  echo $i;
done