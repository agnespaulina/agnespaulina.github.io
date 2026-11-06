# Viking

## Mobilapplikation för medlemskap, vägassistans och försäkringar

Du arbetade med **betalningsflöden** som behövde hantera flera olika förhållanden mellan användare, produkter, fakturor och försäkringsperioder.

**Exempel på sådant vi diskuterat:**

- Beräkning av produktpriser, rabatter och betalningsperioder.
- Hantering av familjemedlemmar, försäkringstagare och förmånstagare.
- Betalningsstatusar, krediteringar, förfallodatum och misslyckade kortbetalningar.
- Utveckling av en centraliserad ProductPriceResolver och PriceBreakdown.
- Regler för när användare får lägga till familjemedlemmar eller genomföra produktförändringar.
- Hantering av medlemskapsuppsägningar, ångrade köp och ekonomiska konsekvenser.

**Varför:**
För att minska risken för inkonsekventa prisberäkningar och säkerställa att olika delar av applikationen följer samma affärsregler.

## Användarflöden och gränssnitt

Du **vidareutvecklade** bland annat produktöversikter, transaktionsdetaljer, familjehantering och verifiering av personuppgifter.

Ett konkret exempel är flödet för verifiering av användaruppgifter. Där arbetade du med **tidsbaserade kontroller** som avgör när en användare behöver granska sina kontaktuppgifter, samt ett flöde för att bekräfta eller uppdatera dessa.

## Plattformsspecifik funktionalitet

**Du arbetade med**:

- Pushnotiser och navigering till rätt vy utifrån notifikationstyp.
- Deep links och appens livscykel.
- PDF-visning och nedladdning på iOS och Android.
- Android-krascher kopplade till native-bibliotek och grafikrendering.
- iOS UIScene-migrering.
- Firebase Crashlytics och analys av fel i produktionsmiljö.
  Testning och release

Du arbetade också med **widgettester**, mockning av ViewModels och beroenden, felsökning av byggmiljöer samt publicering via App Store Connect och Google Play Console.

---

# Specifika utföranden

## Asynchronous Operation Coordination & Race Condition Prevention

**Projekt:** Viking Assistance  
**Teknik:** Flutter, Dart, Futures, Native SDK Integration, Firebase Crashlytics

**Utmaning**

Integrationen med Intercom omfattade flera asynkrona operationer som delade samma autentiserings- och sessionstillstånd. Inloggning, användarsynkronisering, push-tokenregistrering, Messenger och utloggning behövde samordnas för att undvika konkurrerande operationer och inkonsekvent användaridentitet.

**Lösning**

Jag implementerade en centraliserad, exklusiv operationskö som sekventiellt hanterar Intercom-relaterade SDK-anrop.

**Utrag av kod**

```dart
/// Fire-and-forget Intercom login/attribute sync.
///
/// Safe to call whenever an authenticated Viking user is available. Does not
/// throw; Intercom failures are logged and must not fail Viking flows.
void enqueueIntercomUserAttributeSync() {
  try {
    final intercom = locator<IntercomService>();
    unawaited(
      intercom.syncUserAttributesIfNeeded().catchError(
        (Object error, StackTrace stackTrace) {
          debugPrint(
            '[INTERCOM] Failed to synchronize user attributes: $error',
          );
          return IntercomTaskStatus.failed;
        },
      ),
    );
  } catch (error) {
    // Locator may not have Intercom registered in some test setups.
    debugPrint('[INTERCOM] enqueue sync skipped: $error');
  }
}
```

## Native Platform Integration, Authentication & Asynchronous Coordination.

### Säker och plattformsoberoende hantering av pushnotiser

**Projekt:** Viking Assistance  
**Teknik:** Flutter, Dart, Swift, Kotlin, Firebase Cloud Messaging, APNs, Intercom SDK, MethodChannels

**Utmaning**

Appen hanterade pushnotiser från både Vikings backend och Intercom. Skillnader mellan iOS och Android orsakade problem vid kallstart, navigering och presentation av externa SDK-gränssnitt.

En särskild säkerhetsutmaning uppstod eftersom pushnotiser kunde fortsätta levereras till en enhet efter att den avsedda mottagaren loggat ut. Det skapade en risk att en annan användare kunde försöka öppna personligt innehåll via en notis.

**Lösning**

Jag utvecklade en centraliserad arkitektur för att samordna pushnotiser, autentisering, applikationens livscykel och navigation.

Arbetet omfattade:

