# Backend AbilityLink

De backend van AbilityLink wordt gemaakt doormiddel van een Microservices Architectuur.
Hierbij wordt er gebruik gemaakt van een API Gateway als toegang tot de andere services.
Dit document beschrijft de technische opbouw van de backend.
Dit omvat zowel de technische beschrijving als eventuele routing en andere afhankelijkheden.
Ook zal er een beschrijving worden geleverd over de samenwerking tussen de verschillende services.

## Project

AbilityLink is een mobiele app die tot doel heeft de communicatie tussen zorgbegeleiders en mensen met beperkingen te vereenvoudigen en hen te ondersteunen om meer te bewegen.

De app is ontworpen met de volgende belangrijke doelstellingen in gedachten:

AbilityLink is specifiek ontworpen om toegankelijk te zijn voor mensen met diverse beperkingen. De app biedt aanpasbare functies en ondersteunt verschillende communicatiemodi om een inclusieve ervaring te waarborgen.

Zorgplanning en Activiteitenbeheer: De app bevat functies voor het plannen en beheren van activiteiten. Zorgbegeleiders kunnen activiteiten toewijzen aan groepen, en zowel begeleiders als deelnemers kunnen deze activiteiten zien in hun agenda. Dit bevordert een georganiseerde en gestructureerde benadering van zorg en stimuleert de deelnemers om actiever deel te nemen aan de activiteiten.

Smartwatch Integratie met NFC: AbilityLink maakt gebruik van smartwatch, waardoor gebruikers kunnen inchecken bij activiteiten met behulp van NFC-technologie. Dit draagt bij aan een vloeiende en moeiteloze deelname aan geplande activiteiten.

## Overview

De backend van het project bestaat op het moment uit drie microservices.
De microservices worden gedraait door middel van Docker Compose versie 3.8.
De volgende services zijn op moment gedefiniëerd.

Microservice | Technologie                  | Database | Port | Versie
-------------|------------------------------|----------|------|-------
Gateway      | NodeJS, Express, Axios, Cors | Json     | 3000 | 1.0.0
Events       | NodeJS, Express              | Sqlite   | 3010 | 0.1.0
Handicaps    | NodeJS, Express              | Sqlite   | 3015 | 1.0.0

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

## Handicaps

- Node 20.10.0

- Cors (2.8.5),
- Express (4.18.2)
- Sqlite3 (5.1.6)

- Jest (29.7.0)
- Nodemon (3.0.1)