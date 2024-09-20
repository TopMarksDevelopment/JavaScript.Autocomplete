'use strict';

import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...compat.extends(
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ),
    {
        plugins: {
            '@stylistic': stylistic,
            '@typescript-eslint': typescriptEslint,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.commonjs,
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: 12,
            sourceType: 'commonjs',
        },

        rules: {
            strict: 'error',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-this-alias': [
                'error',
                { allowedNames: ['that', 'subThat'] },
            ],

            '@typescript-eslint/naming-convention': [
                'warn',
                {
                    selector: 'function',
                    format: ['camelCase'],
                },
            ],

            '@stylistic/semi': 'warn',
            semi: 'off',
            'getter-return': 'warn',
            'no-dupe-args': 'warn',
            'no-dupe-else-if': 'warn',
            'no-dupe-keys': 'warn',
            'no-duplicate-case': 'warn',
            'no-empty': 'warn',
            'accessor-pairs': 'warn',
            'array-callback-return': 'warn',
            'block-scoped-var': 'warn',
            'class-methods-use-this': 'warn',
            complexity: 'warn',
            'consistent-return': 'warn',
            curly: 'warn',
            'default-case': 'warn',
            'default-case-last': 'warn',
            'default-param-last': 'warn',
            'dot-location': 'off',
            'dot-notation': 'warn',
            eqeqeq: 'warn',
            'grouped-accessor-pairs': 'warn',
            'guard-for-in': 'off',
            'max-classes-per-file': ['warn', 2],
            'no-alert': 'warn',
            'no-caller': 'warn',
            'no-case-declarations': 'off',
            'no-constructor-return': 'warn',
            'no-div-regex': 'warn',
            'no-else-return': 'warn',
            'no-empty-function': 'warn',
            'no-empty-pattern': 'warn',
            'no-eq-null': 'warn',
            'no-eval': 'warn',
            'no-extend-native': 'off',
            'no-extra-bind': 'warn',
            'no-extra-label': 'warn',
            'no-fallthrough': 'warn',
            'no-floating-decimal': 'warn',
            'no-global-assign': 'warn',
            'no-implicit-coercion': 'warn',
            'no-implicit-globals': 'warn',
            'no-implied-eval': 'warn',
            'no-invalid-this': 'off',
            'no-iterator': 'warn',
            'no-labels': 'warn',
            'no-lone-blocks': 'warn',
            'no-loop-func': 'warn',
            'no-magic-numbers': 'off',
            'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
            'no-multi-spaces': 'warn',
            'no-multi-str': 'warn',
            'no-new': 'warn',
            'no-new-func': 'warn',
            'no-new-wrappers': 'warn',
            'no-octal': 'warn',
            'no-octal-escape': 'warn',
            'no-param-reassign': 'warn',
            'no-proto': 'warn',
            'no-redeclare': 'off',
            'no-restricted-properties': 'warn',
            'no-return-assign': 'warn',
            'no-return-await': 'warn',
            'no-script-url': 'warn',
            'no-self-assign': 'warn',
            'no-self-compare': 'warn',
            'no-sequences': 'warn',
            'no-throw-literal': 'warn',
            'no-unmodified-loop-condition': 'warn',
            'no-unused-expressions': 'warn',
            'no-unused-labels': 'warn',
            'no-useless-call': 'warn',
            'no-useless-catch': 'warn',
            'no-useless-concat': 'warn',
            'no-useless-escape': 'warn',
            'no-useless-return': 'warn',
            'no-void': 'warn',
            'no-warning-comments': 'warn',
            'no-with': 'warn',
            'prefer-named-capture-group': 'warn',
            'prefer-promise-reject-errors': 'off',
            'prefer-regex-literals': 'warn',
            radix: 'warn',
            'require-await': 'warn',
            'require-unicode-regexp': 'off',
            'vars-on-top': 'warn',
            'wrap-iife': 'warn',
        },
    },
];
