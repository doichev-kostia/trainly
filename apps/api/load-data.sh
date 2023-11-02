#!/usr/bin/env bash

filname=$1

printf "Loading data from %s\n" "$filname"

psql "$DB_URL" -f "$filname"
