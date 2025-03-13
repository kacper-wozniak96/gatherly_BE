import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';
import { Result } from 'src/shared/core/Result';

interface UserAvatarProps {
  avatar: Express.Multer.File;
}

const avatarSchema = z.object({
  avatar: z.object({
    fieldname: z.string(),
    originalname: z.string().min(1, 'File name is required'),
    encoding: z.string(),
    mimetype: z.string().refine((val) => ['image/jpeg', 'image/png'].includes(val), {
      message: 'Invalid file type. Only JPEG and PNG are allowed.',
    }),
    size: z.number().max(5 * 1024 * 1024, 'File size should not exceed 5MB'),
    buffer: z.instanceof(Buffer),
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
    type TValue = z.infer<typeof avatarSchema>;
    const validationResult = this.validate<TValue>(avatarSchema, {
      avatar: props.avatar,
    });

    if (!validationResult.isValid) {
      return validationResult.failedResult;
    }

    return Result.ok<UserAvatar>(new UserAvatar(props));
  }
}