- En gemensam koordinator för hantering av notistryckningar från flera källor.
- Autentiseringskontroller innan navigation till skyddade delar av applikationen.
- Hantering av väntande och föråldrade notisåtgärder vid inloggning, utloggning och kontobyten.
- En native Swift-brygga som köar APNs-notiser tills Flutter är redo och bevarar Intercoms ursprungliga payload fram till presentation.
- En native Kotlin-integration som hanterar Androids Activity-stack och säkerställer att användaren kan återvända till appen efter att Intercom stängts.
- Livscykelövervakning, deduplicering, timeout-hantering och diagnostik för att minska risken för konkurrerande operationer och felaktig navigation.

#### 1. Swift: Vänta tills Flutter är redo

Det här visar hur problemet löstes med att en pushnotis kunde öppnas innan Flutter hade hunnit initieras.

```swift

func enqueueOrForward(
  userInfo: [AnyHashable: Any],
  trustedIntercomPush: Bool? = nil
) {
  precondition(Thread.isMainThread)

  let tap = PendingTap(
    userInfo: userInfo,
    trustedIntercomPush: trustedIntercomPush
  )

  if isDartHandlerReady, canDeliver {
    forward(tap)
  } else {
    pending.append(tap)
  }
}
```

Du Separerade mottagningen av en notis från dess hantering. Om Dart ännu inte är redo köas notisen i stället för att gå förlorad eller behandlas för tidigt.

Det visar förståelse för asynkron kommunikation och appens livscykel.

#### 2. Kotlin: Korrekt Activity-stack för Intercom

Det här är kanske det mest visuellt begripliga exemplet eftersom det löser ett väldigt konkret Android-problem.

```kotlin
val stack = TaskStackBuilder.create(context).apply {
  addNextIntent(
    Intent(context, MainActivity::class.java).apply {
      action = Intent.ACTION_MAIN
      addCategory(Intent.CATEGORY_LAUNCHER)

      flags = Intent.FLAG_ACTIVITY_NEW_TASK or
        Intent.FLAG_ACTIVITY_CLEAR_TOP or
        Intent.FLAG_ACTIVITY_SINGLE_TOP or
        Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
    }
  )
}

intercomPushClient.handlePushWithCustomStack(
  application,
  message,
  stack
)
```

**Vad koden demonstrerar:** Du arbetade direkt med Androids navigeringsmodell och ändrade hur en tredjeparts-SDK startades.

Tidigare kunde Intercom öppnas som ensam Activity. När användaren tryckte Back avslutades appen. Med en korrekt back stack kan användaren återvända till Viking.

Det här är ett starkt exempel på native Android-utveckling i ett Flutter-projekt.

#### 3. Dart: En gemensam ingång för notisnavigation

```dart
Future<void> routeNotificationTap(
  Map<String, dynamic> data,
) async {
  await locator<NotificationActionCoordinatorService>()
      .handleNotificationTap(data);
}
```

**Vad koden demonstrerar:** I stället för att låta flera olika push-hanterare själva bestämma navigationen samlade du beslutsfattandet i en koordinator.

Det gör det möjligt att hantera autentisering, livscykel och konkurrerande notisåtgärder på ett centralt ställe.

Just det här kodblocket är däremot väldigt enkelt. Jag skulle helst komplettera det med ett mer substantiellt utdrag ur NotificationActionCoordinatorService, exempelvis där den avgör om en notis ska vänta på autentisering, avbrytas eller fortsätta.

#### 4. Säkerställ att notisen tillhör rätt användare

Det här är kärnan i scenariot du beskrev med en lånad telefon.

```dart

bool _notificationMatchesCurrentContext(
  VikingPushNotification notification,
) {
  final expectedUserId = notification.userId;

  if (expectedUserId != null) {
    final currentUserId = _users.currentUser?.id;

    if (!_users.isLoggedIn ||
        currentUserId == null ||
        currentUserId != expectedUserId) {
      return false;
    }
  }

  final expectedOrganizationId =
      notification.organizationId;

  if (expectedOrganizationId != null) {
    final currentOrganizationId =
        _settings.organizationId;

    if (currentOrganizationId.isEmpty ||
        currentOrganizationId != expectedOrganizationId) {
      return false;
    }
  }

  return true;
}
```

Förkortat utdrag ur din implementation. Diagnostikloggning är borttagen för läsbarhet. Pasted text(1).txt
Det här är ett starkt portfolioexempel eftersom du kontrollerar både användaridentitet och organisation mot notisens ursprungliga data.

En viktig detalj är att koden endast kontrollerar de restriktioner som faktiskt finns i payloaden. Därför bör vi också visa att din lösning hanterar notiser som inte går att verifiera, i stället för att beskriva denna metod som ett komplett behörighetssystem.

