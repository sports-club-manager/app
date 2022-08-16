export const load = async ({ url, fetch }) => {
    const pathComponents = url.pathname.split("/");
    let idx = pathComponents.length > 1 ? 1 : 0;

    let response = await fetch(`/tournaments`);
    let data = await response.json();
    let _t = data.tournament;

    response = await fetch(`/pages`);
    data = await response.json();
    let _p = data.pages;

    /*
    return {
        props: {
            routeKey: pathComponents[idx],
            tournament: _t,
            pages: _p,
        },
        stuff: {
            tournament: _t,
            pages: _p,
        },
    };
    */
    return {
        routeKey: pathComponents[idx],
        tournament: _t,
        pages: _p,
    };

};
