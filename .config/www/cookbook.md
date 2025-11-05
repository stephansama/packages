# Cookbook

- [`curl`](https://curl.se/docs/manpage.html)
- [`fzf`](https://junegunn.github.io/fzf/) (for scripts that require interactivity)
- [`jq`](https://jqlang.org/)

## View all package versions

```sh
curl https://packages.stephansama.info/meta.json --silent |
 jq -r 'map(select(.name | test("@stephansama"))) | map(.name + " - v" + .version) | .[]'
```

## Get `package.json` of a specific package

```sh
tmp=$(curl https://packages.stephansama.info/meta.json --silent) &&
 selected=$(echo "$tmp" | jq -r 'map(select(.name | test("@stephansama"))) | map(.name) | .[]' | fzf) &&
 echo "$selected" &&
 echo "$tmp" | jq -r ".[] | select(.name == \"$selected\")" &&
 unset selected && unset tmp
```

## Get scripts of a specific

```sh
tmp=$(curl https://packages.stephansama.info/meta.json --silent) &&
 selected=$(echo "$tmp" | jq -r 'map(select(.name | test("@stephansama"))) | map(.name) | .[]' | fzf) &&
 echo "$selected" &&
 echo "$tmp" | jq -r ".[] | select(.name == \"$selected\") | .scripts" &&
 unset selected && unset tmp

```

## Get dependencies of a specific package

```sh
tmp=$(curl https://packages.stephansama.info/meta.json --silent) &&
 selected=$(echo "$tmp" | jq -r 'map(select(.name | test("@stephansama"))) | map(.name) | .[]' | fzf) &&
 echo "$selected" &&
 echo "$tmp" | jq -r ".[] | select(.name == \"$selected\") | {dependencies, devDependencies,peerDependencies}" &&
 unset selected && unset tmp
```

## View all example versions

```sh
curl https://packages.stephansama.info/meta.json --silent |
 jq -r 'map(select(.name | test("@example"))) | map(.name + " - v" + .version) | .[]'
```
