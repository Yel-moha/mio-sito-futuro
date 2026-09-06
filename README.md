# YEM Embedded — sito vetrina

Sito di **YEM Embedded** (Youssef El Mohajir): piccole soluzioni embedded su misura —
prototipazione, firmware C/C++, integrazione GSM / RF 433 MHz / sensori.

Sito statico multi-pagina costruito con **Vite + TypeScript**, in italiano, con tema
chiaro/scuro automatico. Deploy automatico su **GitHub Pages**.

## Struttura

```
yem-embedded/
├── .github/workflows/deploy.yml     # build + deploy su GitHub Pages ad ogni push su main
├── frontend/
│   ├── index.html                   # Home
│   ├── progetti/
│   │   └── allarme-gsm.html         # Case study: allarme domestico GSM su Arduino Mega
│   ├── vite.config.ts               # base '/yem-embedded/', input multi-pagina
│   ├── scripts/optimize-images.mjs  # copia+ottimizza le immagini dei progetti (usa ImageMagick)
│   └── src/
│       ├── styles/                  # design system (tokens, base, layout, componenti, pagina progetto)
│       ├── lib/                     # nav, reveal-on-scroll, smooth-scroll, anno corrente
│       ├── gallery.ts               # lightbox accessibile per la pagina progetto
│       ├── pages/                   # entrypoint per pagina (home.ts, allarme-gsm.ts)
│       └── assets/                  # foto profilo + immagini progetti (ottimizzate, versionate)
└── docs/                            # note di pianificazione
```

## Sviluppo

Serve Node 20+.

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173/yem-embedded/
```

## Build e anteprima

```bash
npm run build      # type-check + build in frontend/dist/
npm run preview    # serve la build di produzione
```

## Immagini dei progetti

Le immagini ottimizzate sono già versionate in `frontend/src/assets/`. Per rigenerarle
dalle sorgenti (cartella `Curriculum/AllarmGSM/`, esterna a questo repo) serve
ImageMagick (`magick`):

```bash
cd frontend
npm run assets            # salta i file già presenti
FORCE=1 npm run assets    # rigenera tutto
```

## Deploy

Ogni push su `main` fa partire il workflow [`deploy.yml`](.github/workflows/deploy.yml):
build di `frontend/` e pubblicazione su GitHub Pages.

Prima volta: in **GitHub → Settings → Pages**, impostare **Source = GitHub Actions**.
Sito online su `https://yel-moha.github.io/yem-embedded/`.
