import { UseCaseError } from 'src/shared/core/UseCaseError';
import { Either, Result } from '../../../../shared/core/Result';
import { EmailAlreadyExistsError } from './CreateUserErrors';

// export type CreateMemberResponse = Either<EmailAlreadyExistsError | Result<any>, Result<void>>;
export type CreateMemberResponse = Result<UseCaseError> | Result<void>;
