#!/bin/sh
set -e

KAPACITOR_URL="http://kapacitor:9092"

echo "==> Esperando a que Kapacitor este listo..."
until kapacitor -url "$KAPACITOR_URL" list tasks > /dev/null 2>&1; do
  echo "    Kapacitor no disponible, reintentando en 5s..."
  sleep 5
done

echo "==> Kapacitor listo. Registrando alerta errorCount_alert..."
kapacitor -url "$KAPACITOR_URL" define errorCount_alert \
  -type stream \
  -tick /scripts/errorCount_alert.tick \
  -dbrp telegraf.autogen

kapacitor -url "$KAPACITOR_URL" enable errorCount_alert

echo "==> Alerta configurada exitosamente:"
kapacitor -url "$KAPACITOR_URL" list tasks
