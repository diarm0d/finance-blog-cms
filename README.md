## Running with Docker

This project is configured to run in three different Docker environments: development, staging, and production.

### Development

This environment is optimized for local development with hot-reloading.

1.  **Start the container:**
    ```bash
    docker compose -f docker/development/compose.yaml up --build
    ```
2.  **Access the application:**
    Open your browser and navigate to [http://localhost:3001](http://localhost:3001).

### Staging

This environment builds the application for a production-like staging environment.

1.  **Start the container:**
    ```bash
    docker compose -f docker/staging/compose.yaml up --build
    ```
2.  **Access the application:**
    Open your browser and navigate to [http://localhost:3002](http://localhost:3002).

### Production

This environment builds the application for production.

1.  **Start the container:**
    ```bash
    docker compose -f docker/production/compose.yaml up --build
    ```
2.  **Access the application:**
    Open your browser and navigate to [http://localhost:3003](http://localhost:3003).

### Stopping Containers

To stop any of the environments, use the `down` command with the corresponding compose file. For example:

```bash
docker compose -f docker/development/compose.yaml down
```

## Architectural Decision Docs

https://finance-blog-cms.vercel.app/