# Address Verification

- NodeJS
- Express
- Postgres
- Google Map Geocode API

#### How to install
```npm install```

#### How to seed DB
```npm run db:reset```

#### How to run
```npm run dev```

#### How to run tests
```npm run test```

also included postman json file for integration tests

example CURL:
```
curl -X POST \
  http://localhost:3001/address/verify \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '[{
    "address_line_one": "525 W Santa Clara St",
    "city": "San Jose",
    "state": "CA",
    "zip_code": "95113"
}]'
```

## Design
### Consideration
- I think there are 2 approach that can be taken with this problem. First is to be less strict about how address matches to the DB dataset and what returns from google.  This generally will allow more address being validated and potentially more false positive. Second is to be more strict about validation, enforce exact match, this will reject more addresses, but there won't be false positives.  However, the address that does not match the official name will be reject.  IE - Mount Laurel vs Mount Laurel Township.  I took apprach #2 because it's easier to enforce strict DB and relax it later than to relax and have to clean up later.
- There are a lot of edge cases, probably more than I'm aware of, so adding a logger to log the rejected addresses and google returned address could help look at some of the rejected cases.  Since google map API does fuzzy matching, it would be interesting to compare dataset and see how to relax matching function and create something more robust.
- Since the premise of this design is to be strict with data, it was important to make sure that we normalize all the data.  An parsing address lib was used heavily to standarize street prefix, street type, street sufix, and state.

### Logic flow chart
[![](https://mermaid.ink/img/eyJjb2RlIjoiJSV7aW5pdDoge1widGhlbWVcIjogXCJmb3Jlc3RcIiwgXCJsb2dMZXZlbFwiOiAxIH19JSVcbmdyYXBoIFREXG4gIEFbYWRkcmVzcy92ZXJpZnldIC0tPiBCKHZhbGlkYXRlIGRhdGEpXG4gIEIgLS0-fGZhaWxlZCBwYXJhbSB2YWxpZGF0aW9ufCBaKGVycm9yKVxuICBCIC0tPnxwYXNzZWQgdmFsaWRhdGlvbnxDKGFkZHJlc3NIYW5kbGVyKVxuICBDIC0tPnxlYWNoIGFkZHJlc3N8IERbREIgdmFsaWRhdGlvbl1cbiAgRCAtLT58RG9lcyBub3QgZXhpc3R8IEVbTWFwIFNlcnZpY2UgdmFsaWRhdGlvbl1cbiAgRSAtLT58dmFsaWQgb3Igbm90fFdcblx0RCAtLT58dmFsaWRhdGVkfFcocmV0dXJuKVxuICBFIC0tPnx2YWxpZGF0ZWR8WCh3cml0ZSB0byBEQikiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGFyayJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)](https://mermaid-js.github.io/docs/mermaid-live-editor-beta/#/edit/eyJjb2RlIjoiJSV7aW5pdDoge1widGhlbWVcIjogXCJmb3Jlc3RcIiwgXCJsb2dMZXZlbFwiOiAxIH19JSVcbmdyYXBoIFREXG4gIEFbYWRkcmVzcy92ZXJpZnldIC0tPiBCKHZhbGlkYXRlIGRhdGEpXG4gIEIgLS0-fGZhaWxlZCBwYXJhbSB2YWxpZGF0aW9ufCBaKGVycm9yKVxuICBCIC0tPnxwYXNzZWQgdmFsaWRhdGlvbnxDKGFkZHJlc3NIYW5kbGVyKVxuICBDIC0tPnxlYWNoIGFkZHJlc3N8IERbREIgdmFsaWRhdGlvbl1cbiAgRCAtLT58RG9lcyBub3QgZXhpc3R8IEVbTWFwIFNlcnZpY2UgdmFsaWRhdGlvbl1cbiAgRSAtLT58dmFsaWQgb3Igbm90fFdcblx0RCAtLT58dmFsaWRhdGVkfFcocmV0dXJuKVxuICBFIC0tPnx2YWxpZGF0ZWR8WCh3cml0ZSB0byBEQikiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGFyayJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)

### Database Design
[![](https://mermaid.ink/img/eyJjb2RlIjoiY2xhc3NEaWFncmFtXG5cdEFkZHJlc3MgLS0gQ2l0eVN0YXRlWmlwIDogb25lIHRvIG1hbnlcbiAgQWRkcmVzcyA6IEludCBpZFxuXHRBZGRyZXNzIDogU3RyaW5nIHN0cmVldFxuICBBZGRyZXNzIDogU3RyaW5nIGNpdHlTdGF0ZVppcElkXG4gIEFkZHJlc3MgOiBGbG9hdCBsYXRcbiAgQWRkcmVzcyA6IEZsb2F0IGxvblxuICBBZGRyZXNzIDogRGF0ZSBjcmVhdGVkX2F0XG4gIEFkZHJlc3MgOiBEYXRlIHVwZGF0ZWRfYXRcblx0Y2xhc3MgQ2l0eVN0YXRlWmlwIHtcbiAgICBJbnQgaWRcblx0XHRTdHJpbmcgY2l0eVxuICAgIFN0cmluZyBzdGF0ZVxuICAgIFN0cmluZyB6aXBfY29kZVxuICAgIERhdGUgY3JlYXRlZF9hdFxuICAgIERhdGUgdXBkYXRlZF9hdFxuXHR9XG5cdFx0XHRcdFx0IiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)](https://mermaid-js.github.io/docs/mermaid-live-editor-beta/#/edit/eyJjb2RlIjoiY2xhc3NEaWFncmFtXG5cdEFkZHJlc3MgLS0gQ2l0eVN0YXRlWmlwIDogb25lIHRvIG1hbnlcbiAgQWRkcmVzcyA6IEludCBpZFxuXHRBZGRyZXNzIDogU3RyaW5nIHN0cmVldFxuICBBZGRyZXNzIDogU3RyaW5nIGNpdHlTdGF0ZVppcElkXG4gIEFkZHJlc3MgOiBGbG9hdCBsYXRcbiAgQWRkcmVzcyA6IEZsb2F0IGxvblxuICBBZGRyZXNzIDogRGF0ZSBjcmVhdGVkX2F0XG4gIEFkZHJlc3MgOiBEYXRlIHVwZGF0ZWRfYXRcblx0Y2xhc3MgQ2l0eVN0YXRlWmlwIHtcbiAgICBJbnQgaWRcblx0XHRTdHJpbmcgY2l0eVxuICAgIFN0cmluZyBzdGF0ZVxuICAgIFN0cmluZyB6aXBfY29kZVxuICAgIERhdGUgY3JlYXRlZF9hdFxuICAgIERhdGUgdXBkYXRlZF9hdFxuXHR9XG5cdFx0XHRcdFx0IiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)
