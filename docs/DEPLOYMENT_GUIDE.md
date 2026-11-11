# FitTrack Pro – Production Linux Server Deployment Guide

This guide details the procedure for deploying FitTrack Pro onto an enterprise Linux virtual machine running **Ubuntu 22.04/24.04 LTS** or **RHEL 9 / Rocky Linux**.

---

## 1. Server Prerequisites & System Hardening

### 1.1 Ubuntu Server Preparation
```bash
# Update package repositories
sudo apt-get update && sudo apt-get upgrade -y

# Install essential dependencies
sudo apt-get install -y curl wget git ufw certbot python3-certbot-nginx

# Configure Firewall (UFW)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### 1.2 Docker Engine & Compose Installation
```bash
# Install Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Enable and start Docker service
sudo systemctl enable --now docker

# Add deploy user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

---

## 2. Repository Deployment & Configuration

### 2.1 Clone Codebase
```bash
cd /opt
sudo git clone https://github.com/your-username/fitTrack.git
sudo chown -R $USER:$USER /opt/fitTrack
cd /opt/fitTrack
```

### 2.2 Environment Configuration
Create the production environment file:
```bash
cp .env.example .env
nano .env
```
Ensure production variables are populated:
```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://fittrack.yourdomain.com
MONGODB_URI=mongodb://mongo:27017/fittrack_pro
JWT_SECRET=generate_strong_64_character_hex_key_here
JWT_EXPIRES_IN=7d
INITIAL_ADMIN_EMAIL=admin@yourdomain.com
INITIAL_ADMIN_PASSWORD=ComplexAdminPassword2026!
UPLOAD_PATH=uploads
MAX_FILE_SIZE_MB=5
```

---

## 3. Starting the Production Containers

Execute Docker Compose in detached mode:
```bash
docker compose up -d --build
```

Verify that all three services (`fittrack-mongo`, `fittrack-server`, `fittrack-client`) are healthy:
```bash
docker compose ps
```

Expected output:
```text
NAME              IMAGE             COMMAND                  SERVICE   STATUS              PORTS
fittrack-client   fittrack-client   "/docker-entrypoint.…"   client    Up (healthy)        0.0.0.0:80->80/tcp
fittrack-mongo    mongo:7.0         "docker-entrypoint.s…"   mongo     Up (healthy)        0.0.0.0:27017->27017/tcp
fittrack-server   fittrack-server   "docker-entrypoint.s…"   server    Up (healthy)        0.0.0.0:5000->5000/tcp
```

### 3.1 Initial Database Seeding
Execute the administrative seed script inside the running server container:
```bash
docker compose exec server npm run seed
```

---

## 4. HTTPS & SSL Encryption (Host Nginx Reverse Proxy)

If serving traffic through a host reverse proxy with automated Let's Encrypt certificates:

Create `/etc/nginx/sites-available/fittrack`:
```nginx
server {
    server_name fittrack.yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and acquire SSL:
```bash
sudo ln -s /etc/nginx/sites-available/fittrack /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d fittrack.yourdomain.com
```

---

## 5. Maintenance, Backups & Updates

### 5.1 Checking Container Health & Logs
```bash
# Query health endpoint
curl -s http://localhost:5000/api/v1/health | jq

# View backend logs in real-time
docker compose logs -f server

# View web client Nginx access logs
docker compose logs -f client
```

### 5.2 Automated Database Backup (Cron)
Create `/usr/local/bin/fittrack-backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/fittrack"
mkdir -p "$BACKUP_DIR"
DATE=$(date +%Y%m%d_%H%M%S)

docker compose -f /opt/fitTrack/docker-compose.yml exec -T mongo \
  mongodump --db fittrack_pro --archive | gzip > "$BACKUP_DIR/fittrack_$DATE.archive.gz"

# Retain backups for 30 days
find "$BACKUP_DIR" -type f -name "*.archive.gz" -mtime +30 -delete
```
Make executable and schedule in crontab:
```bash
chmod +x /usr/local/bin/fittrack-backup.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/fittrack-backup.sh") | crontab -
```

### 5.3 Zero-Downtime Application Update Procedure
```bash
cd /opt/fitTrack
git pull origin main
docker compose build
docker compose up -d --no-deps server client
docker system prune -f
```

