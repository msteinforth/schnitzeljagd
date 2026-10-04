# PRD: Schnitzeljagd-App für Kindergeburtstage

| | |
|---|---|
| **Status** | Entwurf v0.1 |
| **Datum** | 04.10.2026 |
| **Owner** | Matthias Steinforth |
| **Arbeitstitel** | „Schnitzeljagd" |

---

## 1. Zusammenfassung

Eine Web-App, mit der Eltern eine ortsbasierte Schnitzeljagd für einen Kindergeburtstag planen und durchführen. In einer **Admin-Oberfläche** legt die Spielleitung einen Startpunkt und weitere Stationen auf Google Maps fest und hinterlegt pro Station ein Rätsel. Jede richtige Antwort führt die Gruppe zur nächsten Station, falsche Antworten führen entweder an einen falschen Ort oder werden direkt als falsch zurückgemeldet.

Die Kindergruppe spielt in einer **mobilen Web-App im Browser** (keine Installation nötig). Die App wird über **Themes** (z. B. Ritter, Dinos, Piraten) passend zum Motto gestaltet, kann **Videos** in den Rätselablauf einbinden, bietet eine **Hilfe-Funktion** und einen **Chat** mit den Eltern. Die Eltern sehen die Gruppe währenddessen per **Live-Tracking** auf einer Karte.

---

## 2. Problem & Chance

**Problem**
- Eine gute Schnitzeljagd vorzubereiten ist aufwändig: Zettel schreiben, verstecken, Wege ablaufen, am Tag selbst hinterherlaufen oder ständig telefonieren.
- Papier-Schnitzeljagden lassen sich kaum anpassen (Wetter, zu schwer, Gruppe verläuft sich).
- Eltern, die nicht mitlaufen, wissen nicht, wo die Kinder gerade sind – das ist die größte Sorge.
- Bestehende Geocaching- oder Rallye-Apps sind für Erwachsene, Teams oder Unternehmen gemacht, nicht für 6- bis 12-Jährige und nicht für ein Geburtstagsmotto.

**Chance**
- Fast jede Familie hat ein Smartphone, das die Gruppe mitnehmen kann.
- Mit einem digitalen Ablauf lassen sich Inhalte wiederverwenden, motivisch gestalten (Videos, Themes) und während des Spiels steuern.

---

## 3. Ziele und Nicht-Ziele

### Ziele
1. **Schnell planen:** Eine Schnitzeljagd mit 5 Stationen lässt sich in unter 45 Minuten anlegen.
2. **Selbstständig spielen:** Die Kindergruppe kommt ohne Erwachsene vom Start bis zum Ziel.
3. **Sicherheit für Eltern:** Die Eltern wissen jederzeit, wo die Gruppe ist und ob sie Hilfe braucht.
4. **Erlebnis:** Durch Themes und Videos fühlt sich die Schnitzeljagd wie ein Abenteuer an und nicht wie ein Formular.
5. **Keine Hürde beim Start:** Die Spieler-App läuft ohne Installation und ohne Konto im mobilen Browser.

### Nicht-Ziele (für v1)
- Native iOS-/Android-Apps.
- Mehrere konkurrierende Teams in derselben Jagd (siehe Ausblick).
- Ein öffentlicher Marktplatz zum Teilen oder Verkaufen von Schnitzeljagden.
- AR-Funktionen und Indoor-Navigation.
- Tracking im Hintergrund bei gesperrtem Bildschirm (technisch im Browser nicht verlässlich möglich, siehe Abschnitt 11).

---

## 4. Zielgruppen & Personas

| Persona | Rolle | Bedürfnisse |
|---|---|---|
| **Sandra, 38, Mutter** | Spielleitung / Admin | Will mit wenig Aufwand eine tolle Jagd planen, Inhalte am Laptop oder Handy pflegen, am Tag selbst den Überblick behalten und eingreifen können. |
| **Tom, 41, Vater** | Beobachter (zweiter Elternteil, Helfer) | Will die Gruppe live auf der Karte sehen und Nachrichten beantworten, ohne selbst die Jagd gebaut zu haben. |
| **Kindergruppe, 6–12 Jahre** | Spieler | Will Abenteuer erleben, Rätsel lösen und schnell wissen, wohin es weitergeht. Braucht große Bedienelemente, wenig Text und Vorlese- bzw. Videoinhalte. |
| **Begleitperson (optional)** | Trägt das Handy bei jüngeren Kindern | Will, dass die Kinder selbst rätseln, aber bei Problemen schnell Hilfe holen können. |

**Annahme:** Pro Jagd gibt es genau **ein Spielgerät** (Smartphone der Gruppe). Es wird von einem älteren Kind oder einer Begleitperson getragen.

---

## 5. Begriffe

