# Marakeb

Marakeb is a car-rental business in Saudi Arabia's Eastern Province. Customers visit physical branches; admins manage those branches in the dashboard.

## Language

**Location**:
A physical Marakeb branch with a bilingual name and address, a phone number, weekly hours, a map pin, and a sort order.
_Avoid_: City, branch (in product language — the word is Location)

**Weekly hours**:
The seven-day opening schedule for a Location, Saturday first, with one open/close pair per day or Closed.
_Avoid_: Hours string, bilingual hours, overnight hours, Ramadan schedule

**Map pin**:
The stored latitude and longitude of a Location, used for the public map embed and Get Directions. Admins set it by pasting a Google Maps share link.
_Avoid_: Coordinates input, lat/lng fields (as the admin way to set a pin)

**Sort order**:
A number that decides the display order of Locations on the public site and in the admin list. Lower comes first.
_Avoid_: Priority, rank, position
