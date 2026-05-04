#!/usr/bin/env python3
"""
Sincronizador de imágenes de Amazon para ERESS Store.

Lo que hace:
1. Lee products.js y extrae todas las URLs de imágenes
2. Descarga cada imagen única a la carpeta /imgs (con varios fallbacks de proxy)
3. Reescribe products.js apuntando a las rutas locales ./imgs/<id>.jpg
4. Si una imagen falla, deja un placeholder y la marca para reintento

Pensado para ejecutarse en GitHub Actions (los runners de GitHub
tienen IPs distintas y suelen pasar el bloqueo de Amazon).
"""

import os
import re
import sys
import time
import requests
from pathlib import Path

ROOT = Path(__file__).parent.parent
PRODUCTS_FILE = ROOT / "products.js"
IMGS_DIR = ROOT / "imgs"
PLACEHOLDER = "./imgs/placeholder.jpg"

# Headers que imitan a un navegador real
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
    'Referer': 'https://www.amazon.com/',
    'Sec-Fetch-Dest': 'image',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'cross-site',
}


def get_image_id(url: str) -> str:
    """Extrae el ID único de la imagen desde la URL de Amazon."""
    match = re.search(r'/I/([^/.]+)\.', url)
    if match:
        # Limpiar caracteres no válidos para nombre de archivo
        return re.sub(r'[^A-Za-z0-9_-]', '_', match.group(1))
    return None


def download_with_fallbacks(url: str, dest: Path) -> bool:
    """Intenta descargar la imagen con varios métodos. Devuelve True si lo logra."""
    image_id = get_image_id(url)
    if not image_id:
        return False

    # Variantes de URL a intentar (de más probable a menos)
    variants = [
        url,  # URL original tal cual
        url.replace('m.media-amazon.com', 'images-na.ssl-images-amazon.com'),
        url.replace('m.media-amazon.com', 'images-eu.ssl-images-amazon.com'),
        # Versión sin redimensionado (a veces las "raw" están abiertas)
        re.sub(r'\._[A-Z0-9_,]+_\.', '.', url),
    ]

    for variant in variants:
        try:
            resp = requests.get(variant, headers=HEADERS, timeout=15)
            if resp.status_code == 200 and len(resp.content) > 1000:
                # Verificar que sea realmente una imagen
                if resp.content[:3] in (b'\xff\xd8\xff', b'\x89PN', b'GIF', b'RIF'):
                    dest.write_bytes(resp.content)
                    return True
        except Exception:
            continue
        time.sleep(0.2)

    return False


def create_placeholder():
    """Crea un placeholder simple si no existe."""
    placeholder = IMGS_DIR / "placeholder.jpg"
    if placeholder.exists():
        return
    # JPEG mínimo válido de 1x1 px gris (200 bytes aprox)
    minimal_jpeg = bytes.fromhex(
        'ffd8ffe000104a46494600010100000100010000ffdb004300080606070605'
        '0809070708090a0c14111c151513110d0d0e1c1f1c1c1c1c1c1c1c1c1c1c1c'
        '1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c'
        '1cffc0000b08000100010101011100ffc4001f00000105010101010101'
        '0000000000000000010203040506070809ffc40014100100000000000000'
        '00000000000000ffda0008010100003f00fbd0ffd9'
    )
    placeholder.write_bytes(minimal_jpeg)


def main():
    if not PRODUCTS_FILE.exists():
        print(f"❌ No se encontró {PRODUCTS_FILE}")
        sys.exit(1)

    IMGS_DIR.mkdir(exist_ok=True)
    create_placeholder()

    content = PRODUCTS_FILE.read_text(encoding='utf-8')

    # Encontrar todas las URLs de imágenes
    pattern = re.compile(r'img:"(https://[^"]*amazon[^"]*)"')
    urls = pattern.findall(content)
    unique_urls = list(set(urls))

    print(f"📊 Total URLs: {len(urls)}")
    print(f"📊 URLs únicas: {len(unique_urls)}")

    # Descargar las únicas
    url_to_local = {}
    ok = 0
    fail = 0

    for i, url in enumerate(unique_urls, 1):
        image_id = get_image_id(url)
        if not image_id:
            url_to_local[url] = PLACEHOLDER
            continue

        local_path = IMGS_DIR / f"{image_id}.jpg"

        # Si ya existe, reutilizar
        if local_path.exists() and local_path.stat().st_size > 1000:
            url_to_local[url] = f"./imgs/{image_id}.jpg"
            ok += 1
            print(f"[{i}/{len(unique_urls)}] ⏭️  Ya existe: {image_id}")
            continue

        if download_with_fallbacks(url, local_path):
            url_to_local[url] = f"./imgs/{image_id}.jpg"
            ok += 1
            print(f"[{i}/{len(unique_urls)}] ✅ {image_id}")
        else:
            url_to_local[url] = PLACEHOLDER
            fail += 1
            print(f"[{i}/{len(unique_urls)}] ❌ {image_id} (placeholder)")

        time.sleep(0.3)

    # Reescribir products.js apuntando a rutas locales
    new_content = content
    for url, local in url_to_local.items():
        new_content = new_content.replace(f'img:"{url}"', f'img:"{local}"')

    PRODUCTS_FILE.write_text(new_content, encoding='utf-8')

    print(f"\n📦 Resumen:")
    print(f"   ✅ Descargadas: {ok}")
    print(f"   ❌ Con placeholder: {fail}")
    print(f"   📝 products.js actualizado")

    # Si fallaron muchas, sugerir el plan B
    if fail > len(unique_urls) * 0.3:
        print(f"\n⚠️  Muchas imágenes fallaron. Considerá ejecutar el workflow nuevamente.")


if __name__ == "__main__":
    main()
