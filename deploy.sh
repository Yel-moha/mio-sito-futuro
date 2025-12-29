#!/bin/bash
echo "🔄 Aggiornamento del sito..."
git add .
git commit -m "$1"
git push origin main
echo "✅ Deploy completato!"