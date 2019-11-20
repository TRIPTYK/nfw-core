import { getCustomRepository } from "typeorm";

export function Controller({repository}) {
    return function (constructor : Function) {
        constructor.prototype.repository = getCustomRepository(repository);
    }
}
