#! /usr/bin/env node
import SwaggerParser from '@apidevtools/swagger-parser';
import { createClient } from '@hey-api/openapi-ts';

function generateApiName(apiObject) {
    const { id } = apiObject;
    // Pattern to match and remove: Api + ServiceName (PascalCase word ending with "Service")
    // This regex will match "Api" followed by any PascalCase service name
    const cleanedName = id.replace(/Api[A-Z][a-zA-Z]*Service/g, '');
    return cleanedName;
}

async function dereference(baseUrl, service) {
    const url = `${baseUrl}/swagger-json/${service}/swagger/v1/swagger.json`
    const file = await fetch(url).then(res => res.json()).catch(err => console.error(err));
    try {
        const parser = new SwaggerParser();
        const api = await parser.validate(file)
        console.log(`🎁 Dereferencing ${service} is from ${url} done.`);
        return api;
    } catch (err) {
        console.log(`❌ Dereferencing ${service} is from ${url} errored.`, err);
        return null;
    }
}

async function main() {
    const baseUrl = process.argv[2];
    const service = process.argv[3];
    const input = await dereference(baseUrl, service);
    if (!input) {
        process.exit(1);
    }
    createClient({
        input,
        output: {
            format: 'prettier',
            lint: 'eslint',
            path: `${service}Service`,
        },
        plugins: [
            {
                name: '@hey-api/schemas',
                type: 'json',
                nameBuilder: (name) => `$${name}`,
            },
            {
                dates: true,
                name: '@hey-api/transformers',
            },
            {
                enums: 'javascript',
                name: '@hey-api/typescript',
            },
            {
                name: '@hey-api/sdk',

                asClass: true,
                methodNameBuilder: generateApiName,
                classNameBuilder: `${service}_{{name}}`,
                client: "@hey-api/client-next",

            },
            {
                strictBaseUrls: true,
                exportFromIndex: true,
                bundle: true,
                name: '@hey-api/client-next',
            }
        ],
        logs: {
            level: "warn"
        },
    });
}

main();