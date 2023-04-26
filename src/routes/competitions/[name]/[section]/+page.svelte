<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import Tab, { Icon, Label } from "@smui/tab";
    import Button from "@smui/button";
    import TabBar from "@smui/tab-bar";
    import LayoutGrid, { Cell } from "@smui/layout-grid";

    import "$lib/global.scss";
    import { io } from "$lib/socket-client";
    import { dateTimeSort, saveRemoveResults, time } from "$lib/collections.js";
    import ResultList from "$lib/components/ResultList.svelte";
    import LeagueTable from "$lib/components/LeagueTable.svelte";
    import Section from "$lib/components/Section.svelte";

    export let data;
    $: ({ tournament, name, section, results } = data);

    let active = "1";
    let otherComps = [];
    let competition = [];
    let groups = [];
    let groupResults = [];
    let koResults = [];
    let startTime, endTime;

    $: {
        otherComps = tournament.competitions.filter((c) => c.name === name && c.section !== section);
        competition = tournament.competitions.find((c) => c.name === name && c.section === section);

        let i = 1;
        groups = [];
        while (i <= competition.groups) groups.push("" + i++);
        if (parseInt(active) > groups.length) active = "1";

        groupResults = results.filter(
            (r) => r.competition.name == name && r.competition.section == section && r.competition.group == parseInt(active)
        );
        groupResults.sort(dateTimeSort);

        koResults = results.filter(
            (r) => r.competition.name == name && r.competition.section == section && r.competition.group == undefined
        );
        koResults.sort(dateTimeSort);

        startTime = groupResults.length > 0 ? time(groupResults[0].dateTime) : "";
        endTime =
            koResults.length > 0
                ? time(koResults[koResults.length - 1].dateTime + 900000)
                : groupResults.length > 0
                ? time(groupResults[groupResults.length - 1].dateTime + 900000)
                : "";
    }

    // ----------------------------------------------------------------------

    onMount(() => {
        io.on("save-result", (result) => {
            console.debug("Received result", result);
            for (let i = 0; i < results.length; i++) {
                if (results[i]._id == result._id) {
                    console.debug(`Found result to update: ${i}`);
                    results[i] = result;
                    break;
                }
            }
        });

        io.on("remove-result", (resultId) => {
            console.debug("Result deleted", resultId);
            for (let i = 0; i < results.length; i++) {
                if (results[i]._id == resultId) {
                    console.debug(`Found result to remove: ${i}`);
                    results.splice(i, 1);
                    break;
                }
            }
        });
    });
</script>

<svelte:head>
    <title>{name} : {section} Section</title>
</svelte:head>

<Section fab={name} container={false}>
    <div slot="section-head">
        <h4>{section} Section</h4>
        <ul>
            <li>
                {groups.length} Groups {#if koResults.length > 0} with knock out games{/if}
            </li>
            <li>
                {#if startTime !== ""}
                    Starts on day {groupResults[0].day} at {startTime}, ends appx. {endTime}
                {:else}
                    No fixtures found for this section
                {/if}
            </li>
        </ul>

        {#if otherComps.length > 0}
            <p>
                Other sections for this age group:<br />

                {#each otherComps as { section }}
                    <Button name={`${section} Section`} color="secondary" href="/competitions/{name}/{section}">
                        <Icon class="material-icons">sports_soccer</Icon>
                        <Label>{section}</Label>
                    </Button>
                {/each}
            </p>
        {/if}
    </div>

    <div slot="section-body">
        <TabBar tabs={groups} let:tab bind:active>
            <Tab {tab} minWidth>
                <Label>GRP {tab}</Label>
            </Tab>
        </TabBar>

        {#if groupResults.length > 0}
            <LayoutGrid>
                <Cell spanDevices={{ desktop: 6, tablet: 12, phone: 12 }}>
                    <LeagueTable bind:results={groupResults} />
                </Cell>
                <Cell spanDevices={{ desktop: 6, tablet: 12, phone: 12 }}>
                    <ResultList bind:results={groupResults} />
                </Cell>
            </LayoutGrid>
        {/if}

        {#if groupResults.length == 0 && koResults.length == 0}
            <LayoutGrid>
                <Cell span={12}>No games have been created in this group.</Cell>
            </LayoutGrid>
        {/if}
    </div>
</Section>

{#if koResults.length > 0}
    <Section container={false}>
        <div slot="section-head">
            <div class="content">
                <h5>KO Matches</h5>
            </div>
        </div>

        <div slot="section-body">
            <LayoutGrid>
                <Cell span={12}>
                    <ResultList bind:results={koResults} />
                </Cell>
            </LayoutGrid>
        </div>
    </Section>
{/if}

<style>
    ul,
    li {
        list-style: square inside;
        padding: 0;
        margin: 0;
    }
</style>
