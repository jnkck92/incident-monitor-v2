# Raspberry Pi Setup – Incident Monitor

Anleitung zur Einrichtung des Incident Monitors auf einem Raspberry Pi mit Raspberry Pi OS (Wayland/Labwc).

## Voraussetzungen

- Raspberry Pi mit Raspberry Pi OS
- Internetzugang

---

## 1. Docker installieren

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl ca-certificates

curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

sudo usermod -aG docker $USER
newgrp docker

sudo apt install -y docker-compose-plugin
docker compose version

sudo systemctl enable docker
sudo systemctl start docker
```

---

## 2. Mauszeiger ausblenden

```bash
sudo apt update && sudo apt install wtype
```

Datei `~/.config/labwc/rc.xml` anlegen:

```xml
<keyboard>
  <default />
  <keybind key="A-S-m">
    <action name="HideCursor" />
    <action name="WarpCursor" x="-1" y="-1" />
  </keybind>
</keyboard>
```

---

## 3. Autostart konfigurieren

Datei `~/.config/labwc/autostart` bearbeiten/anlegen und folgenden Inhalt hinzufügen:

```bash
wtype -M alt -M shift m -m alt -m shift &
chromium --password-store=basic --noerrdialogs --disable-infobars --no-first-run --kiosk --incognito http://localhost:8080
```

---

## 4. Incident Monitor starten

`docker-compose.yml` mit folgendem Inhalt anlegen:

```yaml
services:
  incident-monitor:
    image: ghcr.io/jnkck92/incident-monitor-v2:latest
    container_name: incident-monitor
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./config.json:/usr/share/nginx/html/config.json:ro
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:80/"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

`config.json` anlegen mit fiolgendem Inhalt

```json
{
  "diveraBaseUrl": "https://app.divera247.com",
  "diveraApiKey": "DEIN_ECHTER_KEY",
  "pollIntervalSeconds": 30,
  "departmentName": "Feuerwehr Musterstadt",
  "ownVehicleId": "12345"
}
```

```bash
docker compose up -d
```

---

## Nützliche Befehle

```bash
# Logs anzeigen
docker logs incident-monitor

# Logs live verfolgen
docker logs -f incident-monitor

# Stoppen
docker compose down

# Auf neue Version updaten
docker compose pull
docker compose up -d
```