import { Entity } from 'src/utils/baseEntity';
import { IMember } from '../utils/types';

export class Member extends Entity<IMember> {
  private constructor(props: IMember, id?: number) {
    super(props, id);
  }

  public static create(props: IMember, id?: number): Member {
    return new Member(props, id);
  }

  get Id() {
    return this.props.id;
  }

  get Name() {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get Email() {
    return this.props.email;
  }
}
