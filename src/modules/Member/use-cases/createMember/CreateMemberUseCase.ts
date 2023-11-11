import { Inject, ForbiddenException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { IMemberRepo } from '../../utils/types';
import { MemberRepoSymbol } from '../../utils/symbols';
import { UseCase } from 'src/shared/core/UseCase';
import { CreateMemberDTO } from './CreateUserDTO';
import { MemberFirstName } from '../../domain/memberFirstName';
import { MemberLastName } from '../../domain/memberLastName';
import { MemberEmail } from '../../domain/memberEmail';
import { Result, left } from 'src/shared/core/Result';
import { Member } from '../../domain/member';
import { CreateMemberResponse } from './CreateUserResponse';
import { CreateMemberErrors, EmailAlreadyExistsError } from './CreateUserErrors';

@Injectable()
export class CreateMemberUseCase implements UseCase<CreateMemberDTO, Promise<void>> {
  constructor(@Inject(MemberRepoSymbol) private readonly memberRepo: IMemberRepo) {}

  async execute(createMemberDTO: CreateMemberDTO): Promise<void> {
    const firstNameOrError = MemberFirstName.create({ firstName: createMemberDTO?.firstName });
    const lastNameOrError = MemberLastName.create({ lastName: createMemberDTO?.lastName });
    const emailOrError = MemberEmail.create({ email: createMemberDTO?.firstName });

    const failedResults = Result.returnFailedResults([emailOrError, firstNameOrError, lastNameOrError]);

    // if (failedResults?.length) throw new ForbiddenException(Result.returnErrorValuesFromResults(failedResults));
    if (failedResults?.length) {
      // return left(new CreateMemberErrors.ValueObjectValidationError(Result.returnErrorValuesFromResults(failedResults)));
      throw new ForbiddenException(new CreateMemberErrors.ValueObjectValidationError(Result.returnErrorValuesFromResults(failedResults)));
    }

    const firstName: MemberFirstName = firstNameOrError.getValue();
    const lastName: MemberLastName = lastNameOrError.getValue();
    const email: MemberEmail = emailOrError.getValue();

    const alreadyCreatedMemberWithThatEmail = await this.memberRepo.getMemberByEmail(email.value);

    // if (alreadyCreatedMemberWithThatEmail) throw new ForbiddenException('Email already exists');
    if (alreadyCreatedMemberWithThatEmail) {
      // Result.fail(new EmailAlreadyExistsError());
      // return left(new CreateMemberErrors.EmailAlreadyExistsError());
      throw new ForbiddenException(new CreateMemberErrors.EmailAlreadyExistsError());
    }

    const memberOrError: Result<Member> = Member.create({
      firstName,
      lastName,
      email,
    });

    const member: Member = memberOrError.getValue();

    await this.memberRepo.save(member);

    return;
  }
}
