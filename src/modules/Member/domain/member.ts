import { AggregateRoot } from 'src/shared/core/AggregateRoot';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { MemberId } from './memberId';
import { MemberFirstName } from './memberFirstName';
import { MemberLastName } from './memberLastName';
import { MemberEmail } from './memberEmail';

export interface MemberProps {
  firstName: MemberFirstName;
  lastName: MemberLastName;
  email: MemberEmail;
}

export class Member extends AggregateRoot<MemberProps> {
  private constructor(props: MemberProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: MemberProps, id?: UniqueEntityID): Result<Member> {
    const isNewMember = !!id;

    const member = new Member(props, id);

    if (isNewMember) {
      // Do something
    }

    return Result.ok<Member>(member);
  }

  get memberId() {
    return MemberId.create(this._id).getValue();
  }

  get FirstName() {
    return this.props.firstName;
  }

  get LastName() {
    return this.props.lastName;
  }

  get Email() {
    return this.props.email;
  }
}
