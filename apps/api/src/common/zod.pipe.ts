import { type PipeTransform, UnprocessableEntityException } from '@nestjs/common';
import type { ValidationErrorBody } from '@plotline/shared';
import type { ZodType, ZodTypeDef } from 'zod';

/** Validates a body or query with a zod schema; failures are 422s that name each field. */
export class ZodPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T, ZodTypeDef, unknown>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value ?? {});
    if (result.success) return result.data;
    const errors = result.error.issues.map((i) => ({
      field: i.path.join('.') || '(body)',
      message: i.message,
    }));
    const body: ValidationErrorBody = {
      statusCode: 422,
      message: `Invalid ${[...new Set(errors.map((e) => e.field))].join(', ')}`,
      errors,
    };
    throw new UnprocessableEntityException(body);
  }
}
