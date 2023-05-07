/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ url, fetch, locals }) => {
    const pathComponents = url.pathname.split("/");
    let idx = pathComponents.length > 1 ? 1 : 0;

    let response = await fetch(`/api/tournaments`);
    let data = await response.json();
    let _t = data.tournament;

    response = await fetch(`/api/pages`);
    data = await response.json();
    let _p = data.pages;

    return {
        session: await locals.getSession(),
        routeKey: pathComponents[idx],
        tournament: _t,
        pages: _p,
    };
};
