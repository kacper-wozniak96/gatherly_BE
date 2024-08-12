import * as Joi from 'joi';

import { FailedField } from 'src/modules/User/domain/UserName';
import { ValueObject } from 'src/shared/core/ValueObject';
import { Result } from '../../../shared/core/Result';

interface PostTitleProps {
  value: string;
}

const postTitleSchema = Joi.string().alphanum().min(3).max(30).required();

export class PostTitle extends ValueObject<PostTitleProps> {
  private constructor(props: PostTitleProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(props: PostTitleProps): Result<PostTitle | FailedField> {
    const { error } = postTitleSchema.validate(props.value);

    if (error) {
      return Result.fail<FailedField>({ message: error.details[0].message, field: 'postTitle' });
    }

    return Result.ok<PostTitle>(new PostTitle(props));
  }
}