#### 2. Kontrollera igen precis före navigation

Det här tycker jag är den mest tekniskt intressanta delen.

```dart

bool _isVikingCommitStillValid(
  PendingNotificationAction action,
) {
  if (action.phase ==
      NotificationActionPhase.cancelled) {
    return false;
  }

  if (_pending?.id != action.id) {
    return false;
  }

  if (_lifecycleReader() !=
      AppLifecycleState.resumed) {
    return false;
  }

  if (action.requiresAuthentication &&
      !_users.isLoggedIn) {
    return false;
  }

  final notification = action.notification;

  return notification is! VikingPushNotification ||
      _notificationMatchesCurrentContext(
        notification,
      );
}

```

Förkortat utdrag med samma kontrollflöde som originalet.

Här visar du något som är lätt att missa vid asynkron utveckling: att en användare var behörig när en operation startade innebär inte att användaren fortfarande är behörig när den slutförs.

Du kontrollerar därför att åtgärden fortfarande är aktuell, att appen är aktiv och att rätt användare fortfarande är inloggad.

Detta är ett tydligt exempel på hur du förebygger race conditions och felaktig navigation.

#### 3. State machine: hantera flera notistryckningar

En tredje del som är värd att nämna är att du modellerade notisåtgärder med explicita tillstånd.

```dart
enum NotificationActionPhase {
  queued,
  preparing,
  waitingForAuth,
  committing,
  executing,
  completed,
  cancelled,
}
```

Detta är mer än en statuslista. I \_replaceOrFollowUp() använder du tillstånden för att avgöra om en ny notis får ersätta en tidigare åtgärd eller måste vänta tills den redan påbörjade navigationen har slutförts.

Du har alltså byggt en liten tillståndsmaskin med en definierad gräns mellan avbrytbara operationer och operationer som redan har genomförts.

**Resultat**

Lösningen adresserade flera plattformsspecifika problem med pushnotiser och Intercom och skapade en mer konsekvent navigeringsupplevelse på iOS och Android.

Genom att separera mottagning, autentiseringskontroll och presentation kunde appen hantera notisåtgärder utifrån aktuell användarsession i stället för att automatiskt öppna den destination som notisen angav.

Lösningen omfattade:

- Sekventiell exekvering av operationer mot ett gemensamt sessionstillstånd.
- Timeout-hantering för att undvika att en operation blockerar kön obegränsat.
- Generationsbaserad validering för att förhindra att föråldrade asynkrona operationer uppdaterar delar av applikationens tillstånd.
- Synkronisering av användarattribut och push-token med kontroller av aktuell användaridentitet.
- Integrering med applikationens lifecycle för säker presentation av Intercom-gränssnitt och pushnotiser.
- Felrapportering och diagnostik via Firebase Crashlytics.

**Tekniskt värde**

## Lösningen skapade en gemensam mekanism för att koordinera asynkrona SDK-operationer och minska risken för race conditions, felaktig sessionshantering och inkonsekvent användartillstånd.

### Centralizing Business Logic & Reducing Technical Debt

**Project:** Viking Assistance  
**Technologies:** Flutter, Dart, MVVM, Unit Testing, AI-assisted Development

**Challenge**

The application's pricing and payment logic had evolved into multiple implementations distributed across views, view models and utility functions. Different parts of the application could apply different rules when calculating product prices, discounts and billing periods.

This made the codebase difficult to maintain and debug. It also introduced challenges when working with AI-assisted development tools, which frequently needed to search large portions of the repository to identify the relevant calculation paths.

**Solution**

I initiated a refactoring effort to establish clearer sources of truth for pricing and payment-related business logic.

I introduced a `ProductPriceResolver` with an explicit priority order for selecting the correct price source, together with a UI-independent `PriceBreakdown` value object.

I also introduced `PaymentSummary` to provide a consistent representation of payment information across Wallet and transaction details, while preserving backend-owned balances as authoritative.

To handle product renewals correctly, I implemented a `TemplateVersionResolver` that determines the applicable template version based on the current billable period.

The new components were designed to be independently testable and documented with clear ownership boundaries, integration points and migration guidance.

**Outcome**

The refactoring established a more consistent and testable foundation for pricing and payment presentation in the migrated parts of the application.

It reduced reliance on duplicated UI-level calculations and made the relevant business rules easier to locate, understand and maintain.

The clearer architecture also improved the conditions for AI-assisted development by reducing ambiguity about where pricing rules should be implemented.

