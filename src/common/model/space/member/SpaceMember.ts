import BaseEntity from "../../base/BaseEntity";
import User from "../../user/User";
import {SpaceMemberRole} from "./SpaceMemberRole";

export default class Space extends BaseEntity {
    spaceUuid: string | null = null
    userUuid: string | null = null
    role: SpaceMemberRole | null = null
    user: User | null = null

    constructor(reactComponent?: React.Component) {

        super(reactComponent);

    }

    assign(obj: any) {
        super.assign(obj);
        this.assignEntity("user", User)
    }


}