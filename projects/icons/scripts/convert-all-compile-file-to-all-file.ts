import {rollup, RollupOptions} from 'rollup';
import typescript, {RPT2Options} from 'rollup-plugin-typescript2';

import {tuiRollupSvgo} from './rollup-svgo';

const banner = `
/**
 * @description:
 * DO NOT CHANGE THIS FILE. AUTOGENERATED
 *
 * This file contains inline svg icons
 * for users who wants insert into js bundle
 */
`;

interface Options {
    from: string;
    include: string;
    prt2Options: RPT2Options;
    to: string;
}

export async function tuiConvertAllCompileFileToAllFile(config: Options): Promise<void> {
    const {from, to, prt2Options, include} = config;

    const inputOptions: RollupOptions = {
        input: from,
        output: {
            generatedCode: {
                constBindings: true,
            },
        },
        plugins: [
            typescript(prt2Options),
            tuiRollupSvgo({
                include,
                options: {
                    plugins: [
                        {
                            name: `preset-default`,
                            params: {
                                overrides: {
                                    removeViewBox: false,
                                    collapseGroups: false,
                                    removeUnknownsAndDefaults: false,
                                    cleanupIds: {},
                                    sortAttrs: {
                                        xmlnsOrder: `alphabetical`,
                                    },
                                },
                            },
                        },
                    ],
                },
            }),
        ],
    };

    console.info(`\x1B[36m%s\x1B[0m`, `TypeScript options: `, prt2Options);

    const bundle = await rollup(inputOptions);

    await bundle.write({
        banner,
        file: to,
        format: `es`,
        generatedCode: {
            constBindings: true,
        },
    });

    /**
     * @note:
     * The rollup bundle must be closed once `write` is finished to let plugins clean up their external
     * processes or services via the `closeBundle` hook, otherwise it can lead to memory leaks.
     */
    await bundle.close();
}