**Engineering focus:** Single Source of Truth, Separation of Concerns, Domain Modeling, Refactoring, Testability, Maintainability.

---

### Centralizing Business Logic & Reducing Technical Debt

**Project:** Viking Assistance  
**Technologies:** Flutter, Dart, MVVM, Unit Testing, AI-assisted Development

**Challenge**

The application's pricing and payment logic had evolved into multiple implementations distributed across views, view models and utility functions. Different parts of the application could apply different rules when calculating product prices, discounts and billing periods.

This made the codebase difficult to maintain and debug. It also introduced challenges when working with AI-assisted development tools, which frequently needed to search large portions of the repository to identify the relevant calculation paths.

**Solution**

#### From Fragmented Price Calculations to a Single Source of Truth

The challenge

Pricing logic was distributed across multiple views, utility functions and calculation paths. This created inconsistent pricing behavior, complicated debugging and made AI-assisted code analysis unnecessarily expensive.

My approach

I introduced a centralized pricing resolver with explicit source precedence, immutable price value objects and a reusable payment summary model. The refactoring separated business rules from UI presentation and enabled isolated unit testing.

Key engineering decisions

- Prioritized backend-issued billing specifications over potentially outdated product costs.
- Resolved historical product prices using the corresponding payment ID.
- Preserved backend-owned payment balances rather than recalculating them in the client.
- Introduced dependency injection for service-backed values in payment summaries.
- Documented migration boundaries and remaining legacy implementations.
  Outcome

Established a consistent pricing foundation for the migrated payment flows, improved testability and made business logic easier to locate for both developers and AI coding agents.

I initiated a refactoring effort to establish clearer sources of truth for pricing and payment-related business logic.

I introduced a `ProductPriceResolver` with an explicit priority order for selecting the correct price source, together with a UI-independent `PriceBreakdown` value object.

I also introduced `PaymentSummary` to provide a consistent representation of payment information across Wallet and transaction details, while preserving backend-owned balances as authoritative.

To handle product renewals correctly, I implemented a `TemplateVersionResolver` that determines the applicable template version based on the current billable period.

The new components were designed to be independently testable and documented with clear ownership boundaries, integration points and migration guidance.

### 1. Före: prislogik direkt i ViewModel

Din ursprungliga implementation:

```dart
String get priceString {
  if (product != null) {
    final Discount? discount = _discountService.data
        .firstWhereOrNull((d) => d.id == _product!.discountId);

    if (product!.periods != null &&
        product!.periods!.isNotEmpty &&
        product!.paymentSpecifications != null &&
        product!.paymentSpecifications!.isNotEmpty) {
      return calculatePremiumReadable(
        product!,
        discount: discount,
      );
    }
  }
  return "-";
}
```

Koden är inte dålig isolerat sett. Problemet är hur ansvaret fördelas i applikationen.

Här behöver ViewModel:

- Hämta rabatten via en service.
- Kontrollera vilka produktdata som finns.
- Välja om en prisberäkning ska genomföras.
- Anropa en generell beräkningsfunktion.
  Samtidigt framgår det inte av anropet vilken faktureringsperiod eller betalning priset avser.

Det betyder inte att calculatePremiumReadable() nödvändigtvis räknade fel. Men det blir svårt att säkerställa att alla vyer använder samma regler när flera beräkningsvägar existerar.

### 2. Efter: ProductPriceResolver

Den nya implementationen är betydligt mer uttrycklig.

```dart
PriceBreakdown resolve(Product product, {String? paymentId}) {
  final PeriodicPaymentSpecification? spec =
      product.periodicPaymentSpecificationForPayment(paymentId);

  final InsurancePeriod? latestPeriod =
      product.getLatestInsurancePeriod();

  final Decimal? billablePeriodPrice =
      latestPeriod is BillableInsurancePeriod
          ? latestPeriod.price
          : null;

  return resolveFromComponents(
    cost: product.purchasedCost,
    appliedDiscount: product.discount,
    spec: spec,
    billablePeriodPrice: billablePeriodPrice,
    currency: spec?.currency ?? product.currency,
    paymentSchedule: product.paymentSchedule.enumValue,
    rawPriceFallback: product.price,
  );
}

```

Från product_price_resolver.dart. Pasted markdown (2)(2).md
Här ser vi tre viktiga förbättringar.

Betalningskontext: paymentId gör att resolvern kan hitta en specifikation kopplad till just den betalningen, vilket är viktigt för historiska kvitton.

Separerade ansvar: resolve() hämtar och normaliserar produktdata medan resolveFromComponents() fattar själva prisbeslutet.

