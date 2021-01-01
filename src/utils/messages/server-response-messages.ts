import { HttpException, HttpStatus } from '@nestjs/common';

export const serverErrorMessage = () => {
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
) => {
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
    successCode: number
) => {
    return {
        message: [successMessage],
        statusCode: successCode
    }
}