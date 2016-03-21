'use strict';

var Joi = require('joi');

var schema = Joi.object().keys({
    data: Joi.array().items(Joi.object().keys({
        type: Joi.string().required(),
        id: [
            Joi.number(),
            Joi.string()
        ],
        attributes: Joi.object(),
        relationships: Joi.object().pattern(/\w/, Joi.object().keys({
            links: Joi.object().keys({
                self: [
                    Joi.string(),
                    Joi.object().keys({
                        href: Joi.string(),
                        meta: Joi.object()
                    })
                ],
                related: [
                    Joi.string(),
                    Joi.object().keys({
                        href: Joi.string(),
                        meta: Joi.object()
                    })
                ]
            }),
            data: Joi.array().items(Joi.object().keys({
                type: Joi.string().required(),
                id: [
                    Joi.number().required(),
                    Joi.string().required()
                ],
                meta: Joi.object()
            })).single(),
            meta: Joi.object()
        }).or('links', 'data', 'meta')),
        links: Joi.object().keys({
            self: [
                Joi.string(),
                Joi.object().keys({
                    href: Joi.string(),
                    meta: Joi.object()
                })
            ]
        }),
        meta: Joi.object()
    })).single(),
    errors: Joi.array().items(Joi.object().keys({
        id: [
            Joi.number(),
            Joi.string()
        ],
        links: Joi.object().keys({
            about: [
                Joi.object().keys({
                    href: Joi.string(),
                    meta: Joi.object()
                }),
                Joi.string()
            ]
        }),
        status: Joi.string(),
        code: Joi.string(),
        title: Joi.string(),
        detail: Joi.string(),
        source: Joi.object().keys({
            pointer: Joi.string(),
            parameter: Joi.string()
        }),
        meta: Joi.object().keys()
    })),
    meta: Joi.object(),
    jsonapi: Joi.object().keys({
        version: Joi.string()
    }),
    links: Joi.object().keys({
        self: [
            Joi.string(),
            Joi.object().keys({
                href: Joi.string(),
                meta: Joi.object()
            })
        ],
        first: Joi.string(),
        last: Joi.string(),
        prev: Joi.string(),
        next: Joi.string()
    }),
    included: Joi.array().items(Joi.object().keys({
        type: Joi.string().required(),
        id: [
            Joi.number(),
            Joi.string()
        ],
        attributes: Joi.object(),
        relationships: Joi.object().keys({
            links: Joi.object().keys({
                self: [
                    Joi.string(),
                    Joi.object().keys({
                        href: Joi.string(),
                        meta: Joi.object()
                    })
                ],
                related: [
                    Joi.string(),
                    Joi.object().keys({
                        href: Joi.string(),
                        meta: Joi.object()
                    })
                ]
            }),
            data: Joi.array().items(Joi.object().keys({
                type: Joi.string().required(),
                id: [
                    Joi.number(),
                    Joi.string()
                ],
                meta: Joi.object()
            })).single(),
            meta: Joi.object()
        }).or('links', 'data', 'meta'),
        links: Joi.object().keys({
            self: [
                Joi.string(),
                Joi.object().keys({
                    href: Joi.string(),
                    meta: Joi.object()
                })
            ]
        }),
        meta: Joi.object()
    })),
}).without('data', 'errors');

module.exports = schema;