Testbarhet: Beräkningskärnan kan testas med olika kombinationer av specifikationer, periodpriser, kostnader och rabatter utan att behöva skapa en ViewModel.

### 3. Det bästa kodblocket: prioriteringslogiken

Det här skulle jag faktiskt välja som huvudexempel i portfolion.

```dart
if (spec != null) {
  final Decimal effective = spec.amount;
  final Decimal regular = cost?.price ?? effective;

  return PriceBreakdown(
    regularPrice: regular,
    effectivePrice: effective,
    currency: currency,
    paymentSchedule: paymentSchedule,
    source: PriceSource.billedSpec,
  );
}

if (billablePeriodPrice != null) {
  final Decimal regular = billablePeriodPrice;
  final Decimal effective = _applyDiscount(
    regular: regular,
    appliedDiscount: appliedDiscount,
    campaignDiscount: cost?.discount,
  );

  return PriceBreakdown(
    regularPrice: regular,
    effectivePrice: effective,
    currency: currency,
    paymentSchedule: paymentSchedule,
    source: PriceSource.billablePeriod,
  );
}
```

Två av fyra prioriterade grenar ur resolveFromComponents(). Pasted markdown (2)(2).md
Det fina här är att man kan läsa själva affärsregeln i koden:

1. Finns en faktureringsspecifikation för betalningen? Använd dess belopp.
2. Annars, finns ett pris för den fakturerbara perioden? Använd det och tillämpa relevant rabatt.
3. Annars, använd produktens köpta template-kostnad.
4. Om ingen av dessa finns, använd fallback-priset.
   Det är en explicit prioriteringskedja, inte ett antal utspridda antaganden.
5. En detalj jag särskilt gillar: historiska betalningar
   I PaymentSummary hittade jag dessutom något som stärker caset.

```dart
final List<Product> childProducts =
    (childrenResolver?.call(product) ?? const <Product>[])
        .where(
          (child) =>
              child.periodicPaymentSpecificationForPayment(
                payment.id,
              ) != null,
        )
        .toList();

final List<PaymentProductLine> childLines =
    childProducts.map((child) => lineFor(child)).toList();

return lineFor(product, children: childLines);
```

Ur payment_summary.dart, lätt omformaterat. Pasted markdown (3).md
Det här löser ett annat viktigt problem: en familjemedlem som läggs till senare ska inte automatiskt synas på en äldre faktura.

I stället för att utgå från vilka familjemedlemmar som finns idag kontrollerar du vilka barnprodukter som faktiskt hade en betalningsspecifikation kopplad till den aktuella betalningen.

Det visar förståelse för skillnaden mellan nuvarande produktstatus och historisk faktureringsdata.
**Outcome**

The refactoring established a more consistent and testable foundation for pricing and payment presentation in the migrated parts of the application.

It reduced reliance on duplicated UI-level calculations and made the relevant business rules easier to locate, understand and maintain.

The clearer architecture also improved the conditions for AI-assisted development by reducing ambiguity about where pricing rules should be implemented.

**Engineering focus:** Single Source of Truth, Separation of Concerns, Domain Modeling, Refactoring, Testability, Maintainability.

---

---

### AI-Assisted Development, Automated Testing & Release Quality

To improve development efficiency and maintain consistent quality standards, I designed structured workflows for AI-assisted testing and release verification using Cursor.

The testing workflow analyzes code changes and their potential impact, identifies existing test coverage and regression risks, and guides the creation or maintenance of automated tests. It prioritizes observable behavior over implementation details and explicitly prevents tests from being weakened simply to make failing implementations pass.

I introduced decision gates for ambiguous business requirements, requiring the AI agent to identify conflicting expectations and request clarification rather than independently redefining intended behavior.

I also developed a read-only release verification workflow covering Git changes, build configuration, static analysis, automated tests, generated code, sensitive logging and release-specific requirements.

The workflows distinguish between automated verification, manual quality assurance and release-blocking issues, while requiring explicit approval before potentially destructive operations, builds or distribution.

**Engineering focus:** AI-Assisted Development, Test Strategy, Regression Prevention, Quality Gates, Release Management, Developer Tooling.

## Önskemål om innehåll

Det jag skulle lyfta i portfolion
Viking bör visa att du kan ta ansvar för en produktionsapp med komplex affärslogik, inte bara implementera enskilda skärmar.

Ett särskilt starkt case är hur du arbetade med prisberäkning och betalningsregler. Där kan vi beskriva problemet med distribuerad logik, hur du identifierade gemensamma regler och hur du strukturerade implementationen för att göra den mer konsekvent och underhållbar.

---
