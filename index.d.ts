
export declare type FidaaCallback = (
    error?: any,
    response?: any
) => void


export interface FidaaConfig {
    [key: string]: any
}

export interface FidaaRequestConfig {
    url: string;
    method: string;
    config?: FidaaConfig;
    callback?: FidaaCallback
}


export interface FidaaCallbacksResponse {
    error: any;
    success: any;
}