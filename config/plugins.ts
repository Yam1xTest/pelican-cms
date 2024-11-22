export default ({ env }) => ({
    upload: {
        config: {
            provider: 'aws-s3',
            providerOptions: {
                s3Options: {
                    credentials: {
                        accessKeyId: env('AWS_ACCESS_KEY_ID'),
                        secretAccessKey: env('AWS_ACCESS_SECRET_KEY'),
                    },
                    endpoint: env('AWS_ENDPOINT'),
                    region: env('AWS_REGION'),
                    forcePathStyle: true,
                    params: {
                        ACL: env('AWS_ACL', 'public-read'),
                        Bucket: env('AWS_BUCKET'),
                    },
                }
            },
        },
    },
    'transformer': {
        enabled: true,
        config: {
            responseTransforms: {
                removeAttributesKey: true,
                removeDataKey: true,
            },
        },
    },
    "content-versioning": {
        enabled: true,
    },
    'preview-button': {
        config: {
            contentTypes: [
                {
                    uid: 'api::home.home',
                    draft: {
                        url: env('FRONTEND_PREVIEW_URL'),
                        query: {
                            slug: '{slug}',
                            version: '{versionNumber}',
                            secret: env('PREVIEW_SECRET'),
                        },
                        openTarget: '_blank',
                        alwaysVisible: true,
                    },
                    published: {
                        url: env('FRONTEND_URL'),
                        openTarget: '_blank',
                    },
                },
            ]
        }
    },
});
