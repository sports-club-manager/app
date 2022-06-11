import { getPageList } from "$lib/db";

export async function get() {
    return {
        body: { pages: await getPageList() },
    };
}
