import { Member } from '../domain/member';
import { Member as PrismaMember, Prisma } from '@prisma/client';
import { MemberFirstName } from '../domain/memberFirstName';
import { MemberLastName } from '../domain/memberLastName';
import { MemberEmail } from '../domain/memberEmail';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';

export class MemberMapper {
  // public static toDomain(raw: any): IMember {
  //   return {
  //     id: raw?.id,
  //     email: raw?.email,
  //     firstName: raw?.firstName,
  //     lastName: raw?.lastName,
  //   };
  // }

  public static toDomain(prismaMember: PrismaMember): Member {
    const firstNameOrError = MemberFirstName.create({ firstName: prismaMember?.FirstName });
    const lastNameOrError = MemberLastName.create({ lastName: prismaMember?.LastName });
    const emailOrError = MemberEmail.create({ email: prismaMember?.Email });

    const memberOrError = Member.create(
      {
        email: emailOrError?.getValue(),
        firstName: firstNameOrError.getValue(),
        lastName: lastNameOrError?.getValue(),
      },
      new UniqueEntityID(prismaMember?.Id),
    );

    return memberOrError.getValue();
  }

  public static toPersistence(member: Member): Prisma.MemberCreateInput {
    return {
      FirstName: member.FirstName.value,
      LastName: member.LastName.value,
      Email: member.Email.value,
    };
  }
}
