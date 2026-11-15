# ColombiaTransit

This branch (`colombiatransit`) is HSL's Digitransit-UI (`v3`) plus the
ColombiaTransit theme for https://colombiatransit.co.

## What is ours

| File | |
|---|---|
| `server/configs/config.colombiatransit.js` | URLs, languages (es, en), feeds, map area, texts |
| `styles/themes/colombiatransit/theme.scss` | colours (primary `#dc0451`) |
| `app/assets/images/colombiatransit/` | navbar logo and favicon |
| `server/configs/config.default.js` | one line: `colombiatransit` in `themeMap` |
| `.github/workflows/colombiatransit-image.yml` | builds `ghcr.io/colombiatransit/digitransit-ui` |
| `colombiatransit/` | compose file, Traefik file, this README |

The work from 2024 (old config, theme, logos and the airplane changes) is kept
on the branch `mvanlaar-airplanes`.

## Backends

| | URL |
|---|---|
| OTP (GraphQL) | `https://apiv2.colombiatransit.co/api/otp/gtfs/v1` |
| Stops on the map | `https://apiv2.colombiatransit.co/api/otp/routers/default/vectorTiles/stops,stations/` |
| Pelias | `https://apiv2.colombiatransit.co/api/pelias/v1` |
| Background map | `https://tileserver.colombiatransit.co/styles/osm-bright/` |

OTP runs from [ColombiaTransit/otp-docker](https://github.com/ColombiaTransit/otp-docker);
its `traefik/api-otp.yml` publishes the GraphQL API and the vector tiles.

## Image and deployment

Every push to this branch builds the image with `CONFIG=colombiatransit` and
publishes it to `ghcr.io/colombiatransit/digitransit-ui` (`latest`, `YYYYMMDD`,
`sha-<commit>`).

Portainer: *Stacks → Add stack → Repository*, repository
`https://github.com/ColombiaTransit/digitransit-ui`, reference
`refs/heads/colombiatransit`, compose path `colombiatransit/docker-compose.yml`.
Then copy [`traefik.yml`](traefik.yml) into Traefik's file provider directory
(next to `api-pelias.yml`).

## Updating from HSL

```sh
git fetch upstream v3
git checkout colombiatransit
git merge upstream/v3
git push
```

Our changes are new files plus one line in `config.default.js`, so merges
rarely conflict.
