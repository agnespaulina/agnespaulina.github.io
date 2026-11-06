# Projektsammanfattning: Vanbruun

Projekt: Vanbruun\
Teknik: Flutter, Dart, Stacked (MVVM), Swift, ARKit, Firebase, WebView, Rive\
Plattform: iOS, med Flutter som grund för plattformsövergripande utveckling.

Utifrån den här chatten har du framför allt arbetat med interaktiva 3D-upplevelser, Augmented Reality (AR), prestandaoptimering, resurshantering, applikationsarkitektur och pushnotifikationer.

Det intressanta är att arbetet inte enbart handlat om att implementera funktioner. Du har också undersökt hur olika tekniker påverkar varandra, identifierat problem med livscykelhantering och arbetat med att förbättra applikationens stabilitet.

## 1. Interaktiv produktkonfigurator för smycken

Du har arbetat med en produktkonfigurator där användaren kan anpassa en ring genom flera steg.

Funktionalitet:

- Välja ringmodell och förhandsgranska den i 3D.
- Välja metall och se motsvarande produktbild.
- Välja diamantslipning.
- Ändra diamantens karatstorlek.
- Växla mellan konfigurationssteg utan att förlora valda inställningar.

Teknisk implementation:

Du har byggt gränssnittet med Flutter och Stacked enligt MVVM-arkitektur.

`CustomDesignViewModel` ansvarar för konfigurationens tillstånd, medan separata widgets hanterar presentationen.

Du har använt `IndexedStack` för att bevara tillstånd mellan de olika konfigurationsstegen.

Det gör att exempelvis en 3D-modell inte behöver laddas om varje gång användaren byter flik.

Teknisk utmaning: `IndexedStack` behåller även inaktiva widgets i widgetträdet. Det innebär att resurskrävande komponenter kan fortsätta använda CPU, GPU och minne trots att de inte visas.

Du har därför undersökt hur rendering och andra resurskrävande processer kan aktiveras och avaktiveras beroende på vilket steg användaren befinner sig i.

## 2. Integration av externa 3D-modeller via WebView

Du har integrerat interaktiva 3D-modeller från Unlimited3D i Flutter-applikationen.

Vad du arbetat med:

- Inbäddning av webbaserade 3D-modeller i native WebViews.
- Dynamisk laddning av olika ringmodeller.
- Kommunikation mellan JavaScript och Flutter.
- Hantering av laddningstillstånd via callbacks som `RingReady`.
- Förladdning av 3D-innehåll för att minska upplevd väntetid.
- Hantering av flera WebView-instanser.

Du har även implementerat en `WebViewService` som kan förbereda 3D-innehåll innan användaren navigerar till produktkonfiguratorn.

### Prestandaproblem du identifierat

Vid felsökning visade loggarna att flera WebView-instanser skapades och laddade olika 3D-modeller.

En av WebView-processerna avslutades upprepade gånger:

```
onWebContentProcessDidTerminate
onLoadStart
onLoadStop
RingReady
onWebContentProcessDidTerminate
```

Detta indikerar en återkommande cykel av processavslut och omladdning.

Du undersökte därmed ett problem där WebKit-processer avslutades och återstartades, potentiellt på grund av hög resursförbrukning.

Viktigt för portfolion: Loggarna bekräftar processavsluten, men inte den exakta bakomliggande orsaken eller att problemet blev fullständigt löst.

## 3. Augmented Reality med Apples ARKit

