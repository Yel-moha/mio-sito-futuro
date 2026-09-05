// One-off: copia e ottimizza le immagini del progetto AllarmGSM (repo privato `just_me`)
// dentro src/assets/, cosi' il build CI non dipende ne' da quel repo ne' da ImageMagick.
// Uso:  npm run assets   (richiede il binario `magick` / ImageMagick installato)
// Idempotente: salta i file gia' presenti. Forza la rigenerazione con  FORCE=1 npm run assets

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..');
const FORCE = process.env.FORCE === '1';

// Sorgenti nel repo Curriculum (fuori da questo repo, non versionate qui).
const CURRICULUM = resolve(repoRoot, '..', 'just_me', 'Curriculum');
const ALLARM = resolve(
  CURRICULUM,
  'AllarmGSM',
  'AllarmeGSM',
  'Componenti_Allarme',
  'Immagini_Componenti',
);

const OUT_PROJECT = resolve(here, '..', 'src', 'assets', 'projects', 'allarme-gsm');
const OUT_PROFILE = resolve(here, '..', 'src', 'assets', 'profile');

// [ sorgente relativa a ALLARM , nome slug di destinazione ]
const projectImages = [
  ['Contenitore_Esterno/Progetto_Finito_Frontale.jpeg', 'progetto-finito-frontale'],
  ['Contenitore_Esterno/Frontale_Fissaggio.jpeg', 'contenitore-frontale'],
  ['Contenitore_Esterno/Contenitore_Interno.jpg', 'contenitore-interno'],
  ['Contenitore_Esterno/Laterale_Contenitore.jpeg', 'contenitore-laterale'],
  ['Base_Componenti_Fronte.png', 'base-componenti-fronte'],
  ['Base_con_componenti.png', 'base-con-componenti'],
  ['Arduino_Mega.jpg', 'arduino-mega'],
  ['Modulo Sim 7600E Fronte.png', 'modulo-sim7600'],
  ['Display LCD I2c_ Fronte.jpg', 'display-lcd-i2c'],
  ['RF 433MHZ.jpg', 'rf-433mhz'],
  ['Antenna_RF433MHZ.jpg', 'antenna-rf433'],
  ['Tastiera.jpg', 'tastiera-4x3'],
  ['Buzzer_5V.png', 'buzzer-5v'],
  ['Modulo_Relé_4_canali.jpg', 'modulo-rele-4ch'],
  ['Pir_433MHZ.jpg', 'sensore-pir-433'],
  ['Sensore_Apertura_433MHZ.jpg', 'sensore-apertura-433'],
  ['Telecomando_433MHZ.jpg', 'telecomando-433'],
  ['Sirena_5V.jpg', 'sirena-5v'],
];

for (let i = 1; i <= 6; i++) {
  projectImages.push([`Display_Options/Menu${i}.png`, `menu-lcd-${i}`]);
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function convert(src, dest, { width, quality }) {
  if (!existsSync(src)) {
    console.warn(`  ⚠ sorgente mancante, salto: ${src}`);
    return false;
  }
  if (existsSync(dest) && !FORCE) {
    console.log(`  = ${dest.split('/assets/')[1]} (gia' presente)`);
    return true;
  }
  execFileSync('magick', [
    src,
    '-auto-orient',
    '-resize',
    `${width}x${width}>`,
    '-strip',
    '-quality',
    String(quality),
    dest,
  ]);
  console.log(`  ✓ ${dest.split('/assets/')[1]}`);
  return true;
}

function main() {
  try {
    execFileSync('magick', ['-version'], { stdio: 'ignore' });
  } catch {
    console.error('ImageMagick (`magick`) non trovato. Installa ImageMagick e riprova.');
    process.exit(1);
  }

  ensureDir(OUT_PROJECT);
  ensureDir(OUT_PROFILE);

  console.log('Foto profilo:');
  convert(
    resolve(CURRICULUM, 'io_per_cv.jpeg'),
    resolve(OUT_PROFILE, 'youssef.jpg'),
    { width: 640, quality: 84 },
  );

  console.log('\nImmagini progetto AllarmGSM:');
  let ok = 0;
  for (const [rel, slug] of projectImages) {
    if (convert(resolve(ALLARM, rel), resolve(OUT_PROJECT, `${slug}.jpg`), {
      width: 1400,
      quality: 82,
    })) {
      ok++;
    }
  }
  console.log(`\nFatto: ${ok}/${projectImages.length} immagini progetto pronte in src/assets/projects/allarme-gsm/`);
}

main();
