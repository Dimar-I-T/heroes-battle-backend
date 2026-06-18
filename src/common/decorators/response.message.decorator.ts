import { SetMetadata } from "@nestjs/common";

export const response_message_key = 'response_message';
export const ResponseMessage = (message: string) => {
    return SetMetadata(response_message_key, message);
}