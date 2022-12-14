# Serializers

The purpose of the serializer is to transform a `Resource` into a jsonapi payload.

It will also apply the links, meta and check which attributes should be sent to the client.

By default, the `ResourceSerializer` is used.

The serializer will also check if the related and relationships links should be included into the payload. In case the relationships endpoint of the controller is disabled.

You can override the serializer in the `Resource`.

```ts
@JsonApiResource({
   ...
  serializer: PaginatedSerializer
})
```
