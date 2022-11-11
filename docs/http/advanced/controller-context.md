# Controller Context

![](/../assets/controller-context.png){ loading=lazy style="height:450px;width:300px" }

The controller is available when code is executed inside the controller class. That's the case for **guards**, **controller action** and **response handlers**.

The controller context actually contains these informations:

- controllerInstance: The instance of the controller
- controllerAction: The controller action name (A.K.A the called method)

The context can be accessed by using the `@ControllerContext` param.

## Example

```ts
@Controller('/')
class Controller {
    public list(@ControllerContext() context: ControllerContextInterface) {
        console.log(context);
    }
}
```

