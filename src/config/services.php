<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI'),
    ],

    'bulksms' => [
        'api_key' => env('BULKSMS_API_KEY'),
        'sender_id' => env('BULKSMS_SENDER_ID', '8809648907781'),
        'url' => env('BULKSMS_URL', 'http://bulksmsbd.net/api/smsapi'),
        'balance_url' => env('BULKSMS_BALANCE_URL', 'http://bulksmsbd.net/api/getBalanceApi'),
    ],

    'pathao' => [
        'base_url'         => env('PATHAO_BASE_URL', 'https://courier-api-sandbox.pathao.com'),
        'client_id'        => env('PATHAO_CLIENT_ID'),
        'client_secret'    => env('PATHAO_CLIENT_SECRET'),
        'username'         => env('PATHAO_USERNAME'),
        'password'         => env('PATHAO_PASSWORD'),
        'webhook_token'    => env('PATHAO_WEBHOOK_TOKEN'),
        'default_store_id' => env('PATHAO_DEFAULT_STORE_ID'),
        'regular_fee'      => (int) env('PATHAO_REGULAR_FEE', 80),
        'express_fee'      => (int) env('PATHAO_EXPRESS_FEE', 150),
    ],

];
