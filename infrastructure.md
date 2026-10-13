# Digital infrastructure — v5.2

Public professional review edition · Updated 2026-10-12

Existing equipment, services and the connections still to establish.

Start with the systems and records TDF already has. Each date belongs to its source: these maps help locate equipment, knowledge and next checks; they do not report live health. Different kinds of lines distinguish configuration, history, proposals and untraced physical routes.

## Internet and Wi-Fi

Known equipment and a route that still needs tracing.

### Starlink

service · reported · As of 2026-09-26 · ID: starlink

Reported site internet service.

- Retained infrastructure accounts identify Starlink as an existing internet route.
- Its exact route into local network equipment has not been traced in this map.

Open on this node:

- Which uplink and coverage are in use now?

Recorded connections:

- Starlink → UniFi Switch 8 60W: Uplink-to-switch route untraced (unknown)

- [Reported network knowledge contact](people.html#nuno)
- [Remote installer knowledge](people.html#mathijs)

Sources: R1, R2

### Activity-space Wi-Fi

service · reported · As of 2026-10-09 · ID: activity

Activity-space connectivity has a recorded repair case.

- The last retained repair account is dated 9 October.
- A new dated result is needed to establish the present connection.

Open on this node:

- What is the latest tested outcome for this space?

Recorded connections:

- Access point → Activity-space Wi-Fi: Room coverage and outcome to verify (unknown)

- [Reported repair and technical bridge context](people.html#jaggy)
- [Knowledge contact](people.html#nuno)

Sources: R21

### UniFi Switch 8 60W

asset · reported · As of 2026-10-07 · ID: switch

PoE switch identified in the retained troubleshooting account.

- A short test cable powered the access point through this switch.
- Model identification does not establish every port or installed cable route.

Open on this node:

- Which installed link serves each access point?

Recorded connections:

- Starlink → UniFi Switch 8 60W: Uplink-to-switch route untraced (unknown)
- UniFi Switch 8 60W → Access point: Reported short-cable PoE test (reported)
- UniFi Switch 8 60W → Ethernet / connector: Installed cable endpoint untraced (unknown)


Sources: R2

### Access point

asset · reported · As of 2026-10-07 · ID: ap

An access point powered through the short test cable.

- The PoE test is a reported result.
- An earlier image-based model guess was not retained as verified identification.

Open on this node:

- What model and installed location are confirmed?

Recorded connections:

- UniFi Switch 8 60W → Access point: Reported short-cable PoE test (reported)
- Ethernet / connector → Access point: Permanent cable-to-AP route untraced (unknown)
- Access point → Activity-space Wi-Fi: Room coverage and outcome to verify (unknown)


Sources: R2

### Ethernet / connector

asset · reported · As of 2026-10-09 · ID: cable

Physical cable and connector route to identify.

- The installed route and exact tested endpoints are not fully recorded.
- Keep physical tracing separate from a diagnosis.

Open on this node:

- Which run and connectors serve the activity space?

Recorded connections:

- UniFi Switch 8 60W → Ethernet / connector: Installed cable endpoint untraced (unknown)
- Ethernet / connector → Access point: Permanent cable-to-AP route untraced (unknown)


Sources: R21

### Fixed-line internet

unknown · unknown · As of 2026-10-09 · ID: fixedline

Provider, order and delivery evidence are still needed.

- A later meeting discussed a possible long delay.
- Meeting timing is an account, not a provider-confirmed delivery promise.

Open on this node:

- What provider or order evidence establishes the timeline?


Sources: R21, M1

## Solar, storage and loads

Recorded energy assets; actual wiring and present measurements need confirmation.

### Solar panels

asset · reported · As of 2026-09-26 · ID: solar

Installed solar assets described in the retained deck.

- The source describes existing solar separately from proposed expansion.
- A recorded solar/energy-monitoring account does not establish today's production or electrical topology.

Open on this node:

- Which installed equipment and present readings are confirmed?

Recorded connections:

- Solar panels → Battery bank: Reported energy-system association; wiring unverified (reported)
- Solar panels → Solar app access: Reported monitoring-app knowledge lead (reported)
- Solar panels → Home Assistant Yellow: Solar-production monitoring described in retained account (reported)
- 2 Growatt devices → Solar panels: Exact physical equipment relationship unconfirmed (unknown)

- [Solar-app knowledge contact](people.html#ani)
- [Land and energy project context](regenerative-finance.html)

Sources: R1, R4

### Solar app access

service · reported · As of 2026-10-09 · ID: solarapp

Ani is the reported solar-app knowledge contact.

- The source names a contact for understanding the existing app.
- Knowing the app is separate from permission to administer equipment.

Open on this node:

- Which app and authorised reading route should contributors use?

Recorded connections:

- Solar panels → Solar app access: Reported monitoring-app knowledge lead (reported)

- [Reported app knowledge](people.html#ani)

Sources: R3, R21

### Battery bank

asset · reported · As of 2026-09-26 · ID: battery

Battery storage appears in the retained energy account.

- A roughly 20 kWh figure is historical reported capacity, not a current measurement.
- Present state, manufacturer procedure and energy connections still need confirmation.

Open on this node:

- What equipment and usable capacity are confirmed now?

Recorded connections:

- Solar panels → Battery bank: Reported energy-system association; wiring unverified (reported)


Sources: R1, R21, R4

### 2 Growatt devices

asset · observed · As of 2026-10-07 · ID: growatt

Two devices were configured in Home Assistant.

- The Growatt Server integration listed two devices at inspection.
- Configuration is evidence of a recorded integration, not tested physical wiring or live generation.

Open on this node:

- Which physical devices and usable readings do these entries represent?

Recorded connections:

- Home Assistant Yellow → 2 Growatt devices: 2 configured integration devices, 7 Oct (observed)
- 2 Growatt devices → Solar panels: Exact physical equipment relationship unconfirmed (unknown)


Sources: R4

### Electrical loads

asset · reported · As of 2026-10-07 · ID: loads

Shared-space and pump/plug load context is recorded.

- The retained deck describes shared electrical loads.
- Zigbee entries inspected on 7 October include space, pump and appliance labels; field correspondence remains to confirm.

Open on this node:

- Which meters represent which loads?

Recorded connections:

- Electrical loads → Autoclave: Named load in historical account (reported)


Sources: R1, R4

### Autoclave

asset · reported · As of 2026-09-26 · ID: autoclave

Named electrical load in the retained deck.

- A 6 kW figure was reported in the historical account.
- A possible load alert was an idea, not an installed automation.

Open on this node:

- What rating and measured load are confirmed?

Recorded connections:

- Electrical loads → Autoclave: Named load in historical account (reported)


Sources: R1

## Monitoring and local apps

Concrete inventory inspected on 7 October.

### Home Assistant Yellow

asset · observed · As of 2026-10-07 · ID: ha

Yellow host inspected through an authenticated web session.

- Hardware, configured integrations and installed applications were inspected on 7 October.
- The inventory is a dated starting point for understanding energy and water data.
- A configured entity is not proof of a working field device or complete history.

Open on this node:

- Who maintains this platform and confirms useful readings?

Recorded connections:

- Solar panels → Home Assistant Yellow: Solar-production monitoring described in retained account (reported)
- Home Assistant Yellow → 2 Growatt devices: 2 configured integration devices, 7 Oct (observed)
- Home Assistant Yellow → ESPHome water telemetry: 2 configured ESPHome devices, 7 Oct (observed)
- Home Assistant Yellow → Zigbee devices: 13 configured Zigbee entries, 7 Oct (observed)
- Home Assistant Yellow → InfluxDB: Installed app Running, 7 Oct (observed)
- Home Assistant Yellow → Grafana: Installed app Running, 7 Oct (observed)
- Home Assistant Yellow → HA backup archives: Stored archive inventory, 7 Oct (observed)

- [Per-service access and responsibility question](people.html#digital_owner)
- [Measurement evidence for bounded land work](regenerative-finance.html)

Sources: R4

### ESPHome water telemetry

asset · observed · As of 2026-10-07 · ID: water

Borehole and Greywater ESPHome entries were inspected.

- Two ESPHome devices expose flow, volume and internal-temperature entity types.
- These are a separate device layer from Zigbee pump electrical meters.
- Units, calibration, sensor identity and useful history need confirmation.

Open on this node:

- What measured data can these two devices substantiate?

Recorded connections:

- Home Assistant Yellow → ESPHome water telemetry: 2 configured ESPHome devices, 7 Oct (observed)
- ESPHome water telemetry → Zigbee devices: Flow devices and pump meters are distinct layers (observed)

- [Expert land context](people.html#ofer)
- [Baseline and outcome evidence](regenerative-finance.html)

Sources: R4

### Zigbee devices

asset · observed · As of 2026-10-07 · ID: zigbee

13 Zigbee entries were configured, including Yellow.

- The inventory contains Yellow plus 12 TS011F entries.
- Borehole Pump and Greywater Pump labels refer to electrical/switch entities, distinct from ESPHome water feeds.
- No soil-moisture or water-level sensor was identified in the inspected lists.

Open on this node:

- Which entries match real field equipment and measurements?

Recorded connections:

- Home Assistant Yellow → Zigbee devices: 13 configured Zigbee entries, 7 Oct (observed)
- ESPHome water telemetry → Zigbee devices: Flow devices and pump meters are distinct layers (observed)


Sources: R4

### InfluxDB

service · observed · As of 2026-10-07 · ID: influx

Installed application marked Running at inspection.

- InfluxDB v1 was already installed on Yellow.
- Running application state does not establish continuous ingestion, retention or complete measurements.

Open on this node:

- Which measurement series and retention are actually useful?

Recorded connections:

- Home Assistant Yellow → InfluxDB: Installed app Running, 7 Oct (observed)
- InfluxDB → Grafana: Actual data-source path unverified (unknown)


Sources: R4

### Grafana

service · observed · As of 2026-10-07 · ID: grafana

Installed dashboard application marked Running.

- Grafana already exists alongside Home Assistant and InfluxDB.
- No verified data-source path or complete working dashboard is inferred from app state.

Open on this node:

- Which dashboard and data source produce a useful result?

Recorded connections:

- Home Assistant Yellow → Grafana: Installed app Running, 7 Oct (observed)
- InfluxDB → Grafana: Actual data-source path unverified (unknown)


Sources: R4

### HA backup archives

asset · observed · As of 2026-10-07 · ID: backups

Stored archives were inspected as a dated inventory.

- The displayed backup list is distinct from demonstrated recovery.
- Archive presence does not establish independent copies, complete scope or a successful restore.

Open on this node:

- What recovery evidence and responsible operator can be recorded?

Recorded connections:

- Home Assistant Yellow → HA backup archives: Stored archive inventory, 7 Oct (observed)


Sources: R4

## Media and hosted services

Separate hosts, services, histories and permission boundaries.

### HP media host

asset · historical · As of 2026-10-04 · ID: hp

Existing media computer with dated service checkpoints.

- This host is distinct from Home Assistant Yellow.
- The latest retained checks establish history, not current uptime or available hosting capacity.

Open on this node:

- What is the latest dated access and service checkpoint?

Recorded connections:

- HP media host → Immich + catalogue: Recorded media services on this host (historical)
- HP media host → External T7 storage: Recorded external storage attachment (historical)


Sources: R5

### Immich + catalogue

service · historical · As of 2026-10-04 · ID: media

Existing media library and searchable catalogue.

- Immich and the indexed SSD catalogue are separate services on the media host.
- Preserve media membership, source permissions and existing archive boundaries.

Open on this node:

- Who confirms the current permitted browse/upload journey?

Recorded connections:

- HP media host → Immich + catalogue: Recorded media services on this host (historical)

- [Recorded media contribution context](people.html#heitor)

Sources: R5

### External T7 storage

asset · historical · As of 2026-10-03 · ID: t7

Media and database-dump storage on the HP host.

- The retained checkpoint identifies an external Samsung T7 Shield.
- Database dumps on the same medium do not by themselves establish independent recovery.

Open on this node:

- What storage and recovery evidence is current?

Recorded connections:

- HP media host → External T7 storage: Recorded external storage attachment (historical)


Sources: R5

### Hosted TDF bot lane

service · historical · As of 2026-09-23 · ID: hermes

Recorded Admin and Volunteer bot service lane.

- Existing bot work has Product and Release owners.
- Recorded source/review behaviour does not establish every current contributor journey.

Open on this node:

- Which current real journey has been accepted?


Sources: R6

### Private Forgejo

service · historical · As of 2026-10-09 · ID: forgejo

Separate recorded repository and hosting service.

- Forgejo is a different source home from the ecology GitHub repository.
- No automatic synchronization between them is established.

Open on this node:

- Which reviewed source and maintainer belong to this service?


Sources: R7

### TDF Pulse

service · historical · As of 2026-10-04 · ID: pulse

Published event reader checkpoint retained.

- The 4 October release separates Citizens Gathering from Confluência.
- This reader is distinct from BookStack, a wiki or a newsletter distribution system.

Open on this node:

- Which reviewed event material and editorial route should be used?

- [Recorded direction and media context](people.html#tonya)
- [Participation and communication responsibilities](domains.html)

Sources: R8

## Knowledge and access

Reuse existing source homes and reviewed access routes.

### Closer platform

service · reported · As of 2026-10-09 · ID: closer

Existing bookings, members, events and governance context.

- Closer is a concrete existing platform to understand before adding a second roster.
- Paul is recorded as a contributor; his remit and service accountability remain open.
- Documentation and public code do not establish private deployment or current access.

Open on this node:

- Who owns a booking issue through an authorised fix and reply?

Recorded connections:

- Closer platform → Retained source store: Permitted documentation view to identify (unknown)

- [Contributor; exact remit unknown](people.html#paul)
- [Reported booking knowledge](people.html#bige)
- [Unresolved support accountability](people.html#booking_owner)

Sources: R11, R28, D1, V1

### TDF Bitwarden

service · reported · As of 2026-10-09 · ID: bitwarden

Nuno is reported as the existing Bitwarden owner.

- The 9 October password handoff supersedes older owner-unknown wording.
- The report does not settle exact permissions, cover or authority over other systems.
- Keep credential contents outside this map.

Open on this node:

- What nonsecret ownership and access-request route is confirmed?

- [Reported Bitwarden owner](people.html#nuno)
- [Per-service access responsibility](people.html#digital_owner)

Sources: A1, D1

### Ecology / Repositree

service · historical · As of 2026-10-07 · ID: ecology

Existing land knowledge and data source home.

- A retained repository snapshot and connected private ecology source are recorded.
- Draft contributions and repository access do not establish accepted changes or current stewardship.
- The phrase main GitHub still needs an exact repository identifier.

Open on this node:

- Which repository and accepted knowledge should a contributor use?

Recorded connections:

- Ecology / Repositree → Retained source store: Retained ecology sources are indexed (observed)

- [Recorded ecology knowledge contact](people.html#monty)
- [Land evidence and project opportunities](regenerative-finance.html)

Sources: R11, R4, V1, V2

### Retained source store

asset · observed · As of 2026-10-09 · ID: records

Existing website, papers, proposals and field-source collections.

- Knowledge entry points and a derived catalogue connect retained source homes.
- Repeated captures are not independent facts or complete coverage.
- Local indexing is distinct from community access and reviewed canon.

Open on this node:

- Can one contributor retrieve and correct a permitted record?

Recorded connections:

- Closer platform → Retained source store: Permitted documentation view to identify (unknown)
- Ecology / Repositree → Retained source store: Retained ecology sources are indexed (observed)

- [Current mapping and source-bridge work](people.html#jaggy)
- [Knowledge capture, review and upkeep](domains.html)

Sources: R22, V1

### Static wiki / PWA

service · historical · As of 2026-10-09 · ID: wiki

A locally built and tested wiki candidate is recorded.

- Built/tested artefacts are distinct from an accepted community service.
- Keep its source and access boundaries separate from Pulse and BookStack.

Open on this node:

- What receiving-owner acceptance and reader journey exist?


Sources: R7

### Telegram + BookStack

project · proposed · As of 2026-10-07 · ID: bookstack

Selected community knowledge design, awaiting deployed-flow evidence.

- Telegram identity, reviewed drafts and BookStack are a selected design direction.
- Design selection does not establish a deployed integration or accepted service.

Open on this node:

- What existing component and one useful reviewed flow should be tested?


Sources: R13

## Foundations to establish

Proposed capacity and responsibility, not commissioned services.

### TDF foundation

project · proposed · As of 2026-10-09 · ID: foundation

Connectivity, power, access and support to clarify.

- The foundation links existing assets to useful future work.
- Shared records and practical connectivity take priority in the retained direction.
- Commercial readiness requires stronger evidence than a map or an idle host.

Open on this node:

- What minimum usable outcome and maintainer are agreed?

Recorded connections:

- TDF foundation → Local AI: Possible enabling capacity (proposed)
- TDF foundation → Shared servers: Possible enabling capacity (proposed)
- TDF foundation → Shared storage / NAS: Possible shared storage option (proposed)

- [Conditional services and income tests](ai-revenue.html)
- [Bounded outside-funding projects](regenerative-finance.html)

Sources: R21, R27

### Local AI

project · proposed · As of 2026-10-09 · ID: localai

Possible local processing capacity to assess.

- Local AI is an option, not a purchased or commissioned platform.
- Start with an actual permitted user need and compare existing maintained tools.

Open on this node:

- Which small useful task justifies local processing?

Recorded connections:

- TDF foundation → Local AI: Possible enabling capacity (proposed)

- [Concrete service and demand tests](ai-revenue.html)
- [Recorded AI and commons input](people.html#charlie)
- [Distinct home-lab and art input](people.html#jen)

Sources: R1, R21, R27

### Shared servers

project · proposed · As of 2026-10-09 · ID: servers

Additional hosting capacity has not been agreed.

- Yellow, HP and other candidate capacity have different roles and boundaries.
- An inventory or idle memory sample is not an accepted general-purpose service.

Open on this node:

- Which service, host, owner and recovery route are needed?

Recorded connections:

- TDF foundation → Shared servers: Possible enabling capacity (proposed)


Sources: R21, R4

### Shared storage / NAS

project · proposed · As of 2026-10-09 · ID: nas

Storage option rather than a confirmed deployment.

- An existing T7 media store is different from a future shared NAS.
- Do not infer purchase, migration or media-sharing authority from this option.

Open on this node:

- What permitted storage need remains unmet?

Recorded connections:

- TDF foundation → Shared storage / NAS: Possible shared storage option (proposed)


Sources: R21

### Ownership / access

unknown · unknown · As of 2026-10-11 · ID: permissions

Name ownership and access authority for each concrete service.

- Knowledge contacts, maintainers and people authorised to grant access may differ.
- Nuno's reported Bitwarden ownership is a specific fact; it does not fill every service-owner gap.

Open on this node:

- Who approves, maintains and covers each service?

Recorded connections:

- Ownership / access → Failure and recovery: Per-service accountable operation to establish (proposed)

- [Specific access-owner questions](people.html#digital_owner)
- [Role holders and decision boundaries](domains.html)

Sources: R21, D1, A1, V2

### Failure and recovery

project · proposed · As of 2026-10-09 · ID: support

Named support, recovery records and cover to establish.

- A backup list, active timer or saved runbook is different from delivered recovery or alerts.
- A useful service needs a recorded response route and a maintainer who accepts it.

Open on this node:

- What recovery or failure-response outcome has been demonstrated?

Recorded connections:

- Ownership / access → Failure and recovery: Per-service accountable operation to establish (proposed)


Sources: R21, R4, R5

## Useful checks

- Retrieve and correct one permitted record through the existing source index. — Existing source owner and one contributor. Evidence: A useful record found and corrected with its provenance retained.
- Record the latest activity-space connection test. — Jaggy and network operator; Nuno / Matthijs as knowledge contacts. Evidence: A dated end-to-end result and the actual equipment/cable route.
- Establish fixed-line order and delivery evidence. — Actual connectivity owner / provider. Evidence: Dated provider evidence or explicit no-order finding.
- Confirm the nonsecret Bitwarden access-request path. — Nuno as reported owner and actual authorised operator. Evidence: Ownership, cover and grant/revocation route without credentials.
- Trace one useful measurement from physical device to its display. — Home Assistant operator with relevant field expert. Evidence: Matched device, unit, timestamp and calibrated meaning.
- Confirm source ownership and permitted documentation for Closer. — Actual Closer operator; Paul as contributor contact. Evidence: Deployment/docs and issue-resolution owner identified without customer records.
- Identify the solar equipment and permitted reading route. — Ani as knowledge contact and actual equipment owner. Evidence: Model-specific reading context and current dated evidence.

## Sources and dates

- R1: Retained WOOLPACK infrastructure account · 2026-09-26
- R2: Wi-Fi account ingested and reconciled 7 October · 2026-10-07
- R3: Solar-app meeting synthesis · 2026-10-04
- R4: Home Assistant inventory and source reconciliation · 2026-10-07
- R5: Media host and catalogue dated checkpoints · 2026-10-04
- R6: Hosted bot lane and latest voice-acceptance requirements · 2026-09-23
- R7: Separate repository and local wiki source reconciliation · 2026-10-09
- R8: [Pulse event reader publication checkpoint](https://tdfpulse.com) · 2026-10-04
- R11: Closer and ecology retained source context · 2026-09-30
- R13: Selected community knowledge design · 2026-10-07
- R21: Direct infrastructure and contact corrections · 2026-10-09
- R22: Retained knowledge sources and discovery index · 2026-10-09
- R27: Meeting scope and confirmed identity corrections · 2026-10-09
- R28: Direct Closer contribution correction · 2026-10-09
- A1: Passwords and access ownership handoff · 2026-10-09
- D1: Multiple role holders and current role source · 2026-10-11
- V1: Connected atlas professional visibility review · 2026-10-11
- V2: Private knowledge-frontier source questions · 2026-10-11
- M1: Later meeting account and fixed-line discussion · 2026-10-09
