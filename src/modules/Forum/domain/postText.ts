import * as Joi from 'joi';

import { FailedField } from 'src/modules/User/domain/UserName';
import { ValueObject } from 'src/shared/core/ValueObject';
import { Result } from '../../../shared/core/Result';

interface PostTextProps {
  value: string;
}

const postTextSchema = Joi.string().alphanum().min(3).max(30).required();

export class PostText extends ValueObject<PostTextProps> {
  private constructor(props: PostTextProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(props: PostTextProps): Result<PostText | FailedField> {
    const { error } = postTextSchema.validate(props.value);

    if (error) {
      return Result.fail<FailedField>({ message: error.details[0].message, field: 'postText' });
    }

    return Result.ok<PostText>(new PostText(props));
  }
}
