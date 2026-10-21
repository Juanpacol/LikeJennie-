"""Limpia a mano los recortes donde Vision une a la persona con elementos del fondo.

Vision (scripts/cutout.swift) trata como un solo sujeto todo lo que está en primer plano, así que en
algunas fotos queda una cortina o la mano de otra persona dentro del recorte. Aquí se borran esas
zonas del canal alfa, con las coordenadas (en píxeles del PNG) de cada foto.

    python3 scripts/clean-cutouts.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

CUTOUTS = Path(__file__).resolve().parent.parent / "src" / "assets" / "cutouts"

# nombre -> polígonos a hacer transparentes
ERASE = {
    # Cortina blanca del fondo (arriba a la izquierda), incluida su punta sobre el brazo. El borde
    # inferior sigue el contorno superior del brazo levantado.
    "hero-left": [
        [(0, 0), (300, 0), (300, 252), (250, 262), (200, 272), (100, 298), (46, 306), (46, 400), (0, 400)],
    ],
    # Otra bailarina a la derecha (el borde sigue el contorno de la espalda) y la mano de otra
    # persona a la izquierda (el borde sigue el brazo de la bailarina).
    "hero-center": [
        [(470, 270), (733, 270), (733, 650), (590, 650), (575, 600), (578, 540), (574, 500),
         (570, 440), (556, 395), (520, 345)],
        [(0, 380), (188, 380), (200, 445), (196, 470), (150, 500), (100, 506), (0, 512)],
        [(0, 505), (110, 505), (110, 548), (0, 548)],
    ],
    # Sesión en blanco y negro: la banca blanca queda pegada a las figuras sentadas.
    "session-kneel": [
        [(0, 812), (395, 812), (428, 832), (436, 895), (0, 895)],
    ],
    "session-seat": [
        [(0, 797), (400, 797), (428, 815), (440, 848), (0, 848)],
    ],
}

# nombre -> píxeles que se contrae el borde (quita el halo del fondo original) antes de suavizarlo
ERODE = {
    "hero-right": 2,
    "hero-center": 1,
    "footer-stage": 1,
    "session-kneel": 2,
    "session-pose": 2,
    "session-seat": 2,
}

for name, polygons in ERASE.items():
    path = CUTOUTS / f"{name}.png"
    image = Image.open(path).convert("RGBA")
    alpha = image.getchannel("A")
    draw = ImageDraw.Draw(alpha)
    for polygon in polygons:
        draw.polygon(polygon, fill=0)
    image.putalpha(alpha)
    image.save(path, optimize=True)
    print(f"limpio {name}.png ({len(polygons)} zonas)")

for name, pixels in ERODE.items():
    path = CUTOUTS / f"{name}.png"
    image = Image.open(path).convert("RGBA")
    alpha = image.getchannel("A").filter(ImageFilter.MinFilter(2 * pixels + 1))
    image.putalpha(alpha.filter(ImageFilter.GaussianBlur(0.7)))
    image.save(path, optimize=True)
    print(f"borde de {name}.png contraído {pixels} px")
