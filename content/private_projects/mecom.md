# Mecom
Flutter · Dart · Drift/SQLite · Supabase · PostgreSQL · Firebase · Local-first

Du utvecklade en applikation för att organisera produkter i personliga kataloger med hjälp av bland annat varumärken, kategorisering och filtrering.

Den tekniska arkitekturen bygger på att appen kan arbeta mot en lokal databas och synkronisera med en server.

## Lokal datalagring

Du arbetade med Drift och SQLite som lokal databas, där användarens förändringar kan sparas utan att varje åtgärd behöver invänta ett nätverksanrop.

## Synkronisering

Du arbetade med en arkitektur där lokala ändringar registreras och därefter synkroniseras med Supabase.

### Vi har bland annat diskuterat:
- InventoryService som central väg för förändringar av inventariedata.
- CloudSyncService för synkronisering.
- Atomiska databastransaktioner som sparar relaterade objekt och synkroniseringsoperationer tillsammans.
- Outbox-mönster för att hålla reda på förändringar som ännu inte skickats till servern.
- Återanvändning av produktidentiteter vid import.
- Hantering av lokala och servergenererade identifierare.
- Batch-operationer och serverbaserade RPC-funktioner.

### Varför det är ett starkt portfolio-case
Det här visar hur du resonerar kring dataintegritet, offline-stöd och konsekvent synkronisering mellan olika datakällor.

Ett exempel är beslutet att spara en förändring och dess tillhörande synkroniseringsoperation i samma lokala transaktion.

Syftet är att undvika att användarens data uppdateras utan att systemet samtidigt registrerar att förändringen behöver synkroniseras.

Det är ett tydligt tekniskt designbeslut som lämpar sig mycket väl för ett portfolio-case.