import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';
import { Result } from '../../../shared/core/Result';

interface UserAvatarProps {
  avatar: Express.Multer.File;
}

const schema = z.object({
  avatar: z.object({
    size: z.number().max(5 * 1024 * 1024, { message: 'Max file size is 5MB' }),
    mimetype: z.enum(['image/jpeg', 'image/png'], { message: 'Only JPEG and PNG files are allowed' }),
    buffer: z.instanceof(Buffer, { message: 'Buffer must be a valid Buffer instance' }),
  }),
});

export class UserAvatar extends ValueObject<UserAvatarProps> {
  private constructor(props: UserAvatarProps) {
    super(props);
  }

  get value(): Express.Multer.File {
    return this.props.avatar;
  }

  public static create(props: UserAvatarProps): Result<UserAvatar> | Result<IFailedField> {
    const validationResult = schema.safeParse(props);

    if (!validationResult.success) {
      const error = validationResult.error.errors[0];

      console.log({ error });

      return Result.fail<IFailedField>({
        message: error.message,
        field: 'avatar',
      });
    }

    return Result.ok<UserAvatar>(new UserAvatar(props));
  }
}

// {
//   file: {
//     fieldname: 'file',
//     originalname: 'maryja.jpg',
//     encoding: '7bit',
//     mimetype: 'image/jpeg',
//     buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 43 00 04 03 03 04 03 03 04 04 04 04 05 05 04 05 07 0b 07 07 06 06 07 0e 0a 0a 08 ... 55583 more bytes>,
//     size: 55633
//   }
// }
