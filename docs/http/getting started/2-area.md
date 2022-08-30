# Creating an Area

An area is a kind of 'super' controller that have multiple controllers as childen.
Even if the concept of an Area is unknown to NFW itself, it can be easily created.

```ts 
@Controller({ // (1)
    controllers: [UsersController],
    routeName: '/api/v1'
})
export class Area {}
```

1. Behind the scene, the Http Building block is applied by the decorator.

We are just telling to the builder that the controller is the parent of `UsersController`.

This controller will also apply the prefix `/api/v1` to every sub-controllers.

