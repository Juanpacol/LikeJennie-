#!/bin/sh
# Genera los recortes de src/assets/cutouts/ a partir de las fotos originales.
#   sh scripts/make-cutouts.sh <carpeta con las ocho fotos originales (hero-left, hero-center, hero-right, footer-stage, session-kneel, session-pose, session-seat y session-suit, en .jpg)>
# Requiere macOS 14+ (recorte de sujeto de Apple) y Python 3 con Pillow.
set -e
SOURCE="${1:?Uso: sh scripts/make-cutouts.sh <carpeta con las fotos originales>}"
OUT="$(dirname "$0")/../src/assets/cutouts"
mkdir -p "$OUT"
for name in hero-left hero-center hero-right footer-stage session-kneel session-pose session-seat session-suit; do
  swift "$(dirname "$0")/cutout.swift" "$SOURCE/$name.jpg" "$OUT/$name.png"
done
python3 "$(dirname "$0")/clean-cutouts.py"
