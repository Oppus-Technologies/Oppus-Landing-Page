"""Converte os prints do Oppus ERP para WebP leve, prontos para o site.

Uso:  python ferramentas/otimizar-prints.py  pasta-com-os-pngs
Saída: assets/img/print-<nome>.webp (largura máxima 1600 px, qualidade 82)
       e uma versão de 800 px (print-<nome>-800.webp) para celular.

Nomes esperados (o site já aponta para eles): inicio, os, entrada.
Ex.: inicio.png -> assets/img/print-inicio.webp
Precisa de Pillow:  pip install pillow
"""
import sys
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "assets" / "img"


def salvar(img: Image.Image, largura: int, caminho: Path) -> None:
    if img.width > largura:
        img = img.resize((largura, round(img.height * largura / img.width)), Image.LANCZOS)
    img.save(caminho, "WEBP", quality=82, method=6)
    print(f"  {caminho.relative_to(RAIZ)}  {img.width}x{img.height}  {caminho.stat().st_size // 1024} KB")


def main() -> None:
    origem = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    arquivos = sorted(p for p in origem.iterdir() if p.suffix.lower() in {".png", ".jpg", ".jpeg"})
    if not arquivos:
        sys.exit(f"Nenhum PNG/JPG em {origem}")
    for p in arquivos:
        img = Image.open(p).convert("RGB")
        nome = p.stem.lower().replace(" ", "-")
        print(f"{p.name}  {img.width}x{img.height}  {p.stat().st_size // 1024} KB")
        salvar(img, 1600, DESTINO / f"print-{nome}.webp")
        salvar(img, 800, DESTINO / f"print-{nome}-800.webp")


if __name__ == "__main__":
    main()