| Begriff | Bedeutung |
|---|---|
| **Jagd** | Eine geplante Schnitzeljagd mit Titel, Theme, Stationen und Rätseln. |
| **Station** | Ein Ort auf der Karte (Lat/Lng + Ankunftsradius). Es gibt die Typen *Start*, *Zwischenstation*, *Falscher Ort* und *Ziel/Schatz*. |
| **Rätsel** | Eine Aufgabe an einer Station mit einer oder mehreren Antwortmöglichkeiten. |
| **Antwort** | Eine mögliche Lösung. Jede Antwort hat eine **Folge**: *weiter zu Station X*, *falscher Ort Y* oder *„Das war leider falsch"*. |
| **Durchlauf** | Eine konkrete Durchführung einer Jagd an einem Termin, mit Spielgerät, Positionsverlauf und Chat. Eine Jagd kann mehrfach durchgeführt werden. |
| **Spielleitung** | Erwachsene, die die Jagd erstellt haben und den Durchlauf steuern. |
| **Beobachter** | Weitere Erwachsene mit Lesezugriff auf Live-Karte und Chat. |
| **Hinweis (Tipp)** | Vorab hinterlegte, gestufte Hilfe zu einem Rätsel. |

---

## 6. User Journeys

### 6.1 Planung (Admin, vor dem Geburtstag)
1. Sandra registriert sich und legt die Jagd „Ritter Leos Schatz" an.
2. Sie wählt das Theme **Ritter**.
3. Auf der Google-Karte setzt sie den **Startpunkt** (z. B. die eigene Haustür) und 5 weitere **Stationen** per Klick oder Adresssuche.
4. Pro Station legt sie ein **Rätsel** an: „Wie viele Zinnen hat die Burg auf dem Bild?" mit den Antworten *4 → Station 2*, *6 → falscher Ort „Drachenhöhle"*, *8 → „Das war leider falsch"*.
5. Sie lädt ein **Intro-Video** hoch, in dem „der König" die Mission erklärt, und ein Video, das nach Station 3 abgespielt wird.
6. Sie hinterlegt pro Rätsel zwei **Tipps**.
7. Im **Testmodus** spielt sie die Jagd am Sofa durch (ohne GPS) und kontrolliert den Ablauf in der **Flussansicht**.
8. Sie lädt Tom als **Beobachter** ein.

