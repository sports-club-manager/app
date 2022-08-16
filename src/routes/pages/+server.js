import { getPageList } from "$lib/db";

export async function GET() {
    return {
        body: { pages: await getPageList() },
    };
}
