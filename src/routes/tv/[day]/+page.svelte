<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import LayoutGrid, { Cell as GridCell } from "@smui/layout-grid";

    import { io } from "$lib/socket-client";
    import { awayScore, homeScore, time } from "$lib/collections";
    import { typewriter } from "$lib/transitions";
    import LeagueTable from "$lib/components/LeagueTable.svelte";

    export let data;

    let { day, results } = data;
    let flash = "";
    let resultsLastHour, uniqueComps, groupTables;

    const getResultsForComp = (results, comp) => {
        return results.filter(
            (r) => r.competition.name == comp.name && r.competition.section == comp.section && r.competition.group == comp.group
        );
    };

    $: {
        // find any match with dateTime within the last hour, and then
        // all other results in the same competition
        let _d = time(new Date()).split(":");
        let now = (_d[0] * 3600 + _d[1] * 60) * 1000;
        let hourAgo = now - 3600000;

        resultsLastHour = results.filter((r) => (r.day = day && r.dateTime <= now && r.dateTime >= hourAgo));
        uniqueComps = [...new Set(resultsLastHour.map((r) => JSON.stringify(r.competition)))].map((c) => JSON.parse(c));

        groupTables = {};

        // TODO refactor out - this is basically the same as the admin screen
        for (let i = 0; i < uniqueComps.length; i++) {
            if (uniqueComps[i].group != undefined) {
                let key = JSON.stringify(uniqueComps[i]);
                if (groupTables[key] == undefined) groupTables[key] = getResultsForComp(results, uniqueComps[i]);
            }
        }
    }

    onMount(() => {
        io.on("save-result", (result) => {
            for (let i = 0; i < results.length; i++) {
                if (results[i]._id == result._id) {
                    results[i] = result;
                    break;
                }
            }

            let c = result.competition;
            let content = `${time(new Date())}  [ ${c.name}/${c.section} ${c.group ? "G" + c.group : ""} ]`;
            content = `${content} ${result.homeTeam} `;

            if (result.homeGoals == undefined) {
                content = `CORRECTION:  ${content}X - X`;
            } else {
                content = `${content}${homeScore(result)} - ${awayScore(result)}`;
            }
            content = `${content} ${result.awayTeam}`;

            flash = content;
        });
    });
</script>

<div class="section-body">
    <div id="teleprompter">
        {#key flash}
            <p in:typewriter={{ speed: 3 }}>{flash}</p>
        {/key}
    </div>

    <LayoutGrid>
        {#each Object.keys(groupTables) as table}
            <GridCell spanDevices={{ desktop: 4, tablet: 12, phone: 12 }}>
                <div class="header">
                    {groupTables[table][0].competition.name}
                    {groupTables[table][0].competition.section} / G{groupTables[table][0].competition.group}
                </div>
                <LeagueTable bind:results={groupTables[table]} />
            </GridCell>
        {/each}
    </LayoutGrid>
</div>

<style>
    #teleprompter {
        font-family: Roboto Mono, monospace;
        font-size: smaller;
        height: 30px;
        background-color: #040;
    }
    p {
        margin: 0;
        padding: 6px;
        font-weight: bold;
        color: lightgreen;
    }
    div.header {
        font-size: 1.2em;
        border-bottom: 1px solid;
        padding: 4px;
        text-align: center;
    }
</style>
