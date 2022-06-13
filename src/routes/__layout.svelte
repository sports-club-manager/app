<script context="module">
    export const load = async ({ url, fetch }) => {

        const pathComponents = url.pathname.split("/");
        let idx = pathComponents.length > 1 ? 1 : 0;

        let response = await fetch(`/tournaments`);
        let data = await response.json();
        let _t = data.tournament;

        response = await fetch(`/pages`);
        data = await response.json();
        let _p = data.pages;

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
    };
</script>

<script>
    import "$lib/app.scss";
    import MenuDrawer from "$lib/components/MenuDrawer.svelte";
    import PageTransition from "$lib/components/PageTransition.svelte";

    import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
    import IconButton from "@smui/icon-button";
    let drawerOpen = false;

    export let routeKey, tournament, pages, user;
</script>

<MenuDrawer bind:open={drawerOpen} {tournament} {pages} user={user || {}} />

<div class="flex-layout">
    <main>
        <TopAppBar variant="standard" dense>
            <Row>
                <Section>
                    <IconButton class="material-icons" on:click={() => (drawerOpen = !drawerOpen)}>menu</IconButton>
                    <Title>{tournament.name}</Title>
                </Section>
                <Section align="end" toolbar>
                    <a href="/"><IconButton class="material-icons" aria-label="Home">home</IconButton></a>
                </Section>
            </Row>
        </TopAppBar>
    </main>

    <PageTransition refresh={routeKey}>
        <section id="slot">
            <slot />
        </section>
    </PageTransition>

    <section id="footer">
        <p>&copy; Darren Davison &amp; <a href={tournament.siteUrl}>{tournament.club}</a> 2022</p>
    </section>
</div>

<style>
    .flex-layout {
        flex-direction: column;
        min-height: 100vh;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: space-between;
        color: var(--mdc-theme-on-primary);
        overflow: hidden;
    }

    #slot {
        padding-top: 38px;
        margin: 10px auto;
        max-width: 1200px;
        width: 100%;
        min-height: 81vh;
    }

    #footer {
        padding: 2.9em 0;
        margin: 0;
        text-align: center;
        color: var(--mdc-theme-on-primary);
        font-size: smaller;
    }

    #footer a {
        color: #f5f5f5;
        border-bottom: 1px dotted #f5f5f5;
        text-decoration: none;
    }
</style>
