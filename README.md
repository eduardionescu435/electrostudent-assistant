# ElectroStudent Assistant

Aplicație Full-Stack pentru asistența studenților. Proiect de licență.

## Tehnologii folosite
* React (Frontend)
* Python / Flask (Backend)
* MySQL & Docker

---

## Cum să rulezi aplicația local

### Cerințe de sistem
* Docker și Docker Compose (v24+)
* Minim 4GB RAM disponibili
* O cheie API de la Google AI Studio (https://ai.google.dev/) pentru funcționalitatea Gemini OCR.

### Pași de instalare

**1. Descarcă proiectul**

    git clone https://github.com/eduardionescu06/electrostudent-assistant.git
    cd electrostudent-assistant


**2. Setează variabilele de mediu**
Navighează în folderul `backend/`. Redenumește fișierul `.env.example` în `.env` și completează câmpurile lipsă:
* `SECRET_KEY`: adaugă un string aleatoriu lung.
* `GEMINI_API_KEY`: inserează token-ul obținut de la Google.
*(Credențialele bazei de date sunt deja preconfigurate pentru mediul de dezvoltare Docker).*

**3. Pornește serviciile**
Din folderul principal (unde se află `docker-compose.yml`), rulează:

    docker compose build
    docker compose up -d

*La prima rulare, scriptul intern va popula baza de date cu cele 20 de componente electronice standard și va crea un cont implicit de test (admin / admin).*

**4. Accesează aplicația**
* Interfața Web (Vite/React): http://localhost:5173
* Serverul API (Flask): http://localhost:5000

**Oprirea containerelor**
Pentru a închide aplicația fără a pierde datele salvate, folosește comanda `docker compose down`.