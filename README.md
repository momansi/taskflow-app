# TaskFlow App - Docker & Ansible Setup

This project demonstrates running the TaskFlow full-stack app using **Docker** .  

---

## Docker Setup

The app has **frontend**, **backend**, **PostgreSQL**, and **Nginx reverse proxy**. All services are connected via the `app_network` Docker network. PostgreSQL data persists in the `pg_data` volume.  

### Running with Docker

```bash
docker-compose up --build