[The Ultimate Guide to Finding Your Perfect Ring Size: From DIY to AI Power!](https://images.openai.com/static-rsc-4/BHSucIX7TPd3U3440tMQ3phzKNZLmKK3ENsUlHIr1ihqNkq-OBKoAIwIsP1BQlQL-k4Gzry6J4zPq7jsSbFoG5VNAM7PGgQ6qTDKZQ1tw_Iqa2_FiQbHTvrmWIr9IUHWAYNbzLSGDl8qkNLnbvHZScM3aa1SXDMOCY2TgyBmEys?purpose=inline)

Du har arbetat med en AR-funktion som använder mobilens kamera för att visualisera en diamant i en verklig miljö.

Implementationen använder `arkit_plugin`, vilket ger Flutter tillgång till Apples native ARKit via plattformskanaler.

Tekniska områden:

- Integration mellan Flutter och iOS ARKit.
- Hantering av `ARKitController`.
- Kameraåtkomst och AR-sessioner.
- Hämtning av kamerans intrinsic-parametrar.
- Dynamisk uppdatering av diamantens egenskaper via `ValueNotifier`.
- Hantering av asynkron initiering och frigöring av resurser.

### Livscykelhantering och stabilitet

Du identifierade att ARKit-pluginets Dart-API saknade en publik `pause()`-metod.

Det innebar att du behövde undersöka andra sätt att hantera AR-sessionens livscykel när användaren växlade mellan olika vyer.

Du stötte också på:

```
LateInitializationError:
Field '_arkit' has not been initialized.
```

Detta uppstod när en `late ARKitController` användes innan den hade initierats.

Du undersökte även native iOS-varningar kopplade till kameran och ARKit:

```
World tracking performance is being affected
by resource constraints [33]
```

Detta är särskilt relevant eftersom applikationen kombinerar flera resursintensiva tekniker: ARKit, WebKit och 3D-rendering.

## 4. Prestandaoptimering och resurshantering

En betydande del av arbetet har handlat om att förstå hur applikationens olika komponenter påverkar prestanda och stabilitet.

Du har undersökt:

- När WebViews skapas, behålls och förstörs.
- Hur `IndexedStack` påverkar komponenternas livscykel.
- Hur AR-sessioner hanteras när användaren byter vy.
- Varför WebKit-processer kan avslutas och återstartas.
- Hur upprepade initieringar kan leda till onödig resursförbrukning.
- Hur asynkrona callbacks kan försöka uppdatera widgets efter att de avmonterats.

Du har också använt debugloggar för att följa komponenternas tillstånd, exempelvis `mounted`, `RingReady` och WebView-laddningshändelser.

Detta är ett arbete som tydligt visar erfarenhet av felsökning över gränsen mellan Flutter och native iOS.

## 5. Rörelsebaserad interaktion och Rive-animationer

Du har implementerat en funktion där användaren kan skaka telefonen för att öppna en särskild animerad overlay.

Teknisk lösning:

- `shake` för att registrera rörelsedata från enhetens sensorer.
- `OverlayEntry` för att presentera innehåll ovanpå befintlig navigation.
- Rive för animerade visuella upplevelser.
- `flutter_animate` för övergångar och fade-effekter.
- `WidgetsBindingObserver` för att följa applikationens livscykel.

Du har även arbetat med att förhindra att rörelsedetekteringen aktiverar overlays när applikationen inte är aktiv.

Det omfattar att stoppa och återuppta sensorlyssnare när appen växlar mellan foreground och background.

Du har dessutom identifierat risken för att flera `ShakeDetector`-instanser skapas och att callbacks kan trigga flera overlays.

## 6. Firebase Cloud Messaging och pushnotifikationer

Du har byggt upp en separat `MessagingService` för att hantera pushnotifikationer.

Funktioner och integrationer:

- Firebase Cloud Messaging (FCM).
- Registrering och hämtning av FCM-token.
- Begäran om användarens notifikationsbehörighet.
- Prenumeration på FCM-topics.
- Mottagning av meddelanden i foreground.
- Registrering av background message handler.
- Hantering av notifikationer under applikationens uppstart.
- Utvärdering av `flutter_local_notifications` för lokalt genererade systemnotifikationer.

### Native iOS-integration

Du har arbetat direkt i `AppDelegate.swift` med:

- Firebase-konfiguration.
- Registrering för APNs.
- Koppling mellan APNs device token och Firebase Messaging.
- `UNUserNotificationCenter`.
- iOS-konfiguration via `Info.plist`.

Du har även undersökt skillnaden mellan att låta iOS presentera systemnotifikationer och att själv skapa lokala notifikationer.

En viktig del av arbetet har varit att förstå hur foreground- och background-notifikationer skiljer sig och hur dubbelnotifikationer kan undvikas.

### Arkitektoniska beslut

Du har separerat notifikationslogiken från gränssnittet genom en dedikerad service.

Du har även infört en mekanism för att buffra meddelanden under uppstarten och hantera dem när applikationen är redo.

Det finns fortfarande detaljer att förbättra, exempelvis att `_notificationsPaused` inte automatiskt hindrar iOS från att visa systembanners när `alert: true` är aktiverat.

## 7. Navigation och tillståndshantering med Stacked

Du har byggt navigation med en `MainPageViewModel` som hanterar applikationens olika huvudsektioner.

Det inkluderar:

- Centraliserad navigationslogik.
- `PageTypes` som enum för olika sidor.
- `IndexedStack` för att bevara tillstånd.
- Anpassad sidomeny med animationer.
- Skydd mot överlappande navigationsoperationer.
- Initiering av resurser vid navigering till specifika vyer.

Du har även arbetat med att separera UI-tillstånd från tjänster som ansvarar för WebView, notifikationer och rörelsedetektering.

## Sammanfattning av teknisk kompetens

| Område               | Vad arbetet visar                                           |
| -------------------- | ----------------------------------------------------------- |
| Flutter & Dart       | Utveckling av interaktiva och tillståndsberoende gränssnitt |
| Stacked / MVVM       | Separation av affärslogik, UI och tjänster                  |
| Swift / iOS          | Native integration och plattformsspecifik konfiguration     |
| ARKit                | Kamerabaserad AR och hantering av AR-sessioner              |
| WebView / JavaScript | Integration av externa 3D-upplevelser                       |
| Firebase             | Pushnotifikationer, APNs och FCM                            |
| Rive                 | Interaktiva animationer                                     |
| Sensorer             | Rörelsestyrda interaktioner                                 |
| Lifecycle management | Hantering av resurser och asynkrona processer               |
| Debugging            | Analys av native loggar och plattformsrelaterade fel        |

## Förslag på projektbeskrivning till din portfolio

### Vanbruun | Interaktiv smyckeskonfigurator med 3D och Augmented Reality

**Teknik:** Flutter, Dart, Stacked (MVVM), Swift, ARKit, WebView, JavaScript, Firebase Cloud Messaging, Rive

Arbetade med utveckling och vidareutveckling av en interaktiv mobilupplevelse för smyckesdesign, där användaren kan konfigurera ringar, förhandsgranska 3D-modeller och visualisera diamanter med Augmented Reality.

Implementerade en flerstegskonfigurator med centraliserad tillståndshantering enligt MVVM. Integrerade externa 3D-modeller via WebView och utvecklade kommunikation mellan webbaserat innehåll och Flutter för att hantera laddningstillstånd och interaktioner.

Arbetade med native iOS-integration genom ARKit för kamerabaserad visualisering av diamanter, inklusive hantering av AR-sessioner, asynkron initiering och plattformsspecifika begränsningar.

Undersökte prestanda- och stabilitetsproblem kopplade till samtidig användning av WebView, 3D-rendering och ARKit. Analyserade resursförbrukning, komponenternas livscykler och återkommande avslut av WebKit-processer för att identifiera möjliga optimeringsåtgärder.

Utvecklade även rörelsestyrda interaktioner med enhetens sensorer, animerade overlays med Rive samt en centraliserad notifikationstjänst med Firebase Cloud Messaging och APNs. Arbetet omfattade hantering av foreground- och background-notifikationer, användarbehörigheter och native iOS-konfiguration.

**Tekniska fokusområden:** Plattformsintegration, interaktiv 3D, AR, tillståndshantering, resurshantering, prestandaanalys och felsökning.

## Vad jag tycker är mest värt att lyfta

För en utvecklarportfolio skulle jag prioritera tre delar:

1. Flutter + native iOS/ARKit: Du har arbetat med funktionalitet som går utanför traditionell Flutter-utveckling och kräver förståelse för iOS egna ramverk.
2. Prestanda och livscykelhantering: Du har analyserat hur flera tunga renderingstekniker påverkar applikationen, snarare än att enbart fokusera på det visuella resultatet.
3. Arkitektur och integrationer: Du har separerat ansvarsområden i tjänster och ViewModels och arbetat med kommunikation mellan Flutter, JavaScript, Firebase och native iOS.

En viktig distinktion: Chatten dokumenterar både implementationer, undersökningar och problem som fortfarande felsöktes. I den slutliga portfolion bör vi skilja på vad du faktiskt färdigställde och vad du analyserade eller påbörjade.

Det skulle också vara värdefullt att komplettera med den ursprungliga anledningen till varje tekniskt beslut, vilka alternativ du övervägde och vilket resultat du uppnådde. Då blir Vanbruun inte bara en beskrivning av funktioner, utan ett konkret exempel på hur du arbetar som systemutvecklare och löser tekniska problem.