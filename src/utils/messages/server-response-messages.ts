import { HttpException, HttpStatus } from '@nestjs/common';
import { Users } from 'src/users-auth/users.entity';

type ErrorMessageFormat = {
    message: string[];
    error: string;
    statusCode: number;
}

type SuccessMessageFormat = {
    message: string[];
    statusCode: number;
    data?: Users
}

export const serverErrorMessage = (): ErrorMessageFormat => {
    throw new HttpException(
        {
            message: ['Server encountered a problem'],
            error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
    )
}

export const serverFailureMessage = (
    failureMessage: string,
    failureError: string,
    failureCode: number
): ErrorMessageFormat => {
    throw new HttpException(
        {
            message: [failureMessage],
            error: failureError,
        },
        failureCode
    )
}

export const serverSuccessMessage = (
    successMessage: string,
    successCode: number,
    successData?: Users
): SuccessMessageFormat => {
    return {
        message: [successMessage],
        statusCode: successCode,
        data: successData
    }
}