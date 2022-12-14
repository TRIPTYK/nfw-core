# Deserializers

The purpose of the deserializer is to transform your request body into a `Resource` instance.

By default, the `ResourceDeserializer` is used.

You can override the serializer in the `Resource`.

```ts
@JsonApiResource({
  ...
  deserializer: DocumentDeserializer,
})
```
