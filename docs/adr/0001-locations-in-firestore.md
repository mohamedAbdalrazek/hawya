# Locations live in Firestore

Public Location copy used to live in i18n messages, with phones and coordinates hardcoded in the client. An admin could not change a branch without a deploy, and English and Arabic hour strings could drift. We store Locations in Firestore and format weekly hours per locale at read time. Admins set the map pin by pasting a Google Maps share link; the server extracts latitude and longitude so the public embed and Get Directions stay coord-based.

## Considered Options

- Keep names, addresses, and hours in i18n and only store phone and coordinates — copy would still need a deploy and could drift
- Free-text bilingual hours — a smaller form, but Friday exceptions stay unstructured and EN/AR can disagree
- Admin types latitude and longitude — more error-prone than a pasted Maps link

## Consequences

- Home, `/locations`, and the footer all read the same Firestore collection
- EN/AR hour strings are derived, not stored
- Booking pickup and dropoff stay out of this model
