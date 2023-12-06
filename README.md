# Backend AbilityLink

De backend van AbilityLink wordt gemaakt doormiddel van een Microservices Architectuur.
Hierbij wordt er gebruik gemaakt van een API Gateway als toegang tot de andere services.
Dit document beschrijft de technische opbouw van de backend.
Dit omvat zowel de technische beschrijving als eventuele routing en andere afhankelijkheden.
Ook zal er een beschrijving worden geleverd over de samenwerking tussen de verschillende services.

## Project

[TODO add project beschrijving]

## Overview

De backend van het project bestaat op het moment uit drie microservices.
De microservices worden gedraait door middel van Docker Compose versie 3.8.
De volgende services zijn op moment gedefiniëerd.

Microservice | Technologie                  | Database | Port | Versie
-------------|------------------------------|----------|------|-------
Gateway      | NodeJS, Express, Axios, Cors | Json     | 3000 | 1.0.0
Events       | NodeJS, Express              | Sqlite   | 3010 | 0.1.0

De microservices communiceren met de backend door middel van een API Gateway.
In het uiteindelijke project zal een horloge / armband gebruikt worden die communiceerd met de front-end.

![Component Diagram](./docs/components.png)

## Gateway

- Node 18.9.0

- Jest (29.7.0)
- Nodemon (3.0.1)

- Axios (1.6.2)
- Cors (2.8.5)
- Express (4.18.2)

## Events

- Node 18.9.0

- Cors (2.8.5)
- Express (4.18.2)
- Sqlite3 (5.1.6)

- Nodemon (3.0.1)
- Jest (29.7.0)