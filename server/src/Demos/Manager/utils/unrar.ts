// tslint:disable-next-line: no-var-requires
const unrar: any = require('unrar-promise');

export async function extract(scopePath: string, targetPath: string): Promise<void> {
    try {
        await unrar.unrar(scopePath, targetPath)
    } catch(e) {
        throw e
    }
}
