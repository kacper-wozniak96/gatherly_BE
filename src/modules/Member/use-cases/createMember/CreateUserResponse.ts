import { UseCaseError } from 'src/shared/core/UseCaseError';
import { Result } from '../../../../shared/core/Result';

// export type CreateMemberResponse = Either<EmailAlreadyExistsError | Result<any>, Result<void>>;
export type CreateMemberResponse = Result<UseCaseError> | Result<void>;
