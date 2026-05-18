# Private workspace packages

This directory holds workspace packages marked `"private": true` in their `package.json` — internal tooling and prototypes that should not be published to npm. The `multipublish` and `changeset` configs already skip private packages, so adding one here is the only step required to keep it unpublished.
