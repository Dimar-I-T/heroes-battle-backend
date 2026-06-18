import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { response_message_key } from '../decorators/response.message.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const customMessage = this.reflector.get<string>(
            response_message_key,
            context.getHandler()
        )
        return next.handle().pipe(
            map(data => ({
                success: true,
                message: customMessage ?? 'Success',
                data,
            })),
        );
    }
}