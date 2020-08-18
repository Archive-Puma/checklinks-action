# Check Links Action

## Inputs

### `file`

**Required** The name of the Markdown file. Default `"README.md"`.

## Outputs

### `deadlinks`

Collections of all the dead links. (Status code: 400)

## Example usage

```yaml
uses: cosasdepuma/checklinks@v1
with:
  file: 'README.md'
```