## Error: GetEnv.NoBoolean: TRUE is not a boolean

The `getenv` package parses `true` and `false` as booleans, but does not do so for the uppercase variants. Unfortunately Xcode Cloud uses `CI=TRUE`.

This patch can be removed once https://github.com/ctavan/node-getenv/pull/22 merged.