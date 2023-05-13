import BaseEntity from "../base/BaseEntity";
import User from "../user/User";

export default class Space extends BaseEntity {

    userUuid: string | null = null
    user: User | null = null

    constructor(reactComponent?: React.Component) {

        super(reactComponent);

    }

    assign(obj: any) {
        super.assign(obj);
        this.assignEntity("user", User)
    }


}