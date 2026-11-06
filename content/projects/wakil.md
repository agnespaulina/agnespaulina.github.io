# Wakil
Flutter · Dart · iOS · Android · Geolocation · Firebase Cloud Messaging · REST API

## Plattformsspecifika utmaningar.
Det här projektet skulle jag ge en framträdande plats i portfolion eftersom det innehåller flera intressanta plattformsspecifika utmaningar.
Vad du gjorde
Du arbetade med en säkerhetsapplikation där en användare i en hotfull situation ska kunna larma och dela sin position med en larmcentral.

## Larmfunktionalitet

Du arbetade med ett larmflöde där användaren kan aktivera ett larm genom en medveten interaktion, följt av PIN-hantering för att öppna eller avbryta larmet.

## Bakgrundspositionering

Ett av de viktigaste områdena var att säkerställa tillförlitlig positionsdelning även när appen inte är aktiv i förgrunden.

### Du arbetade med operativsystemens olika förutsättningar för:
- Bakgrundsexekvering.
- Positionsbehörigheter.
- Uppdateringsintervall.
- Appens livscykel.
- Positionsdelning under pågående larm eller Follow Me-session.
Geografiska områden

### Geografiska polygoner
Du arbetade även med geografiska polygoner för att definiera inkluderade och exkluderade täckningsområden, inklusive hantering av koordinatproblem vid antimeridianen.

### Kommunikation med backend

Du arbetade med pushnotiser genom Firebase Cloud Messaging, inklusive data-meddelanden och kompletterande polling.

**Varför**
Här var huvudutmaningen inte bara att implementera en funktion, utan att säkerställa att den uppförde sig tillförlitligt och förutsägbart på både iOS och Android, trots operativsystemens olika begränsningar.

Det är ett mycket bra exempel på att du förstår skillnaden mellan cross-platform-utveckling och plattformsspecifik funktionalitet.