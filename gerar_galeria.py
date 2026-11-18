#!/usr/bin/env python3
"""
Lê as pastas dentro de "assets" e grava a lista de arquivos em assets/js/galeria.js.
Use pelo duplo clique em atualizar-galeria.bat (ou: python gerar_galeria.py).

  assets/capa/            -> 1 imagem de capa (opcional)
  assets/video/intro/     -> 1 vídeo da primeira tela
  assets/video/entrega/   -> vídeos da galeria (foto com o mesmo nome = capa do vídeo)
  assets/fotos/<pasta>/   -> fotos; cada subpasta vira uma categoria
  assets/musica/          -> 1 música
"""
import json
import os
import re
import sys
from datetime import datetime

BASE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(BASE, "assets")
SAIDA = os.path.join(ASSETS, "js", "galeria.js")

IMG = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"}
VID = {".mp4", ".webm", ".mov", ".m4v"}
AUD = {".mp3", ".m4a", ".ogg", ".wav", ".aac"}


def natural(s):
    """Ordem natural: foto2 vem antes de foto10."""
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]


def listar(pasta, exts):
    if not os.path.isdir(pasta):
        return []
    arqs = [f for f in os.listdir(pasta)
            if os.path.isfile(os.path.join(pasta, f))
            and not f.startswith(".")
            and os.path.splitext(f)[1].lower() in exts]
    return sorted(arqs, key=natural)


def main():
    avisos = []

    # fotos por categoria (cada subpasta de assets/fotos)
    fotos = {}
    pasta_fotos = os.path.join(ASSETS, "fotos")
    if os.path.isdir(pasta_fotos):
        for cat in sorted(os.listdir(pasta_fotos), key=natural):
            caminho = os.path.join(pasta_fotos, cat)
            if not os.path.isdir(caminho) or cat.startswith("."):
                continue
            arqs = listar(caminho, IMG)
            if arqs:
                fotos[cat] = arqs
            if re.search(r"[^A-Za-z0-9_\-]", cat):
                avisos.append(f"Pasta '{cat}': prefira nomes sem acento, espaço ou símbolos.")

    # vídeos da galeria (+ capa opcional com o mesmo nome)
    pasta_vid = os.path.join(ASSETS, "video", "entrega")
    imagens = listar(pasta_vid, IMG)
    capas = {os.path.splitext(i)[0].lower(): i for i in imagens}
    videos = []
    for v in listar(pasta_vid, VID):
        item = {"arquivo": v}
        capa = capas.get(os.path.splitext(v)[0].lower())
        if capa:
            item["capa"] = capa
        videos.append(item)

    intro = listar(os.path.join(ASSETS, "video", "intro"), VID)
    musica = listar(os.path.join(ASSETS, "musica"), AUD)
    capa = listar(os.path.join(ASSETS, "capa"), IMG)

    if len(intro) > 1:
        avisos.append(f"Há {len(intro)} vídeos em video/intro; será usado '{intro[0]}'.")
    if len(musica) > 1:
        avisos.append(f"Há {len(musica)} músicas; será usada '{musica[0]}'.")
    if len(capa) > 1:
        avisos.append(f"Há {len(capa)} imagens em capa; será usada '{capa[0]}'.")

    dados = {
        "fotos": fotos,
        "videos": videos,
        "videoIntro": intro[0] if intro else None,
        "musica": musica[0] if musica else None,
        "capa": capa[0] if capa else None,
    }

    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    with open(SAIDA, "w", encoding="utf-8") as f:
        f.write("/* ARQUIVO GERADO AUTOMATICAMENTE — não edite à mão.\n")
        f.write("   Rode \"atualizar-galeria.bat\" (duplo clique) para atualizar esta lista.\n")
        f.write(f"   Última atualização: {datetime.now():%d/%m/%Y %H:%M} */\n")
        f.write("window.GALERIA = " + json.dumps(dados, ensure_ascii=False, indent=1) + ";\n")

    total = sum(len(v) for v in fotos.values())
    print("Galeria atualizada!\n")
    for cat, arqs in fotos.items():
        print(f"  Fotos / {cat}: {len(arqs)}")
    if not fotos:
        print("  Fotos: nenhuma (a página mostrará fotos de exemplo)")
    print(f"  Total de fotos: {total}")
    print(f"  Vídeos da entrega: {len(videos)}")
    print(f"  Vídeo da primeira tela: {dados['videoIntro'] or 'nenhum (usará exemplo)'}")
    print(f"  Música: {dados['musica'] or 'nenhuma (usará a trilha gerada)'}")
    print(f"  Capa: {dados['capa'] or 'nenhuma'}")
    for a in avisos:
        print("  ATENÇÃO:", a)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # mensagem amigável
        print("Algo deu errado:", e)
        sys.exit(1)
