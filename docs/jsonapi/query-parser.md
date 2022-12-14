# The Query parser

The purpose of the query parser is to validate and translate your query string into a structured element.

!!! danger
    Subject to changes.

You can change the queryParser for a route in a jsonApi method decorator.

```ts
  @JsonApiList({
    queryParser: QueryParser
  })
```