### 6.2 Durchführung (Geburtstag)
1. Sandra startet einen **Durchlauf** und zeigt den Kindern den **QR-Code**. Das Gruppen-Handy scannt ihn, die Spieler-App öffnet sich im Theme.
2. Die Kinder geben ihren Gruppennamen ein, erlauben den Standortzugriff und sehen das Intro-Video.
3. Die App navigiert zur Station 1: Karte mit eigener Position, Ziel, Entfernung und Richtungspfeil („Noch 120 m").
4. Bei Ankunft (Geofence) erscheint das Rätsel. Die Kinder antworten.
   - **Richtig:** Erfolgsanimation, dann Navigation zur nächsten Station.
   - **Falscher Ort:** Die App navigiert zur „Drachenhöhle". Dort erklärt eine Nachricht, dass sie sich geirrt haben, und schickt sie zurück zum Rätsel.
   - **Direkt falsch:** „Das war leider falsch, versucht es noch einmal!"
5. Kommen die Kinder nicht weiter, tippen sie auf **„Hilfe"**: zuerst Tipp 1, dann Tipp 2, danach „Eltern fragen". Sandra bekommt eine Benachrichtigung.
6. Über den **Chat** schickt Sandra eine Nachricht oder ein Foto.
7. Tom sieht zuhause auf der **Live-Karte**, dass die Gruppe Station 4 erreicht hat, und bereitet den Kuchen vor.
8. Am **Ziel** erscheint die Schatz-Animation mit Abschlussvideo und Urkunde.

---

## 7. Funktionale Anforderungen

Priorität: **M** = Must (MVP), **S** = Should, **C** = Could.

### 7.1 Konto & Zugriff

| ID | Anforderung | Prio |
|---|---|---|
| ACC-1 | Registrierung und Login der Spielleitung per E-Mail und Passwort oder Magic Link. | M |
| ACC-2 | Eine Spielleitung kann mehrere Jagden verwalten (anlegen, duplizieren, archivieren, löschen). | M |
| ACC-3 | Spielleitung kann **Beobachter** per Einladungslink hinzufügen (Rechte: Live-Karte, Chat, Hilfe beantworten; keine Bearbeitung). | S |
| ACC-4 | Die Spieler-App benötigt **kein Konto**. Der Zugang erfolgt über einen geheimen Durchlauf-Link bzw. QR-Code (nicht erratbares Token). | M |
| ACC-5 | Die Spielleitung kann den Zugang eines Durchlaufs jederzeit sperren oder neu erzeugen. | S |
| ACC-6 | Login mit Google oder Apple. | C |

### 7.2 Admin: Jagd anlegen & Stationen

| ID | Anforderung | Prio |
|---|---|---|
| ADM-1 | Jagd mit Titel, Beschreibung, Geburtstagskind (Name, Alter), Datum und Theme anlegen. | M |
| ADM-2 | Stationen über eine **Google-Maps-Karte** setzen: per Klick, per Adresssuche (Places Autocomplete) oder per „Meine aktuelle Position". | M |
| ADM-3 | Marker per Drag & Drop verschieben; Stationen benennen; Typ festlegen (Start, Zwischenstation, Falscher Ort, Ziel). | M |
| ADM-4 | Pro Station einen **Ankunftsradius** festlegen (Standard 20 m, Bereich 10–100 m) und auf der Karte als Kreis anzeigen. | M |
| ADM-5 | Pro Station einen optionalen **Ortshinweis** für die Navigation, z. B. „Unter der großen Eiche" (Text und/oder Foto). | S |
| ADM-6 | Die Karte zeigt die Route zwischen den Stationen samt geschätzter Gehstrecke und -zeit (Directions API, Modus „zu Fuß"). | S |
| ADM-7 | Warnung, wenn Stationen sehr nah beieinander liegen (sich überschneidende Radien) oder eine Strecke ungewöhnlich lang ist (> 1 km). | S |
| ADM-8 | Stationen ohne Rätsel als reine „Wegpunkte" (z. B. nur Video oder Nachricht). | C |

### 7.3 Admin: Rätsel & Ablauflogik

| ID | Anforderung | Prio |
|---|---|---|
| RAE-1 | Pro Station ein Rätsel mit Titel, Fragetext, optionalem Bild und optionalem Video. | M |
| RAE-2 | Rätseltypen: **Multiple Choice** (2–6 Antworten als große Buttons), **Freitext** (tolerant gegen Groß-/Kleinschreibung, Leerzeichen und Umlaute; mehrere gültige Schreibweisen möglich), **Zahl**. | M |
| RAE-3 | Jeder Antwort ist eine **Folge** zugeordnet: (a) *weiter zu Station X*, (b) *falscher Ort Y*, (c) *Meldung „falsch"* mit eigenem Text. | M |
| RAE-4 | Freitext und Zahl: Definition der richtigen Lösung(en) plus Standardfolge für alle anderen Eingaben. Zusätzlich können bestimmte falsche Eingaben auf einen falschen Ort zeigen. | M |
| RAE-5 | **Falscher Ort** ist eine eigene Station mit Nachricht/Video („Hier ist nur ein schlafender Drache …"). Danach geht es konfigurierbar zurück zur vorherigen Station oder direkt zurück zum Rätsel (ohne erneutes Hinlaufen). | M |
| RAE-6 | Pro Rätsel 0–3 **gestufte Tipps** (Text, Bild oder Video). | M |
| RAE-7 | Optionale **Strafzeit** oder Sperre nach einer falschen Antwort (z. B. 30 s warten), damit nicht einfach alles durchprobiert wird. | S |
| RAE-8 | **Flussansicht**: grafische Darstellung aller Stationen und Antwortpfade als Graph. Hervorgehoben werden Fehler: Stationen ohne Eingang, Sackgassen ohne Weg zurück, Pfade ohne Ziel, Zyklen ohne Ausweg. | M |
| RAE-9 | Validierung vor dem Veröffentlichen: genau ein Start, mindestens ein Ziel, jedes Rätsel hat mindestens eine richtige Antwort, alle Pfade erreichen das Ziel. | M |
| RAE-10 | Weitere Rätseltypen: **Foto-Aufgabe** (Gruppe macht ein Foto, Spielleitung bestätigt), **QR-Code vor Ort scannen**, **Reihenfolge sortieren**, **Bild antippen**. | C |
| RAE-11 | **Rätselvorlagen** passend zum Theme und Alter, die sich mit einem Klick übernehmen lassen. | C |

### 7.4 Admin: Medien & Videos

| ID | Anforderung | Prio |
|---|---|---|
| MED-1 | Videos hochladen (MP4/MOV/WebM, max. 200 MB pro Video, max. 5 Minuten) und automatisch für Mobilgeräte transkodieren (adaptives Streaming, z. B. HLS). | M |
| MED-2 | Videos an diesen Stellen des Ablaufs einbinden: **Intro** (vor Station 1), **vor einem Rätsel**, **als Teil des Rätsels**, **nach richtiger Antwort**, **an falschem Ort**, **als Tipp**, **Finale**. | M |
| MED-3 | Pro Video einstellen: Pflicht ansehen (Überspringen erst nach Ende) oder überspringbar. | S |
| MED-4 | Videos direkt im Browser aufnehmen (Webcam/Handykamera), z. B. als „König" verkleidet. | S |
| MED-5 | Bilder hochladen (JPG/PNG/WebP/HEIC, automatisch komprimiert). | M |
| MED-6 | Audiodateien bzw. Vorlesefunktion (Text-to-Speech) für Rätseltexte, damit auch Kinder mitspielen, die noch nicht lesen können. | S |
| MED-7 | Externe Videos (YouTube-Link) einbetten. | C |

### 7.5 Admin: Themes

| ID | Anforderung | Prio |
|---|---|---|
| THM-1 | Auswahl aus mindestens **4 Themes** zum Start: **Ritter**, **Dinos**, **Piraten**, **Weltraum**. | M |
| THM-2 | Ein Theme legt fest: Farbpalette, Schriften, Hintergründe, Buttons, Icons und Kartenmarker, Kartenstil (Google Maps Styled Maps), Erfolgs- und Fehleranimationen, Soundeffekte, Begriffe (z. B. „Schatzkarte" statt „Karte", „Burg" statt „Ziel") und die Abschlussurkunde. | M |
| THM-3 | Live-Vorschau des Themes in einem Handy-Rahmen im Admin. | M |
| THM-4 | Anpassungen innerhalb eines Themes: Logo/Wappen hochladen, Name des Geburtstagskindes einbinden, Akzentfarbe ändern. | S |
| THM-5 | Weitere Themes: Einhorn/Fee, Detektiv, Feuerwehr, Dschungel, Superhelden. | C |
| THM-6 | Themes sind technisch als **austauschbare Pakete** gebaut (Design-Tokens plus Assets), damit neue Themes ohne Codeänderung an der Spiellogik hinzukommen. | M |

### 7.6 Admin: Test, Veröffentlichen, Durchlauf

| ID | Anforderung | Prio |
|---|---|---|
| RUN-1 | **Testmodus**: die Jagd im Browser durchspielen, ohne vor Ort zu sein; die Ankunft wird per Klick simuliert. | M |
| RUN-2 | **Vor-Ort-Test**: die echte Spieler-App mit GPS ausprobieren, ohne dass ein offizieller Durchlauf gestartet wird. | S |
| RUN-3 | **Durchlauf starten** erzeugt Link plus QR-Code für das Spielgerät. | M |
| RUN-4 | Eine Jagd kann **mehrere Durchläufe** haben (z. B. Wiederholung beim nächsten Geburtstag). Durchläufe sind voneinander getrennt. | S |
| RUN-5 | Die Jagd wird beim Start eines Durchlaufs als Version eingefroren; spätere Änderungen betreffen laufende Durchläufe nur, wenn die Spielleitung das ausdrücklich bestätigt. | S |
| RUN-6 | Druckfunktion: QR-Code und optionale Stationsschilder als PDF (z. B. für QR-Scan-Rätsel). | C |

### 7.7 Spieler-App (mobile Web-App)

| ID | Anforderung | Prio |
|---|---|---|
| PLY-1 | Läuft in aktuellen mobilen Browsern (iOS Safari ab 16, Chrome Android ab 110) und ist als **PWA** installierbar (optional). | M |
| PLY-2 | **Onboarding**: Theme-Begrüßung, Gruppenname, Erklärung in wenigen Schritten und Abfrage der Berechtigungen (Standort, optional Benachrichtigungen). Verständliche Hilfe, wenn der Standort verweigert wurde. | M |
| PLY-3 | **Navigationsansicht**: Karte (Google Maps im Theme-Stil) mit eigener Position, Zielmarker, Entfernung in Metern und Richtungspfeil/Kompass (DeviceOrientation, wenn verfügbar). | M |
| PLY-4 | Wählbar pro Jagd: **Ziel genau zeigen** oder **nur „heiß/kalt"** (Entfernung und Richtung ohne Kartenmarker), damit die Suche spannender wird. | S |
| PLY-5 | Button „In Google Maps öffnen" als Fallback für die Fußgänger-Navigation. | S |
| PLY-6 | **Ankunftserkennung** per Geofence (Position im Radius, mehrere Messungen geglättet, Genauigkeit berücksichtigt). | M |
| PLY-7 | **Fallback bei schlechtem GPS**: Button „Wir sind da!" wird nach einer konfigurierbaren Zeit oder ab einer Entfernung < 50 m aktiv. Alternativ schaltet die Spielleitung die Station frei. | M |
| PLY-8 | **Rätselansicht**: große Touch-Ziele (mindestens 48 px), wenig Text, Vorlesen-Button, Bilder und Videos im Vollbild. | M |
| PLY-9 | Feedback auf Antworten mit Theme-Animation und Sound (richtig, falscher Ort, falsch). | M |
| PLY-10 | **Fortschrittsanzeige** im Theme (z. B. Schatzkarte mit abgehakten Stationen), ohne die Positionen künftiger Stationen zu verraten. | S |
| PLY-11 | **Hilfe-Button** immer erreichbar: zeigt den nächsten Tipp. Sind alle Tipps verbraucht, wird „Eltern um Hilfe bitten" angeboten (siehe 7.9). | M |
| PLY-12 | **Chat-Button** mit Badge für ungelesene Nachrichten (siehe 7.9). | M |
| PLY-13 | **Notfall-Button** (getrennt von „Hilfe"): sendet sofort eine Alarmmeldung mit Position an alle Erwachsenen und zeigt eine hinterlegte Telefonnummer zum Direktanruf. | M |
| PLY-14 | **Zielbildschirm**: Schatz-Animation, Finalvideo, Urkunde mit Gruppenname, Dauer und Anzahl der Stationen (als Bild speicherbar). | M |
| PLY-15 | **Wake Lock**: Der Bildschirm bleibt während der Navigation an (Screen Wake Lock API), mit Hinweis zum Akku. | M |
| PLY-16 | Spielstand übersteht das Neuladen der Seite, das Schließen des Browsers und Netzabbrüche. Der Stand wird serverseitig geführt und lokal zwischengespeichert. | M |
| PLY-17 | Eingaben bei schwachem Netz zwischenspeichern und nachsenden. Medien der nächsten Station vorab laden. | S |
| PLY-18 | Kindersichere UI: keine externen Links (außer Google-Maps-Fallback), keine Werbung, kein versehentliches Verlassen ohne Rückfrage. | M |

### 7.8 Live-Verfolgung (Eltern)

| ID | Anforderung | Prio |
|---|---|---|
| TRK-1 | Das Spielgerät sendet seine Position, solange die App im Vordergrund ist (alle 5–10 s oder bei mehr als 10 m Bewegung). | M |
| TRK-2 | **Live-Karte** für Spielleitung und Beobachter: aktuelle Position der Gruppe, zurückgelegter Weg, alle Stationen mit Status (erledigt, aktiv, offen, falscher Ort besucht). | M |
| TRK-3 | Anzeige „zuletzt gesehen vor X s" und GPS-Genauigkeit. Warnung, wenn länger als 2 Minuten keine Position kam (App geschlossen, Akku leer, Funkloch). | M |
| TRK-4 | **Ereignis-Timeline**: Station erreicht, Antwort gegeben (inkl. falscher Antworten), Tipp genutzt, Video angesehen, Hilfe angefordert. | M |
| TRK-5 | **Push-Benachrichtigungen** an die Erwachsenen (Web Push) bei: Hilfe angefordert, Notfall, Station erreicht (optional), lange inaktiv, Ziel erreicht. | S |
| TRK-6 | **Eingriffe der Spielleitung**: Station manuell freischalten, Rätsel als gelöst markieren, zu einer bestimmten Station springen, Durchlauf pausieren oder beenden. | M |
| TRK-7 | Geschätzte Ankunftszeit am Ziel (z. B. damit der Kuchen rechtzeitig fertig ist). | C |
| TRK-8 | Optionaler **Bewegungsbereich (Geofence)**: Alarm, wenn die Gruppe einen definierten Bereich verlässt. | S |

### 7.9 Hilfe & Chat

| ID | Anforderung | Prio |
|---|---|---|
| CHT-1 | **Echtzeit-Chat** zwischen Spielgerät und Erwachsenen (Spielleitung und Beobachter) pro Durchlauf. | M |
| CHT-2 | Nachrichtentypen: Text, Emoji, Foto (Kamera oder Galerie). Sprachnachricht als Should (für Kinder, die noch nicht schreiben können). | M (Text/Foto), S (Sprache) |
| CHT-3 | **Schnellantworten** für Kinder (Buttons): „Wir finden den Ort nicht", „Rätsel ist zu schwer", „Alles gut!", „Wir machen Pause". | M |
| CHT-4 | **Hilfeanfrage** ist eine besondere Chat-Nachricht mit Kontext: aktuelle Station, Rätsel, bisherige Antworten, Position. Sie wird bei den Erwachsenen hervorgehoben, bis sie beantwortet ist. | M |
| CHT-5 | Erwachsene können aus dem Chat heraus einen Tipp schicken oder eine Station freischalten (Verknüpfung mit TRK-6). | S |
| CHT-6 | Erwachsene können als **Spielfigur** des Themes schreiben (z. B. als „König Artus" mit Avatar), damit das Spielgefühl erhalten bleibt. Das Spielgerät zeigt den Absender entsprechend an. | S |
| CHT-7 | Gelesen-Status und Benachrichtigungston auf dem Spielgerät. | S |
| CHT-8 | Vordefinierte Nachrichten, die die Spielleitung vorab schreibt und während des Spiels mit einem Tipp sendet. | C |

### 7.10 Nach der Jagd

| ID | Anforderung | Prio |
|---|---|---|
| END-1 | Zusammenfassung des Durchlaufs: Dauer, Route auf der Karte, Zeit pro Station, genutzte Tipps, Chatverlauf. | S |
| END-2 | Fotos aus dem Chat und Foto-Aufgaben als Album herunterladen (ZIP). | C |
| END-3 | Automatisches Löschen von Positionsdaten und Chat nach einer konfigurierbaren Frist (Standard 30 Tage, siehe Abschnitt 9). | M |

---

## 8. Ablauflogik & Datenmodell

### 8.1 Ablauf als Graph

Eine Jagd ist ein **gerichteter Graph**. Knoten sind Stationen, Kanten sind Antworten.

```
[Start] --Intro-Video--> (Station 1: Rätsel A)
   Antwort "4"  ──────────────▶ (Station 2: Rätsel B)
   Antwort "6"  ──────────────▶ (Falscher Ort: Drachenhöhle) ──zurück──▶ Rätsel A
   Antwort "8"  ──▶ Meldung "falsch" (bleibt bei Rätsel A)

(Station 2) ... ▶ (Station N) ──richtig──▶ [Ziel: Schatz + Finalvideo]
```

**Zustandsautomat des Spielgeräts (pro Station):**

`NAVIGIEREN → ANGEKOMMEN → (VIDEO_VOR) → RÄTSEL → (VIDEO_NACH) → NAVIGIEREN (nächste Station)`

Sonderzustände: `FALSCHER_ORT`, `PAUSIERT`, `BEENDET`.

Der Zustand wird **serverseitig autoritativ** geführt. Das Spielgerät sendet Ereignisse (Ankunft, Antwort), der Server prüft sie und gibt den neuen Zustand zurück. Lösungen werden **nicht** vorab an den Client übertragen, damit sie sich nicht aus dem Quelltext auslesen lassen.

### 8.2 Kern-Entitäten

| Entität | Wichtige Felder |
|---|---|
| `User` | id, email, name, created_at |
| `Hunt` | id, owner_id, title, description, birthday_child_name, age, theme_id, theme_overrides, status (draft/published/archived), settings (navigation_mode, penalty_seconds, emergency_phone) |
| `HuntVersion` | id, hunt_id, version, snapshot (JSON), created_at |
| `Station` | id, hunt_id, type (start/regular/wrong/finish), name, lat, lng, radius_m, location_hint, media_before_id, media_after_id, return_target (bei falschem Ort) |
| `Puzzle` | id, station_id, type (choice/text/number/…), question, media_id, penalty_seconds |
| `Answer` | id, puzzle_id, label/pattern, outcome (next_station/wrong_place/wrong_message), target_station_id, message |
| `Hint` | id, puzzle_id, order, text, media_id |
| `Media` | id, owner_id, type (video/image/audio), storage_key, hls_url, duration, status |
| `Theme` | id, key, name, tokens (JSON), assets, map_style, vocabulary |
| `Run` | id, hunt_version_id, access_token, team_name, state, current_station_id, started_at, finished_at |
| `RunEvent` | id, run_id, type, payload, created_at |
| `LocationPing` | run_id, lat, lng, accuracy, heading, recorded_at |
| `Message` | id, run_id, sender_type (player/adult/character), sender_id, kind (text/photo/audio/help/emergency), body, media_id, read_at |
| `Collaborator` | hunt_id, user_id, role (owner/observer) |

---

## 9. Nicht-funktionale Anforderungen

### 9.1 Datenschutz & Sicherheit (hohe Priorität, da Kinder und Standortdaten betroffen sind)
- **DSGVO-konform**; Hosting in der EU.
- **Datensparsamkeit:** Von den Kindern werden keine personenbezogenen Daten verlangt, nur ein frei wählbarer Gruppenname.
- Positionsdaten werden **nur während eines aktiven Durchlaufs** erhoben, nur für Spielleitung und Beobachter angezeigt und **automatisch gelöscht** (Standard 30 Tage, minimal „sofort nach Ende").
- Die Spielleitung bestätigt bei Durchlaufstart, dass die Erziehungsberechtigten der teilnehmenden Kinder mit dem Live-Tracking einverstanden sind (Hinweistext und Checkbox).
- Durchlauf-Links mit mindestens 128 Bit Zufall, Ablauf nach Durchlaufende.
- Transport ausschließlich über HTTPS/WSS; Medien über signierte, zeitlich begrenzte URLs.
- Rätsellösungen werden nur serverseitig ausgewertet (siehe 8.1).
- Rate-Limiting für Antworten (Schutz gegen Durchprobieren).
- Hochgeladene Medien sind privat (nicht öffentlich indexierbar).

### 9.2 Performance & Zuverlässigkeit
- Erster Aufruf der Spieler-App unter 3 s auf 4G (Lighthouse Performance ≥ 85 auf Mobilgeräten).
- Positions-Updates erscheinen auf der Live-Karte innerhalb von 3 s.
- Chatnachrichten werden innerhalb von 1 s zugestellt (bei stabilem Netz).
- Videos starten innerhalb von 2 s (adaptives Streaming, Vorladen der nächsten Station).
- Funktioniert bei kurzzeitigem Netzverlust: Ereignisse werden in eine Warteschlange gelegt und nachgesendet; der Spielstand bleibt erhalten.
- Verfügbarkeit ≥ 99,5 %. Wochenenden sind Hauptlastzeit (Geburtstage!).

### 9.3 Usability & Barrierefreiheit
- Spieler-App „Mobile first" und Hochformat, mit einer Hand bedienbar.
- Kindgerecht: kurze Sätze, große Schrift (Basis ≥ 18 px), Symbole statt Text, wo möglich, Vorlesefunktion.
- Ausreichende Kontraste in allen Themes (WCAG 2.1 AA). Bei jedem Theme prüfen, auch im Sonnenlicht.
- Admin-Oberfläche responsiv: Desktop ist primär, Bearbeiten auf dem Tablet/Handy muss ebenfalls gehen (z. B. Stationen vor Ort setzen).
- Sprache v1: Deutsch. Architektur von Anfang an mehrsprachig (i18n).

### 9.4 Akku & Gerät
- Positionsabfrage mit `watchPosition` und `enableHighAccuracy` nur in der Navigationsphase; während Rätsel und Videos seltener.
- Akkustand (Battery API, wo verfügbar) an die Eltern melden; Warnung unter 20 %.
- Empfehlung im Onboarding: Handy geladen, eventuell Powerbank mitnehmen.

---

## 10. Technische Rahmenbedingungen (Vorschlag)

| Bereich | Vorschlag | Begründung |
|---|---|---|
| Frontend | Ein Web-Projekt (z. B. Next.js/React + TypeScript) mit zwei Bereichen: `/admin` und `/play` | Gemeinsame Komponenten, ein Deployment |
| Themes | CSS-Variablen/Design-Tokens + Asset-Pakete pro Theme, dazu Google Maps Cloud-based Map Styles | Neue Themes ohne Logikänderung |
| Karten | Google Maps JavaScript API, Places API (Autocomplete), Directions API (Gehroute), Map-IDs für gestylte Karten | Vom Nutzer gewünscht |
| Echtzeit | WebSockets (z. B. Socket.IO oder ein Managed-Dienst wie Supabase Realtime/Ably/Pusher) | Chat, Live-Position, Zustandsänderungen |
| Backend | REST/tRPC-API + PostgreSQL (mit PostGIS optional) | Relationale Daten, Geo-Abfragen |
| Medien | Objektspeicher (S3-kompatibel, EU-Region) + Video-Transcoding (z. B. Mux, Cloudflare Stream oder ffmpeg-Worker) | Mobile Wiedergabe, HLS |
| Push | Web Push (VAPID). Unter iOS nur, wenn die PWA zum Homescreen hinzugefügt wurde | Benachrichtigungen an Eltern |
| Auth | E-Mail/Magic Link (z. B. Auth.js oder Supabase Auth) | Geringe Hürde |
| Hosting | EU-Region (DSGVO) | Datenschutz |

---

## 11. Risiken, Annahmen & Gegenmaßnahmen

| Risiko | Auswirkung | Gegenmaßnahme |
|---|---|---|
| **Browser liefern keine Position im Hintergrund**, wenn der Bildschirm gesperrt oder die App gewechselt wird. | Live-Tracking reißt ab. | Wake Lock (PLY-15), klarer Hinweis an die Kinder („Handy anlassen!"), „zuletzt gesehen"-Anzeige (TRK-3), langfristig native App oder PWA-Erweiterungen prüfen. |
| **GPS-Ungenauigkeit** (Bäume, Häuser: 10–50 m Abweichung). | Station wird nicht erkannt oder zu früh erkannt. | Radius konfigurierbar, Glättung, Berücksichtigung der Genauigkeit, „Wir sind da!"-Fallback, manuelle Freischaltung durch die Eltern. |
| **iOS-Einschränkungen** (Berechtigungen für Kompass und Standort, Web Push nur als installierte PWA). | Teile der Funktionen fehlen auf iPhones. | Feature-Erkennung, sauberes Fallback-Verhalten, frühe Tests auf echten Geräten. |
| **Kosten der Google-Maps-API** (Map Loads, Places, Directions). | Laufende Kosten pro Jagd. | Kartenaufrufe sparsam nutzen, Directions nur im Admin, Caching, Kostenbudget und Monitoring. Pro Durchlauf ca. ein paar Cent einplanen. |
| **Videogröße bei mobilem Datenvolumen.** | Hoher Datenverbrauch, Ruckler. | Transcoding in niedrigere Auflösungen, adaptives Streaming, Vorladen im WLAN beim Start anbieten. |
| **Sicherheit der Kinder im Straßenverkehr.** | Unfallgefahr durch Blick aufs Handy. | Hinweise im Onboarding, Warnung im Admin bei Routen mit Straßenquerungen (manuell), „Bitte stehen bleiben" bei Videos/Rätseln, Empfehlung einer Begleitperson für jüngere Kinder. |
| **Kinder probieren alle Antworten durch.** | Rätsel verlieren ihren Reiz. | Strafzeit (RAE-7), falsche Orte als Abschreckung, Rate-Limit. |
| **Akku leer.** | Jagd bricht ab. | Akku-Warnung, Energiesparmodus, Spielstand am Server, Fortsetzen auf einem anderen Gerät über denselben Link. |

**Annahmen**
- Ein Spielgerät pro Durchlauf, mit mobilem Internet.
- Die Jagd findet draußen statt (GPS verfügbar). Die Strecke ist typischerweise 0,5–3 km lang, mit 4–10 Stationen und 45–120 Minuten Dauer.
- Die Spielleitung ist erwachsen und für die Aufsicht verantwortlich. Die App ersetzt keine Aufsicht.

---

## 12. Erfolgsmessung

| Metrik | Zielwert (6 Monate nach Launch) |
|---|---|
| Anteil angelegter Jagden, die tatsächlich gespielt werden | ≥ 60 % |
| Anteil gestarteter Durchläufe, die das Ziel erreichen | ≥ 85 % |
| Mediane Planungszeit für eine Jagd mit 5 Stationen | ≤ 45 min |
| Durchläufe mit manueller Freischaltung wegen GPS-Problemen | ≤ 15 % |
| Zufriedenheit der Spielleitung (Umfrage nach der Jagd, 1–5) | ≥ 4,3 |
| Wiederkehrende Nutzung (zweite Jagd innerhalb von 12 Monaten) | ≥ 30 % |

---

## 13. Release-Plan

### MVP (v1.0)
- Konto, Jagd anlegen, Stationen auf Google Maps, Ankunftsradius
- Rätsel (Multiple Choice, Freitext, Zahl) mit Folgen: weiter / falscher Ort / falsch
- Flussansicht + Validierung, Testmodus
- 4 Themes (Ritter, Dinos, Piraten, Weltraum)
- Video- und Bild-Upload, Videos an allen Stellen des Ablaufs
- Spieler-App: Onboarding, Navigation, Geofence + Fallback, Rätsel, Tipps, Zielbildschirm, Wake Lock, Spielstand bleibt erhalten
- Live-Karte, Ereignis-Timeline, Eingriffe der Spielleitung
- Chat (Text, Foto, Schnellantworten), Hilfeanfrage, Notfall-Button
- Datenschutz: Einwilligungshinweis, automatische Löschung

### v1.1
- Beobachter-Rollen, Web Push
- „Heiß/kalt"-Modus, Strafzeit
- Video im Browser aufnehmen, Vorlesefunktion, Sprachnachrichten
- Schreiben als Spielfigur im Chat
- Durchlauf-Zusammenfassung

### Später
- Weitere Rätseltypen (Foto, QR, Sortieren), Vorlagen-Bibliothek
- Weitere Themes und ein Theme-Editor
- Mehrere Teams gegeneinander (Wettrennen-Modus)
- Teilen und Kopieren von Jagden zwischen Familien
- Mehrsprachigkeit (EN)
- Native App bzw. Wrapper für Hintergrund-Tracking

---

## 14. Offene Fragen

1. **Geschäftsmodell:** Kostenlos, Freemium (z. B. 1 Jagd gratis, Premium-Themes oder Videos kostenpflichtig) oder Einmalzahlung pro Geburtstag? Davon hängen Speicherlimits und das Kostenbudget für Google Maps ab.
2. **Mehrere Geräte pro Gruppe:** Soll eine Gruppe den Durchlauf auf zwei Handys parallel öffnen können (z. B. eines für die Karte, eines für Videos)?
3. **Rückweg bei falschem Ort:** Muss die Gruppe zur vorherigen Station zurücklaufen, oder darf sie direkt neu antworten? Bisher konfigurierbar pro falschem Ort. Reicht das, oder brauchen wir einen globalen Standard?
4. **Indoor- bzw. Schlechtwetter-Variante:** Soll eine Jagd ohne GPS möglich sein (Stationen per QR-Code in der Wohnung)?
5. **Moderation:** Brauchen wir einen Upload-Filter für Medien, obwohl Inhalte nur privat geteilt werden?
6. **Alter der Zielgruppe:** Gibt es für 4- bis 6-Jährige einen eigenen „Vorlese-Modus" mit noch weniger Text?
7. **Notfallnummer:** Pflichtfeld beim Durchlaufstart, und soll zusätzlich auf den Notruf 112 hingewiesen werden?
